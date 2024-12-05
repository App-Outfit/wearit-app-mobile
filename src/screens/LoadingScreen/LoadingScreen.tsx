import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Images, Animations } from '../../assets/index';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';

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
        'Poppins-SemiBold': require(
            `${font_base_bath}Poppins/Poppins-SemiBold.ttf`,
        ),
        'Poppins-Bold': require(`${font_base_bath}Poppins/Poppins-Bold.ttf`),
        'Poppins-Italic': require(
            `${font_base_bath}Poppins/Poppins-Italic.ttf`,
        ),
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (!fontsLoaded) {
            timer = setTimeout(() => {
                navigation.replace('Typo');
            }, 1300);
        }

        return () => clearTimeout(timer);
    }, [navigation]);

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
