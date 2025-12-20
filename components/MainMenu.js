import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 48 - 32) / 3; // (Screen width - horizontal padding - gap) / 3

export default function MainMenu() {
    return (
        <LinearGradient
            colors={['#EFF6FF', '#FAF5FF']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Choose Your Practice</Text>

                <View style={styles.grid}>
                    {/* Addition Button */}
                    <TouchableOpacity style={styles.buttonWrapper}>
                        <LinearGradient
                            colors={['#05DF72', '#00A63E']}
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
                    <TouchableOpacity style={styles.buttonWrapper}>
                        <LinearGradient
                            colors={['#FF9F43', '#FF6B6B']}
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
                    <TouchableOpacity style={styles.buttonWrapper}>
                        <LinearGradient
                            colors={['#C27AFF', '#9810FA']}
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
        color: '#1E2939',
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
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align content to left as per design? Design had icon top-left, text bottom-left? 
        // Wait, looking at design again:
        // Icon is absolute at top/left?
        // "Addition" text is absolute at bottom/left?
        // Let's use flexbox to approximate.

        // Per screenshot:
        // Green button: Plus sign is centered vertically? No, looks slightly upper.
        // Text is at bottom.
        // Actually, in the screenshot they look centered horizontally and vertically grouped? 
        // Wait, let me re-examine the screenshot.
        // Screenshot:
        // Green Box. Plus is Centered. "Addition" is below it.
        // Orange Box. Minus is Centered. "Subtraction" is below it.
        // Purple Box. Cross is Centered. "Multiplication" is below it.
        // They look like:
        // flex-col, justify-center, items-center.

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
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
