# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Math-recall is a React Native mobile application built with Expo for practicing basic math operations (addition, subtraction, multiplication). The app targets iOS, Android, and web platforms.

## Development Commands

### Running the app
- `npm start` - Start Expo development server
- `npm run android` - Build and run on Android device/emulator
- `npm run ios` - Build and run on iOS simulator
- `npm run web` - Run in web browser

### Testing
No test framework is currently configured. Tests should be added using Jest and React Native Testing Library.

## Project Architecture

### Application Flow
1. **SplashScreen** → Displays for 3 seconds with app branding
2. **MainMenu** → User selects practice type (addition, subtraction, multiplication)
3. **PracticeOptions** → User configures number (1-9) and question count (10/20/30)
4. **Practice Screen** → Not yet implemented (TODO in App.js:41)

### Screen State Management
The app uses simple React state in `App.js` to manage navigation between screens:
- `currentScreen` - Controls which screen to display ('splash', 'menu', 'options')
- `selectedPracticeType` - Tracks the chosen math operation
- Animated transitions using React Native's Animated API

### Component Structure
- `components/` - All React components
  - `SplashScreen.js` - Initial loading screen with brain icon
  - `MainMenu.js` - Practice type selection with responsive layout (vertical/horizontal modes)
  - `PracticeOptions.js` - Configuration screen for practice session
- `constants/` - Shared design system
  - `colors.js` - Centralized color palette (COLORS object)
  - `styles.js` - Common style definitions (COMMON_STYLES object with shadows and gradients)

### Design System
- **Colors**: Use `COLORS` from `constants/colors.js` for all color values
  - `COLORS.accent[practiceType]` returns gradient arrays for each practice type
  - Text colors: `COLORS.text.primary`, `COLORS.text.secondary`
  - UI colors: `COLORS.ui.border`, `COLORS.ui.disabled`, `COLORS.ui.selected`
- **Shadows**: Use `COMMON_STYLES.shadow` or `COMMON_STYLES.shadowLarge` from `constants/styles.js`
- **Gradients**: Use `COMMON_STYLES.gradientProps` for consistent background gradients

### Responsive Design
Components use `useWindowDimensions()` to adapt layout:
- Width < 600: Vertical/mobile layout (stacked buttons)
- Width >= 600: Horizontal/tablet layout (grid buttons)

### Key Dependencies
- **expo** (~54.0.30) - Development platform
- **react-native** (0.81.5) with React 19.1.0
- **expo-linear-gradient** - For gradient backgrounds/buttons
- **react-native-svg** - For custom icons
- **react-native-safe-area-context** - For safe area handling

## Code Conventions
- Use functional components with hooks
- StyleSheet.create() for all styles (no inline styles)
- Import shared colors/styles from constants/ directory
- Components export default function ComponentName
- Use destructuring for props
