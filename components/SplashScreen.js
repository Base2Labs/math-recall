import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../constants/theme';

/**
 * Initial splash screen component shown on app launch.
 */
export default function SplashScreen() {
  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ui.white,
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
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.brand.primary,
    textAlign: 'center',
  },
  tagline: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
