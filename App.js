import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wait 3 seconds, then start transition
    const timer = setTimeout(() => {
      setShowMenu(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // 500ms fade duration
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showMenu) {
    return (
      <View style={styles.container}>
        <SplashScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 
        We can keep SplashScreen rendered behind or just switch. 
        For a smooth cross-dissolve, we might want both?
        But a simple fade in of the new screen is usually fine.
        Let's do a simple conditional render for now, but to animate INTO the main menu,
        we usually want the main menu to fade IN.
      */}
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <MainMenu />
      </Animated.View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
