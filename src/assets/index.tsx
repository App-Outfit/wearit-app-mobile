type ImageSource = number; // React Native images are required as numbers
type AnimationSource = string; // Lottie animations are usually JSON objects

// Images
export const Images: Record<string, ImageSource> = {
    logo_wearit: require('./images/logo-wearit.png'),
};

// Icons
export const Icons: Record<string, ImageSource> = {};

// Animations
export const Animations: Record<string, AnimationSource> = {
    loading_spinner: require('./lottie/lottie-loading-spinner.json'),
};

// Fonts
