import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import PracticeOptions from './components/PracticeOptions';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'menu', 'options'
  const [selectedPracticeType, setSelectedPracticeType] = useState(null);
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
  };

  const handleStartPractice = (config) => {
    console.log('Start Practice:', config);
    // TODO: Navigate to practice screen
  };

  if (currentScreen === 'splash') {
    return (
      <View style={styles.container}>
        <SplashScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {currentScreen === 'menu' ? (
          <MainMenu onSelectPracticeType={handlePracticeSelect} />
        ) : (
          /* Placeholder for PracticeOptions, effectively implemented in next step but wired here */
          <PracticeOptions
            practiceType={selectedPracticeType}
            onBack={handleBackToMenu}
            onStart={handleStartPractice}
          />
        )}
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
