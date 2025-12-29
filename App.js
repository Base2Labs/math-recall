import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import PracticeOptions from './components/PracticeOptions';
import TestScreen from './components/TestScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'menu', 'options', 'practice'
  const [selectedPracticeType, setSelectedPracticeType] = useState(null);
  const [practiceConfig, setPracticeConfig] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wait 3 seconds, then start transition
    const timer = setTimeout(() => {
      setCurrentScreen('menu'); // Transition to menu instead of just showMenu=true
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // 500ms fade duration
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handlePracticeSelect = (type) => {
    setSelectedPracticeType(type);
    setCurrentScreen('options');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setSelectedPracticeType(null);
    setPracticeConfig(null);
  };

  const handleStartPractice = (config) => {
    console.log('Start Practice:', config);
    setPracticeConfig(config);
    setCurrentScreen('practice');
  };

  if (currentScreen === 'splash') {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <SplashScreen />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {currentScreen === 'menu' ? (
            <MainMenu onSelectPracticeType={handlePracticeSelect} />
          ) : currentScreen === 'options' ? (
            <PracticeOptions
              practiceType={selectedPracticeType}
              onBack={handleBackToMenu}
              onStart={handleStartPractice}
            />
          ) : (
            <TestScreen
              config={practiceConfig}
              onBack={() => setCurrentScreen('options')}
              onFinish={handleBackToMenu}
            />
          )}
        </Animated.View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
