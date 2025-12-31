import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import PracticeOptions from './components/PracticeOptions';
import TestScreen from './components/TestScreen';
import ResultsScreen from './components/ResultsScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'menu', 'options', 'practice', 'results'
  const [selectedPracticeType, setSelectedPracticeType] = useState(null);
  const [practiceConfig, setPracticeConfig] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wait 3 seconds, then start transition
    const timer = setTimeout(() => {
      setCurrentScreen('menu'); // Transition to menu instead of just showMenu=true
      Animated.timing(fadeAnimation, {
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
    setResultsData(null);
  };

  const handleFinishTest = (results) => {
    setResultsData(results);
    setCurrentScreen('results');
  };

  const handleRetry = () => {
    setCurrentScreen('practice');
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
        <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
          {currentScreen === 'menu' ? (
            <MainMenu onSelectPracticeType={handlePracticeSelect} />
          ) : currentScreen === 'options' ? (
            <PracticeOptions
              practiceType={selectedPracticeType}
              onBack={handleBackToMenu}
              onStart={handleStartPractice}
            />
          ) : currentScreen === 'results' ? (
            <ResultsScreen
              results={resultsData}
              onHome={handleBackToMenu}
              onRetry={handleRetry}
            />
          ) : (
            <TestScreen
              config={practiceConfig}
              onBack={() => setCurrentScreen('options')}
              onFinish={handleFinishTest}
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
