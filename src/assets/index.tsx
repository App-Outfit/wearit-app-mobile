import { Icon } from 'react-native-elements';
import { lightTheme } from '../styles/theme';

type ImageSource = number; // React Native images are required as numbers
type AnimationSource = string; // Lottie animations are usually JSON objects

// Images
export const Images: Record<string, ImageSource> = {
    logo_wearit: require('./images/logo-wearit.png'),
};

// Icons
export const Icons: Record<string, ImageSource> = {};
export const circleCheckIcon = (
    <Icon
        name="checkmark-circle-outline"
        type="ionicon"
        iconProps={{ size: 24, name: 'checkmark-circle-outline' }}
        color={lightTheme.colors.primary}
    />
);
export const circleErrorIcon = (
    <Icon
        name="exclamationcircleo"
        type="antdesign"
        iconProps={{ size: 20, name: 'exclamationcircleo' }}
        color={lightTheme.colors.error}
        style={{ marginRight: 2 }}
    />
);

// Animations
export const Animations: Record<string, AnimationSource> = {
    loading_spinner: require('./lottie/lottie-loading-spinner.json'),
};

// Fonts
