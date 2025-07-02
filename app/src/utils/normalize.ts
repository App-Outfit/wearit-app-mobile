import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Design basé sur un écran de référence de 375px de large (iPhone X)
const scale = SCREEN_WIDTH / 375;

export function normalize(size: number): number {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
