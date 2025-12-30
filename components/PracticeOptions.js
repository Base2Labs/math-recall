import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { COLORS, COMMON_STYLES, FONT_SIZES } from '../constants/theme';

import { TestScreenConfig } from '../models/TestScreenConfig';

// ... existing imports

const { width } = Dimensions.get('window');

const HeaderBackButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.text.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M15 18l-6-6 6-6" />
        </Svg>
        <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>
);

const SelectionButton = ({ label, isSelected, onPress, color, style, textStyle }) => (
    <TouchableOpacity
        style={[
            styles.baseButton,
            style,
            isSelected && [styles.selectedButton, { borderColor: color }]
        ]}
        onPress={onPress}
    >
        <Text style={[
            styles.baseText,
            textStyle,
            isSelected && [styles.selectedText, { color: color }]
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const StartButton = ({ enabled, onPress, color }) => (
    <TouchableOpacity
        style={[styles.startButton, !enabled && styles.disabledButton]}
        onPress={onPress}
        disabled={!enabled}
    >
        {enabled ? (
            <LinearGradient
                colors={color}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.startButtonText}>Start Practice</Text>
            </LinearGradient>
        ) : (
            <View style={styles.disabledButtonContent}>
                <Text style={styles.startButtonText}>Start Practice</Text>
            </View>
        )}
    </TouchableOpacity>
);

/**
 * @param {Object} props
 * @param {string} props.practiceType
 * @param {() => void} props.onBack
 * @param {(config: import('../models/TestScreenConfig').TestScreenConfig) => void} props.onStart
 */
export default function PracticeOptions({ practiceType, onBack, onStart }) {
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [questionCount, setQuestionCount] = useState(null);

    // Simplified color logic
    const primaryColor = COLORS.accent[practiceType] || COLORS.accent.addition;
    const accentBorderColor = primaryColor[1];

    const isStartEnabled = selectedNumber !== null && questionCount !== null;

    const handleStart = () => {
        if (isStartEnabled) {
            try {
                const config = new TestScreenConfig(practiceType, selectedNumber, questionCount);
                onStart(config);
            } catch (error) {
                console.error("Failed to start practice:", error.message);
            }
        }
    };

    return (
        <LinearGradient
            {...COMMON_STYLES.gradientProps}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.headerContainer}>
                    <HeaderBackButton onPress={onBack} />
                </View>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <View style={styles.card}>
                            <Text style={styles.title}>
                                {practiceType.charAt(0).toUpperCase() + practiceType.slice(1)} Practice
                            </Text>

                            {/* Number Selection */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Select Number</Text>
                                <View style={styles.numberGrid}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <SelectionButton
                                            key={num}
                                            label={num}
                                            isSelected={selectedNumber === num}
                                            onPress={() => setSelectedNumber(num)}
                                            color={accentBorderColor}
                                            style={styles.numberButton}
                                            textStyle={styles.numberText}
                                        />
                                    ))}
                                </View>
                            </View>

                            {/* Question Count Selection */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Number of Questions</Text>
                                <View style={styles.countRow}>
                                    {[10, 20, 30].map((count) => (
                                        <SelectionButton
                                            key={count}
                                            label={`${count} Questions`}
                                            isSelected={questionCount === count}
                                            onPress={() => setQuestionCount(count)}
                                            color={accentBorderColor}
                                            style={styles.countButton}
                                            textStyle={styles.countText}
                                        />
                                    ))}
                                </View>
                            </View>

                            <StartButton
                                enabled={isStartEnabled}
                                onPress={handleStart}
                                color={primaryColor}
                            />
                        </View>
                    </View>
                </ScrollView>
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
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 16, // Reduced top padding since header is separate
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    content: {
        width: '100%',
        paddingHorizontal: 16,
        maxWidth: 600,
        alignSelf: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        // Removed marginBottom as it's handled by container padding
    },
    backText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text.secondary,
        marginLeft: 4,
    },
    card: {
        backgroundColor: COLORS.ui.white,
        borderRadius: 24,
        padding: 24,
        ...COMMON_STYLES.shadowLarge,
        width: '100%',
    },
    title: {
        fontSize: FONT_SIZES.heading,
        fontWeight: '600',
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: 32,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.text.secondary,
        marginBottom: 12,
        fontWeight: '500',
    },
    // Shared Button Styles
    baseButton: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.ui.white,
    },
    selectedButton: {
        backgroundColor: COLORS.ui.selected,
        borderWidth: 2,
    },
    baseText: {
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    selectedText: {
        fontWeight: '700',
    },
    // Specific Layouts
    numberGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    numberButton: {
        width: '30%',
        aspectRatio: 1.5,
        height: 48,
        marginBottom: 8,
    },
    numberText: {
        fontSize: FONT_SIZES.subheading,
    },
    countRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    countButton: {
        flex: 1,
        height: 44,
    },
    countText: {
        fontSize: FONT_SIZES.caption,
    },
    startButton: {
        marginTop: 24,
        height: 56,
        borderRadius: 14,
        overflow: 'hidden',
    },
    disabledButton: {
        backgroundColor: COLORS.ui.disabled,
    },
    disabledButtonContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.ui.disabled,
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButtonText: {
        color: COLORS.ui.white,
        fontSize: FONT_SIZES.body,
        fontWeight: '600',
    },
});
