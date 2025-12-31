import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, COMMON_STYLES, FONT_SIZES } from '../constants/theme';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * @param {Object} props
 * @param {import('../models/TestScreenConfig').TestScreenConfig} props.config
 * @param {() => void} props.onBack
 * @param {() => void} props.onFinish
 */

export default function TestScreen({ config, onBack, onFinish }) {
    // Config is assumed to be valid instance of TestConfig
    const { type, number, count } = config;
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [startTime, setStartTime] = useState(Date.now());

    // State for feedback and interaction control
    const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
    const [waitingForNext, setWaitingForNext] = useState(false);

    useEffect(() => {
        generateQuestions();
        setStartTime(Date.now());
    }, [config]);

    // Auto-focus input when question changes
    useEffect(() => {
        if (!waitingForNext && questions.length > 0) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, waitingForNext, questions.length]);

    const generateQuestions = () => {
        const newQuestions = [];
        for (let i = 0; i < count; i++) {
            // Determine operands
            // One operand is the selected 'number'. The other is random 0-9.
            const other = randomInt(0, 9);
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
                // For subtraction:
                // Case 1: x - number = ? (e.g. 12 - 5) -> x must be >= number. x can go up to say number + 12.
                // Case 2: number - x = ? (e.g. 5 - 2) -> x must be <= number.

                // Let's bias towards "x - number" as that's more common in drills for learning "subtraction tables".
                // But mixed is good.

                // Let's strictly follow: "at least one of the numbers must match the number selected".
                // So operands are (A, B). One of them is 'number'.

                // If A is 'number': number - B. (B <= number)
                // If B is 'number': A - number. (A >= number)

                const subtractFromSelected = Math.random() < 0.3; // 30% chance to do 5 - x

                if (subtractFromSelected) {
                    const sub = randomInt(0, number);
                    q = {
                        val1: number,
                        val2: sub,
                        operator: '-',
                        answer: number - sub
                    };
                } else {
                    // Subtract selected number from something larger
                    const total = number + randomInt(0, 9);
                    q = {
                        val1: total,
                        val2: number,
                        operator: '-',
                        answer: total - number
                    };
                }
            }

            newQuestions.push(q);
        }
        setQuestions(newQuestions);
    };

    const handleAnswer = () => {
        if (!inputValue) return;

        const currentQ = questions[currentIndex];
        const userAnswer = parseInt(inputValue, 10);
        const isCorrect = userAnswer === currentQ.answer;

        // Calculate time for this specific question
        const timeTaken = Date.now() - startTime;

        const newAnswers = [...userAnswers, { ...currentQ, userAnswer, isCorrect, timeTaken }];
        setUserAnswers(newAnswers);

        // Show feedback
        setFeedback(isCorrect ? 'correct' : 'incorrect');
        setWaitingForNext(true);

        // Clear input immediately so it's ready for next time, but keyboard stays up or handles naturally
        setInputValue('');

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setFeedback(null);
                setWaitingForNext(false);
                setCurrentIndex(prev => prev + 1);
                // Reset start time for the NEW question
                setStartTime(Date.now());
            } else {
                // Calculate total time by summing up individual question times
                const totalTime = newAnswers.reduce((acc, curr) => acc + curr.timeTaken, 0);
                const correctCount = newAnswers.filter(a => a.isCorrect).length;

                onFinish({
                    correct: correctCount,
                    total: count,
                    totalTime: totalTime,
                    history: newAnswers
                });
            }
        }, 1500); // 1.5s delay for feedback
    };

    if (questions.length === 0) return null;

    const currentQ = questions[currentIndex];
    const progress = (currentIndex / count) * 100;

    // Determine colors
    const themeColors = COLORS.accent[type] || COLORS.accent.addition;

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
                    <View style={styles.contentContainer}>
                        {/* Header / Progress */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onBack} style={styles.backButton}>
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

                        {/* Question Display */}
                        <View style={styles.questionContainer}>
                            {currentQ && !feedback && (
                                <Text style={styles.questionText}>
                                    {currentQ.val1} {currentQ.operator} {currentQ.val2} = ?
                                </Text>
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
                                                Answer: {currentQ.answer}
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
                                        placeholder="#"
                                        placeholderTextColor={COLORS.text.secondary + '40'} // light opacity
                                        onSubmitEditing={handleAnswer}
                                        returnKeyType="done"
                                        autoFocus={false} // Let user tap to launch keyboard as requested ("text box which will launch...")
                                    />
                                </View>

                            </View>
                        )}

                        {/* Placeholder to adjust layout when controls are hidden */}
                        {feedback && <View style={styles.controlsPlaceholder} />}
                    </View>
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
        lineHeight: 24, // Matches 1.5 multiplier usually, but explicit in design
    },
    progressBarContainer: {
        height: 8, // Reduced from 12 as per screenshot/std
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

});
