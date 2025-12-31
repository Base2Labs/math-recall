import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../constants/theme';
import ScreenWrapper from './ScreenWrapper';

/**
 * Initial splash screen component shown on app launch.
 */
export default function SplashScreen() {
  return (
    <ScreenWrapper style={styles.contentContainer}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/brain-icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Math Master</Text>
        <Text style={styles.tagline}>Practice makes perfect</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.ui.white, // Keep icon bg white if needed, or remove for transparent
    borderRadius: 80, // Make it a circle if it has a bg
    marginBottom: 16,
  },
  icon: {
    width: '80%',
    height: '80%',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text.primary, // Might need to check contrast on gradient
    textAlign: 'center',
  },
  tagline: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
