import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { COLORS, COMMON_STYLES, FONT_SIZES } from '../constants/theme';

/**
 * @param {Object} props
 * @param {(type: string) => void} props.onSelectPracticeType
 */
export default function MainMenu({ onSelectPracticeType }) {
    const { width } = useWindowDimensions();
    const isVertical = width < 600;

    const renderButton = (type, label, iconPath, colors) => {
        // Dynamic styles based on layout mode
        const wrapperStyle = isVertical
            ? styles.buttonWrapperVertical
            : styles.buttonWrapperHorizontal;

        const buttonInnerStyle = isVertical
            ? styles.buttonInnerVertical
            : styles.buttonInnerHorizontal;

        const iconStyle = isVertical
            ? styles.iconContainerVertical
            : styles.iconContainerHorizontal;

        const textStyle = isVertical
            ? styles.buttonTextVertical
            : styles.buttonTextHorizontal;

        return (
            <TouchableOpacity
                key={type}
                style={[styles.buttonWrapperBase, wrapperStyle]}
                onPress={() => onSelectPracticeType(type)}
            >
                <LinearGradient
                    colors={colors}
                    style={[styles.buttonBase, buttonInnerStyle]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={iconStyle}>
                        <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <Path d={iconPath} />
                        </Svg>
                    </View>
                    <Text style={textStyle}>{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            {...COMMON_STYLES.gradientProps}
            style={styles.container}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.content, { maxWidth: isVertical ? 600 : 800 }]}>
                    <Text style={styles.title}>Choose Your Practice</Text>

                    <View style={[styles.grid, isVertical && styles.gridVertical]}>
                        {renderButton('addition', 'Addition', "M12 5v14M5 12h14", COLORS.accent.addition)}
                        {renderButton('subtraction', 'Subtraction', "M5 12h14", COLORS.accent.subtraction)}
                        {renderButton('multiplication', 'Multiplication', "M18 6L6 18M6 6l12 12", COLORS.accent.multiplication)}
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    content: {
        width: '100%',
        paddingHorizontal: 24,
        gap: 32, // Reduced gap for better fit
        alignSelf: 'center',
    },
    title: {
        fontSize: FONT_SIZES.body,
        color: COLORS.text.primary,
        textAlign: 'center',
        fontWeight: '400',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
    },
    gridVertical: {
        flexDirection: 'column',
    },

    // Base Styles
    buttonWrapperBase: {
        // Common props if any
    },
    buttonBase: {
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...COMMON_STYLES.shadow,
    },

    // Horizontal (Wide) Styles
    buttonWrapperHorizontal: {
        flex: 1,
        aspectRatio: 1,
        maxWidth: 200, // Prevent massive buttons on huge screens
    },
    buttonInnerHorizontal: {
        flex: 1,
        width: '100%',
        padding: 12,
    },
    iconContainerHorizontal: {
        marginBottom: 8,
    },
    buttonTextHorizontal: {
        color: 'white',
        fontSize: FONT_SIZES.caption,
        fontWeight: '500',
        textAlign: 'center',
    },

    // Vertical (Narrow) Styles
    buttonWrapperVertical: {
        width: '100%',
        height: 80, // Fixed height bar
    },
    buttonInnerVertical: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 24,
        justifyContent: 'flex-start', // Left align content
    },
    iconContainerVertical: {
        marginRight: 16,
    },
    buttonTextVertical: {
        color: 'white',
        fontSize: FONT_SIZES.subheading,
        fontWeight: '600',
        textAlign: 'left',
    },
});
