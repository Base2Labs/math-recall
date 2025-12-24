import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { COMMON_STYLES } from '../constants/styles';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 48 - 32) / 3; // (Screen width - horizontal padding - gap) / 3

export default function MainMenu({ onSelectPracticeType }) {
    return (
        <LinearGradient
            {...COMMON_STYLES.gradientProps}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Choose Your Practice</Text>

                <View style={styles.grid}>
                    {/* Addition Button */}
                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => onSelectPracticeType('addition')}
                    >
                        <LinearGradient
                            colors={COLORS.accent.addition}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.iconContainer}>
                                <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <Path d="M12 5v14M5 12h14" />
                                </Svg>
                            </View>
                            <Text style={styles.buttonText}>Addition</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Subtraction Button */}
                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => onSelectPracticeType('subtraction')}
                    >
                        <LinearGradient
                            colors={COLORS.accent.subtraction}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.iconContainer}>
                                <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <Path d="M5 12h14" />
                                </Svg>
                            </View>
                            <Text style={styles.buttonText}>Subtraction</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Multiplication Button */}
                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => onSelectPracticeType('multiplication')}
                    >
                        <LinearGradient
                            colors={COLORS.accent.multiplication}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.iconContainer}>
                                <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <Path d="M18 6L6 18M6 6l12 12" />
                                </Svg>
                            </View>
                            <Text style={styles.buttonText}>Multiplication</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        paddingHorizontal: 24,
        gap: 48,
    },
    title: {
        fontSize: 16,
        color: COLORS.text.primary,
        textAlign: 'center',
        fontFamily: 'Arial', // Fallback, system font is usually fine
        fontWeight: '400',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    buttonWrapper: {
        flex: 1,
        aspectRatio: 1, // Make it square
    },
    button: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        ...COMMON_STYLES.shadow,
    },
    iconContainer: {
        marginBottom: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});
