import * as React from 'react';
import { lightTheme } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

type ImageSource = number;
type AnimationSource = string;

// Images
export const Images: Record<string, ImageSource> = {
    logo_wearit: require('./images/logo-wearit.png'),
};

// Icônes
export const Icons: Record<string, ImageSource> = {};

export const circleCheckIcon = (
    <Ionicons
        name="checkmark-circle-outline"
        size={24}
        color={lightTheme.colors.primary}
    />
);

export const circleErrorIcon = (
    <AntDesign
        name="exclamationcircleo"
        size={20}
        color={lightTheme.colors.error}
        style={{ marginRight: 2 }}
    />
);

export const eyeIcon = (
    <AntDesign
        name="eye"
        size={20}
        color={lightTheme.colors.black}
        style={{ marginRight: 2 }}
    />
);

export const eyeOffIcon = (
    <AntDesign
        name="eyeo"
        size={20}
        color={lightTheme.colors.black}
        style={{ marginRight: 2 }}
    />
);

// Animations
export const Animations: Record<string, AnimationSource> = {
    loading_spinner: require('./lottie/lottie-loading-spinner.json'),
};

// Brand icons
export const BrandIcons: Record<string, number> = {
    adidas: require('./images/icons-brands/adidas.png'),
    asos: require('./images/icons-brands/asos.png'),
    bershka: require('./images/icons-brands/bershka.png'),
    'h&m': require('./images/icons-brands/h&m.png'),
    lacoste: require('./images/icons-brands/lacoste.png'),
    mango: require('./images/icons-brands/mango.png'),
    nike: require('./images/icons-brands/nike.png'),
    'off-white': require('./images/icons-brands/off-white.png'),
    'pull-and-bear': require('./images/icons-brands/Pull-&-Bear.png'),
    puma: require('./images/icons-brands/puma.png'),
    'rick-owens': require('./images/icons-brands/rick-owens.png'),
    stradivarius: require('./images/icons-brands/stradivarius.png'),
    uniqlo: require('./images/icons-brands/uniqlo.png'),
    'the-north-face': require('./images/icons-brands/the-north-face.png'),
    'urban-outfitters': require('./images/icons-brands/urban-outfitters.png'),
    zara: require('./images/icons-brands/zara.png'),
};
