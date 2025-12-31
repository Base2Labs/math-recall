import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, COMMON_STYLES, FONT_SIZES } from '../constants/theme';
import { calculatePercentage, calculateAverageTime, formatTime } from '../utils/resultCalculations';
import ScreenWrapper from './ScreenWrapper';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * @param {Object} props
 * @param {Object} props.results { correct, total, totalTime, averageTime }
 * @param {() => void} props.onHome
 * @param {() => void} props.onRetry
 */
export default function ResultsScreen({ results, onHome, onRetry }) {
    const { correct, total, totalTime } = results;
    const percentage = calculatePercentage(correct, total);
    const averageTime = calculateAverageTime(totalTime, total); // Calculate again or use passed if pre-calculated

    // Animations
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnimation, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const isGoodScore = percentage >= 80;
    const message = isGoodScore ? "Great Job!" : "Keep Practicing!";
    const iconColor = isGoodScore ? COLORS.status.success : COLORS.status.warning;

    return (
        <ScreenWrapper>
            <Animated.View style={[styles.content, { opacity: fadeAnimation, transform: [{ scale: scaleAnimation }] }]}>

                <Text style={styles.headerText}>{message}</Text>

                {/* Score Circle */}
                <View style={styles.scoreContainer}>
                    <View style={[styles.scoreCircle, { borderColor: iconColor }]}>
                        <Text
                            style={[styles.scorePercentage, { color: iconColor }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.5}
                        >
                            {percentage}%
                        </Text>
                        <Text style={styles.scoreText}>
                            {correct} / {total} Correct
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Time</Text>
                        <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
                    </View>
                    <View style={styles.statSeparator} />
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Avg Time</Text>
                        <Text style={styles.statValue}>{formatTime(averageTime)}</Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={onHome}>
                        <Text style={styles.primaryButtonText}>Main Menu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onRetry}>
                        <Text style={styles.secondaryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    headerText: {
        fontSize: FONT_SIZES.hero,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 48,
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    scoreCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: COLORS.ui.white,
        borderWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
        ...COMMON_STYLES.shadow,
    },
    scorePercentage: {
        fontSize: 56, // Adjusted to fit 100% comfortably
        fontWeight: 'bold',
        paddingHorizontal: 20,
        textAlign: 'center',
        width: '100%',
    },
    scoreText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text.secondary,
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.ui.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 48,
        ...COMMON_STYLES.shadow,
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: FONT_SIZES.label,
        color: COLORS.text.secondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: FONT_SIZES.heading,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    statSeparator: {
        width: 1,
        height: '80%',
        backgroundColor: COLORS.ui.border,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: COLORS.brand.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        ...COMMON_STYLES.shadow,
    },
    primaryButtonText: {
        color: COLORS.text.white,
        fontSize: FONT_SIZES.heading,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: COLORS.ui.white,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        ...COMMON_STYLES.shadow,
    },
    secondaryButtonText: {
        color: COLORS.text.primary,
        fontSize: FONT_SIZES.heading,
        fontWeight: '600',
    }
});
