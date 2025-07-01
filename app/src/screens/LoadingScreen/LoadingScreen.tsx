import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';

import { View, StyleSheet, Image, Text } from 'react-native';
import { Images, Animations } from '../../assets/index';
import { preloadEssentialImages } from '../../assets/loading_image';

import styles from './LoadingScreen.styles';

import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
    isTokenExpired,
    loadToken,
} from '../../features/auth/slices/authSlice';

import { logout } from '../../features/auth/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    fetchCredits,
    fetchProfile,
    fetchReferralCode,
} from '../../features/profil/thunks/userThunks';
import { fetchBodies, fetchCurrentBody } from '../../features/body/bodyThunks';
import { current } from '@reduxjs/toolkit';

export function LoadingScreen({ navigation, route }: any) {
    const { initialRoute } = route.params;
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
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
        const bootstrap = async () => {
            await preloadEssentialImages();

            dispatch(loadToken());

            try {
                await dispatch(fetchProfile()).unwrap();
                console.debug('Profile fetched successfully');
                await dispatch(fetchReferralCode()).unwrap();
                console.debug('Referral code fetched successfully');
                await dispatch(fetchCurrentBody()).unwrap();
                console.debug('Current body fetched successfully');
                await dispatch(fetchCredits()).unwrap();
                console.debug('Credits fetched successfully');

                setReady(true);
            } catch (err) {
                console.error('Erreur lors des fetchs initiaux :', err);
                setReady(true);
            }
        };

        bootstrap();
    }, [dispatch]);

    useEffect(() => {
        if (!fontsLoaded || !ready) return;

        if (token && !isTokenExpired(token)) {
            navigation.replace('MainTabs');
        } else {
            AsyncStorage.removeItem('token');
            navigation.replace('Auth');
        }
    }, [fontsLoaded, ready, token, navigation]);

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
