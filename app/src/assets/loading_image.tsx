import { Image } from 'react-native';

const preloadImages = [
    require('./images/auth/female-onboarding.png'),
    require('./images/auth/male-onboarding.png'),
];

export const preloadEssentialImages = async () => {
    const cachePromises = preloadImages.map((image) => {
        return Image.prefetch(Image.resolveAssetSource(image).uri);
    });
    return Promise.all(cachePromises);
};
