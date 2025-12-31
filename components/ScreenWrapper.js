import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COMMON_STYLES } from '../constants/theme';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {import('react-native').ViewStyle} [props.style]
 * @param {import('react-native-safe-area-context').Edges} [props.edges]
 */
export default function ScreenWrapper({ children, style, edges }) {
    return (
        <LinearGradient
            {...COMMON_STYLES.gradientProps}
            style={styles.container}
        >
            <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
                {children}
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
});
