import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Normalize sizes based on screen dimensions
const scale = width / 375; // Assuming 375px is the base screen width
const normalize = (size: number): number => Math.round(size * scale);

// Define types for the theme properties
type Colors = {
    primary: string;
    secondary: string;
    error: string;
    warning: string;
    success: string;
    info: string;
    white: string;
    black: string;
    gray: string;
    lightGray: string;
    lauchScreen: string;
    background: string;
    text: string;
    border: string;
    card: string;
};

type Typography = {
    fontFamily: {
        regular: string;
        bold: string;
        italic: string;
        light: string;
    };
    fontSize: {
        small: number;
        medium: number;
        large: number;
        xLarge: number;
        xxLarge: number;
    };
    lineHeight: {
        small: number;
        medium: number;
        large: number;
        xLarge: number;
    };
};

type Spacing = {
    xSmall: number;
    small: number;
    medium: number;
    large: number;
    xLarge: number;
    xxLarge: number;
};

type Borders = {
    radius: {
        small: number;
        medium: number;
        large: number;
        circle: number;
    };
    width: {
        thin: number;
        thick: number;
    };
};

type Shadows = {
    light: ShadowStyle;
    medium: ShadowStyle;
    heavy: ShadowStyle;
};

type ShadowStyle = {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
};

type Animations = {
    duration: {
        short: number;
        medium: number;
        long: number;
    };
    easing: {
        easeInOut: string;
        easeIn: string;
        easeOut: string;
    };
};

type DimensionsType = {
    screenWidth: number;
    screenHeight: number;
    buttonHeight: number;
    inputHeight: number;
};

// Base colors
const baseColors = {
    primary: '#6A0DAD',
    secondary: '#BFA2DB',
    error: '#ed1068',
    warning: '#ed1068',
    success: '#2ecc71',
    info: '#3498db',
    white: '#ffffff',
    black: '#1a1a1a',
    gray: '#333333',
    gray_2: '#4d4d4d',
    gray_3: '#666666',
    gray_4: '#808080',
    gray_5: '#999999',
    lightGray: '#b3b3b3',
    lightGray_2: '#cccccc',
    lightGray_3: '#e6e6e6',
    lauchScreen: '#000000',
};

const lightThemeColors: Colors = {
    ...baseColors,
    background: '#ffffff',
    text: '#333333',
    border: '#dcdcdc',
    card: '#f9f9f9',
};

const darkThemeColors: Colors = {
    ...baseColors,
    background: '#1e1e1e',
    text: '#f5f5f5',
    border: '#3a3a3a',
    card: '#2a2a2a',
};

// Typography styles
const typography: Typography = {
    fontFamily: {
        regular: 'Roboto-Regular',
        bold: 'Roboto-Bold',
        italic: 'Roboto-Italic',
        light: 'Roboto-Light',
    },
    fontSize: {
        small: normalize(12),
        medium: normalize(16),
        large: normalize(20),
        xLarge: normalize(24),
        xxLarge: normalize(32),
    },
    lineHeight: {
        small: normalize(16),
        medium: normalize(20),
        large: normalize(24),
        xLarge: normalize(28),
    },
};

// Spacing and padding
const spacing: Spacing = {
    xSmall: normalize(4),
    small: normalize(8),
    medium: normalize(16),
    large: normalize(24),
    xLarge: normalize(32),
    xxLarge: normalize(48),
};

// Borders and shadows
const borders: Borders = {
    radius: {
        small: 4,
        medium: 8,
        large: 16,
        circle: 9999,
    },
    width: {
        thin: 1,
        thick: 2,
    },
};

const shadows: Shadows = {
    light: {
        shadowColor: baseColors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: baseColors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    heavy: {
        shadowColor: baseColors.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
};

// Animations
const animations: Animations = {
    duration: {
        short: 150,
        medium: 300,
        long: 500,
    },
    easing: {
        easeInOut: 'ease-in-out',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
    },
};

// Dimensions
const dimensions: DimensionsType = {
    screenWidth: width,
    screenHeight: height,
    buttonHeight: normalize(48),
    inputHeight: normalize(40),
};

// Full theme objects
type Theme = {
    colors: Colors;
    typography: Typography;
    spacing: Spacing;
    borders: Borders;
    shadows: Shadows;
    animations: Animations;
    dimensions: DimensionsType;
};

const lightTheme: Theme = {
    colors: lightThemeColors,
    typography,
    spacing,
    borders,
    shadows,
    animations,
    dimensions,
};

const darkTheme: Theme = {
    colors: darkThemeColors,
    typography,
    spacing,
    borders,
    shadows,
    animations,
    dimensions,
};

export { lightTheme, darkTheme, normalize };
