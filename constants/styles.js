import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

// Standard linear gradient props
const GRADIENT_PROPS = {
    colors: [COLORS.background.start, COLORS.background.end],
    start: { x: 0.2, y: 0 },
    end: { x: 0.8, y: 1 },
};

export const COMMON_STYLES = {
    shadow: {
        shadowColor: COLORS.ui.black,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    shadowLarge: {
        shadowColor: COLORS.ui.black,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        elevation: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientProps: GRADIENT_PROPS,
};
