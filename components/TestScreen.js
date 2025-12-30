import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { COLORS, COMMON_STYLES, FONT_SIZES } from '../constants/theme';
import { calculateTotalTime, calculateAverageTime } from '../utils/resultCalculations';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const NEXT_QUESTION_DELAY = 1500; // ms

/**
 * @param {Object} props
 * @param {import('../models/TestScreenConfig').TestScreenConfig} props.config
 * @param {() => void} props.onBack
 * @param {(results: Object) => void} props.onFinish
 */
export default function TestScreen({ config, onBack, onFinish }) {
    const { type, number, count } = config;
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');

    // State for feedback and interaction control
    const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
    const [waitingForNext, setWaitingForNext] = useState(false);

    // Stats tracking
    const [stats, setStats] = useState({
        correct: 0,
        totalQuestions: count,
        questionTimes: []
    });

    const inputRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    const generateQuestions = () => {
        const newQuestions = [];
        for (let i = 0; i < count; i++) {
            let questionText = '';
            let answer = 0;
            const other = randomInt(1, 12); // Standard practice range 1-12

            switch (type) {
                case 'addition':
                    // Random order: 5 + 3 or 3 + 5
                    if (Math.random() > 0.5) {
                        questionText = `${number} + ${other}`;
                    } else {
                        questionText = `${other} + ${number}`;
                    }
                    answer = number + other;
                    break;
                case 'subtraction':
                    // Ensure positive result. If practicing 5, maybe 12 - 5.
                    const subTotal = number + other;
                    questionText = `${subTotal} - ${number}`;
                    answer = other;
                    break;
                case 'multiplication':
                    // Random order: 5 x 3 or 3 x 5
                    if (Math.random() > 0.5) {
                        questionText = `${number} × ${other}`;
                    } else {
                        questionText = `${other} × ${number}`;
                    }
                    answer = number * other;
                    break;
                case 'division':
                    // Practicing 5: 15 / 5
                    const divTotal = number * other;
                    questionText = `${divTotal} ÷ ${number}`;
                    answer = other;
                    break;
                default:
                    questionText = `?`;
                    answer = 0;
            }
            newQuestions.push({ text: questionText, answer });
        }
        setQuestions(newQuestions);
    };

    useEffect(() => {
        generateQuestions();
    }, [config]);

    // Reset timer when question changes
    useEffect(() => {
        if (!waitingForNext && questions.length > 0) {
            startTimeRef.current = Date.now();
            setInputValue('');
            // Focus input automatically
            if (Platform.OS === 'web') {
                setTimeout(() => inputRef.current?.focus(), 50);
            } else {
                inputRef.current?.focus();
            }
        }
    }, [currentIndex, waitingForNext, questions.length]);

    const handleAnswer = () => {
        if (!inputValue) return;

        const timeTaken = Date.now() - startTimeRef.current;
        const currentQuestion = questions[currentIndex];
        const userAnswer = parseInt(inputValue, 10);
        const isCorrect = userAnswer === currentQuestion.answer;

        // Update stats
        setStats(prev => ({
            ...prev,
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            questionTimes: [...prev.questionTimes, timeTaken]
        }));

        setFeedback(isCorrect ? 'correct' : 'incorrect');
        setWaitingForNext(true);

        // Wait and move next
        setTimeout(() => {
            if (currentIndex < count - 1) {
                setFeedback(null);
                setWaitingForNext(false);
                setCurrentIndex(prev => prev + 1);
            } else {
                finishTest(isCorrect);
            }
        }, NEXT_QUESTION_DELAY);
    };

    const finishTest = (lastIsCorrect) => {
        setStats(prev => {
            const finalCorrect = lastIsCorrect ? stats.correct + 1 : stats.correct;
            const finalTimes = [...stats.questionTimes, Date.now() - startTimeRef.current];
            const totalTime = calculateTotalTime(finalTimes);
            const averageTime = calculateAverageTime(totalTime, count);

            const results = {
                correct: finalCorrect,
                total: count,
                totalTime,
                averageTime: averageTime
            };

            onFinish(results);
            return prev;
        });
    };

    const currentQuestion = questions[currentIndex];

    // Progress
    const progressPercent = ((currentIndex) / count) * 100;

    return (
        <LinearGradient
            {...COMMON_STYLES.gradientProps}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoid}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.contentContainer}>
                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.text.secondary} strokeWidth="2">
                                        <Path d="M19 12H5" />
                                        <Path d="M12 19l-7-7 7-7" />
                                    </Svg>
                                </TouchableOpacity>

                                <View style={styles.progressColumn}>
                                    <View style={styles.questionTextContainer}>
                                        <Text style={styles.questionProgressText}>
                                            Question {currentIndex + 1} of {count}
                                        </Text>
                                    </View>
                                    <View style={styles.progressBarContainer}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                {
                                                    width: `${progressPercent}%`,
                                                    backgroundColor: COLORS.brand.primary
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Question Display */}
                            <View style={styles.questionContainer}>
                                {currentQuestion && !feedback && (
                                    <Text style={styles.questionText}>{currentQuestion.text} = ?</Text>
                                )}

                                {feedback && (
                                    <View style={styles.feedbackContainer}>
                                        {feedback === 'correct' ? (
                                            <>
                                                <View style={styles.iconCircleSuccess}>
                                                    <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                                                        <Path d="M20 6L9 17l-5-5" />
                                                    </Svg>
                                                </View>
                                                <Text style={styles.feedbackTextSuccess}>Correct!</Text>
                                            </>
                                        ) : (
                                            <>
                                                <View style={styles.iconCircleError}>
                                                    <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                                                        <Path d="M18 6L6 18" />
                                                        <Path d="M6 6l12 12" />
                                                    </Svg>
                                                </View>
                                                <Text style={styles.feedbackTextError}>Incorrect</Text>
                                                <Text style={styles.correctAnswerText}>
                                                    Answer: {currentQuestion.answer}
                                                </Text>
                                            </>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Controls */}
                            {!feedback && (
                                <View style={styles.controlsContainer}>
                                    {/* Microphone Icon */}
                                    <TouchableOpacity style={styles.micButton}>
                                        <LinearGradient
                                            colors={[COLORS.ui.white, COLORS.ui.offWhite]}
                                            style={styles.micGradient}
                                        >
                                            <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.text.secondary} strokeWidth="2">
                                                <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                                <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                <Path d="M12 19v4" />
                                                <Path d="M8 23h8" />
                                            </Svg>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    {/* Input Box */}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={inputRef}
                                            style={styles.input}
                                            value={inputValue}
                                            onChangeText={setInputValue}
                                            keyboardType="number-pad"
                                            inputMode="numeric"
                                            placeholder="#"
                                            placeholderTextColor={COLORS.text.secondary + '40'}
                                            onSubmitEditing={handleAnswer}
                                            returnKeyType="done"
                                            editable={!waitingForNext}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Placeholder to adjust layout when controls are hidden */}
                            {feedback && <View style={styles.controlsPlaceholder} />}

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    backButton: {
        padding: 8,
    },
    progressColumn: {
        flex: 1,
        marginHorizontal: 16,
    },
    questionTextContainer: {
        marginBottom: 8,
    },
    questionProgressText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text.secondary,
        lineHeight: 24,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: COLORS.ui.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    questionContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        fontSize: FONT_SIZES.hero,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        fontVariant: ['tabular-nums'],
    },
    feedbackContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircleSuccess: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.status.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...COMMON_STYLES.shadow,
    },
    iconCircleError: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.status.warning, // Error Red/Orange
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...COMMON_STYLES.shadow,
    },
    feedbackTextSuccess: {
        fontSize: FONT_SIZES.display,
        fontWeight: 'bold',
        color: COLORS.status.success,
    },
    feedbackTextError: {
        fontSize: FONT_SIZES.display,
        fontWeight: 'bold',
        color: COLORS.status.warning,
    },
    correctAnswerText: {
        marginTop: 8,
        fontSize: FONT_SIZES.heading,
        color: COLORS.text.secondary,
        fontWeight: '600',
    },
    controlsContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 32,
    },
    controlsPlaceholder: {
        flex: 2,
    },
    micButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        ...COMMON_STYLES.shadow,
    },
    micGradient: {
        flex: 1,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        maxWidth: 200,
        height: 80,
    },
    input: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.ui.white,
        borderRadius: 20,
        fontSize: FONT_SIZES.display,
        textAlign: 'center',
        color: COLORS.text.primary,
        borderWidth: 2,
        borderColor: COLORS.ui.border,
        ...COMMON_STYLES.shadow,
    },
    nextButton: {
        marginTop: 20,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 16,
        ...COMMON_STYLES.shadow,
    },
    nextButtonText: {
        color: COLORS.text.white,
        fontSize: FONT_SIZES.heading,
        fontWeight: '600',
    }
});
