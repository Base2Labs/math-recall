import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';

/**
 * Math Icon Component
 * Figma: Math-Recall-App / Splash Screen / StartupScreen / Container / Icon
 * Node ID: 1:51
 * 
 * Contains 8 math symbol vectors arranged in a circular pattern
 */
function MathIcon() {
  return (
    <Svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      {/* Vector 1:52 - Vertical line (top center) */}
      <Path d="M48 20L48 76" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Vector 1:53 - Equals center */}
      <Path d="M42 44H54M42 52H54" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Vector 1:54 - Minus top */}
      <Path d="M36 20H60" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Vector 1:55 - Plus top left */}
      <Path d="M20 28V44M12 36H28" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Vector 1:56 - Minus top right */}
      <Path d="M68 36H84" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Vector 1:57 - Multiply bottom */}
      <Path d="M40 76L56 76M48 68L48 84" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Vector 1:58 - Plus bottom left */}
      <Path d="M20 68V84M12 76H28" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Vector 1:59 - Plus bottom right */}
      <Path d="M76 68V84M68 76H84" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

/**
 * Splash Screen Component
 * Figma: Math-Recall-App / Splash Screen
 * Node ID: 1:48
 */
export default function SplashScreen() {
  return (
    <LinearGradient
      colors={['#EFF6FF', '#FAF5FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Icon Container - Node ID: 1:50 */}
        <LinearGradient
          colors={['#2B7FFF', '#9810FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <MathIcon />
        </LinearGradient>

        {/* Title - Node ID: 1:60 */}
        <Text style={styles.title}>Math Master</Text>

        {/* Tagline - Node ID: 1:62 */}
        <Text style={styles.tagline}>Practice makes perfect</Text>
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
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '#155DFC',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#4A5565',
    textAlign: 'center',
  },
});
