import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';

import { View, StyleSheet, Image, Text } from 'react-native';
import { Images, Animations } from '../../assets/index';
import { preloadEssentialImages } from '../../assets/loading_image';

import styles from './LoadingScreen.styles';

export function LoadingScreen({ navigation }: any) {
    const font_base_bath = '../../assets/fonts/';

    const [fontsLoaded] = useFonts({
        'DM-Sans-Regular': require(
            `${font_base_bath}DM-Sans/DMSans-Regular.ttf`,
        ),
        'DM-Sans-Bold': require(`${font_base_bath}DM-Sans/DMSans-Bold.ttf`),
        'DM-Sans-Italic': require(`${font_base_bath}DM-Sans/DMSans-Italic.ttf`),
        'Poppins-Regular': require(
            `${font_base_bath}Poppins/Poppins-Regular.ttf`,
        ),
        'Poppins-Medium': require(
            `${font_base_bath}Poppins/Poppins-Medium.ttf`,
        ),
        'Poppins-SemiBold': require(
            `${font_base_bath}Poppins/Poppins-SemiBold.ttf`,
        ),
        'Poppins-Bold': require(`${font_base_bath}Poppins/Poppins-Bold.ttf`),
        'Poppins-Italic': require(
            `${font_base_bath}Poppins/Poppins-Italic.ttf`,
        ),
    });

    useEffect(() => {
        const loadAssets = async () => {
            await preloadEssentialImages();
            navigation.replace('Auth');
        };
        loadAssets();

        // let timer: NodeJS.Timeout;

        // if (fontsLoaded) {
        //     timer = setTimeout(() => {

        //     }, 130);
        // }

        // return () => clearTimeout(timer);
    }, [navigation, fontsLoaded]);

    return (
        <View style={styles.loading_screen}>
            <View style={styles.container}>
                <Image source={Images.logo_wearit} style={styles.logo} />
            </View>
            <LottieView
                source={Animations.loading_spinner}
                autoPlay
                loop
                style={styles.animation}
            />
        </View>
    );
}
