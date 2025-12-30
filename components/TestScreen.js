import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
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
    // ... [Same state init] ...
    // Config is assumed to be valid instance of TestConfig
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

    // ... [Same useEffects] ...
    useEffect(() => {
        generateQuestions();
    }, [config]);

    // Reset timer when question changes
    useEffect(() => {
        if (!waitingForNext && questions.length > 0) {
            startTimeRef.current = Date.now();
            setInputValue('');
        }
    }, [currentIndex, waitingForNext, questions.length]);


    const generateQuestions = () => {
        const newQuestions = [];
        for (let i = 0; i < count; i++) {
            const other = randomInt(0, 12);
            const isFirst = Math.random() < 0.5;
            let q = {};

            if (type === 'addition') {
                q = {
                    val1: isFirst ? number : other,
                    val2: isFirst ? other : number,
                    operator: '+',
                    answer: number + other
                };
            } else if (type === 'multiplication') {
                q = {
                    val1: isFirst ? number : other,
                    val2: isFirst ? other : number,
                    operator: '×',
                    answer: number * other
                };
            } else if (type === 'subtraction') {
                const subtractFromSelected = Math.random() < 0.3; // 30% chance to do 5 - x
                if (subtractFromSelected) {
                    const sub = randomInt(0, number);
                    q = {
                        val1: number, val2: sub, operator: '-', answer: number - sub
                    };
                } else {
                    const total = number + randomInt(0, 12);
                    q = {
                        val1: total, val2: number, operator: '-', answer: total - number
                    };
                }
            }
            newQuestions.push(q);
        }
        setQuestions(newQuestions);
    };

    const handleAnswer = () => {
        if (waitingForNext || !inputValue) return;

        const currentQ = questions[currentIndex];
        const userAnswer = parseInt(inputValue, 10);
        const endTime = Date.now();
        const timeTaken = endTime - startTimeRef.current;
        const isCorrect = userAnswer === currentQ.answer;

        Keyboard.dismiss();
        setWaitingForNext(true);
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        // Update stats
        setStats(prev => ({
            ...prev,
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            questionTimes: [...prev.questionTimes, timeTaken]
        }));

        // Wait and advance
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setFeedback(null);
                setWaitingForNext(false);
                setCurrentIndex(prev => prev + 1);
            } else {
                finishTest(isCorrect ? stats.correct + 1 : stats.correct, [...stats.questionTimes, timeTaken]);
            }
        }, NEXT_QUESTION_DELAY);
    };

    const finishTest = (finalCorrect, finalTimes) => {
        const totalTime = calculateTotalTime(finalTimes);
        const averageTime = calculateAverageTime(totalTime, stats.totalQuestions);

        const results = {
            correct: finalCorrect,
            total: stats.totalQuestions,
            totalTime: totalTime,
            averageTime: averageTime
        };
        onFinish(results);
    };

    if (questions.length === 0) return null;

    const currentQ = questions[currentIndex];
    const progress = (currentIndex / count) * 100;

    // Determine colors
    const themeColors = COLORS.accent[type] || COLORS.accent.addition;

    // Feedback Content
    const renderFeedback = () => {
        if (!feedback) return null;

        const isCorrect = feedback === 'correct';
        return (
            <View style={styles.feedbackContainer}>
                {isCorrect ? (
                    <>
                        <View style={styles.iconCircleSuccess}>
                            <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.ui.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M20 6L9 17l-5-5" />
                            </Svg>
                        </View>
                        <Text style={styles.feedbackTextSuccess}>Correct!</Text>
                    </>
                ) : (
                    <>
                        <View style={styles.iconCircleError}>
                            <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.ui.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M18 6L6 18M6 6l12 12" />
                            </Svg>
                        </View>
                        <Text style={styles.feedbackTextError}>Incorrect</Text>
                        <Text style={styles.correctAnswerText}>
                            Answer: {currentQ.answer}
                        </Text>
                    </>
                )}
            </View>
        );
    };


    return (
        <LinearGradient
            {...COMMON_STYLES.gradientProps}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoid}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.contentContainer}>
                            {/* Header / Progress */}
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={waitingForNext}>
                                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.text.secondary} strokeWidth="2">
                                        <Path d="M15 18l-6-6 6-6" />
                                    </Svg>
                                </TouchableOpacity>

                                <View style={styles.progressColumn}>
                                    <View style={styles.questionTextContainer}>
                                        <Text style={styles.questionProgressText}>
                                            Question {currentIndex + 1} of {count}
                                        </Text>
                                    </View>
                                    <View style={styles.progressBarContainer}>
                                        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: themeColors[0] }]} />
                                    </View>
                                </View>

                                <View style={{ width: 24 }} />
                            </View>

                            {/* Question Display or Feedback */}
                            <View style={styles.questionContainer}>
                                {feedback ? (
                                    renderFeedback()
                                ) : (
                                    <Text style={styles.questionText}>
                                        {currentQ.val1} {currentQ.operator} {currentQ.val2} = ?
                                    </Text>
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
                                            placeholder="#"
                                            placeholderTextColor={COLORS.text.secondary + '40'}
                                            onSubmitEditing={handleAnswer}
                                            returnKeyType="done"
                                            autoFocus={false}
                                            editable={!waitingForNext}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.nextButton, { backgroundColor: themeColors[0] }]}
                                        onPress={handleAnswer}
                                        disabled={waitingForNext}
                                    >
                                        <Text style={styles.nextButtonText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Spacer for feedback view to keep layout stable if controls are hidden or just take up space */}
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
        backgroundColor: '#4CAF50', // Success Green
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...COMMON_STYLES.shadow,
    },
    iconCircleError: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F44336', // Error Red
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...COMMON_STYLES.shadow,
    },
    feedbackTextSuccess: {
        fontSize: FONT_SIZES.display,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    feedbackTextError: {
        fontSize: FONT_SIZES.display,
        fontWeight: 'bold',
        color: '#F44336',
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
