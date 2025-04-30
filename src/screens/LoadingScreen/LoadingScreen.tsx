import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';

import { View, StyleSheet, Image, Text } from 'react-native';
import { Images, Animations } from '../../assets/index';
import { preloadEssentialImages } from '../../assets/loading_image';

import styles from './LoadingScreen.styles';

import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { loadToken } from '../../store/authSlice';

import { logout } from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const dispatch = useAppDispatch();
    const { status, token } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadToken());
    }, []);

    useEffect(() => {
        const init = async () => {
            await preloadEssentialImages();
            // n’avance que si nos fonts sont prêtes ET que loadToken est fini
            // if (fontsLoaded && status !== 'loading') {
            //     // ⑤ on remplace la route selon la présence du token
            //     if (token) {
            //         navigation.replace('HomeScreen');
            //     } else {
            //         navigation.replace('Auth');
            //     }
            // }
            AsyncStorage.removeItem('token');
            dispatch(logout());
            navigation.replace('Auth');
        };
        init();
    }, [fontsLoaded, status, token]);

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
