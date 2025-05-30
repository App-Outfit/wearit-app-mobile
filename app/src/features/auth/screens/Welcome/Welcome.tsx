// src/features/auth/screens/Welcome/WelcomeScreen.tsx

import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Header } from '../../../../components/core/Typography';
import { baseColors, lightTheme, normalize } from '../../../../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { CButton } from '../../../../components/core/Buttons';
import { Text } from '@rneui/themed';

interface WelcomeProps {
    navigation: {
        navigate: (screen: 'Onboarding' | 'SignIn') => void;
    };
}

export default function WelcomeScreen({ navigation }: WelcomeProps) {
    // 👉 4 niveaux pour remonter jusqu'à /src, puis assets
    const femaleOnboarding = require('../../../../assets/images/auth/female-onboarding.png');
    const maleOnboarding = require('../../../../assets/images/auth/male-onboarding.png');

    return (
        <View style={styles.container}>
            {/* Section texte */}
            <View style={styles.textContainer}>
                <Header variant="h2" style={styles.title}>
                    Découvrez votre propre style sans limites
                </Header>
            </View>

            {/* Section images */}
            <Image
                source={maleOnboarding}
                style={[styles.image, styles.image2]}
                resizeMode="contain"
            />
            <Image
                source={femaleOnboarding}
                style={styles.image}
                resizeMode="contain"
            />

            {/* Boutons CTA */}
            <View style={styles.bottomContainer}>
                <LinearGradient
                    colors={['#FFFFFF', 'rgba(255, 255, 255, 0)']}
                    style={styles.gradient}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    locations={[0.43, 0.99]}
                >
                    <Text style={styles.subtitle}>
                        Essayez, combinez et laissez l'IA transformer votre
                        expérience shopping en un jeu de mode personnalisé.
                    </Text>
                    <View style={styles.buttonBottomContainer}>
                        <CButton
                            variant="primary"
                            size="xlarge"
                            onPress={() => navigation.navigate('Onboarding')}
                            style={styles.button}
                        >
                            Commencer
                        </CButton>

                        <Text style={styles.signinText}>
                            Déjà inscrit ?{' '}
                            <Text
                                onPress={() => navigation.navigate('SignIn')}
                                style={[
                                    // styles.signinText,
                                    styles.signinTextUnderline,
                                ]}
                            >
                                Connectez-vous
                            </Text>
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightTheme.colors.secondary,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: normalize(40),
        paddingHorizontal: normalize(0),
    },
    textContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    title: {
        fontSize: 58,
        paddingTop: 50,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'left',
        lineHeight: 48,
        letterSpacing: -2.5,
        color: '#000',
    },
    image: {
        width: '100%',
        height: 700,
        marginVertical: 20,
        position: 'absolute',
        bottom: -5,
        left: 25,
    },
    image2: {
        left: 75,
        height: 730,
        backgroundColor: 'transparent',
    },
    bottomContainer: {
        width: '100%',
        height: 320,
        backgroundColor: 'transparent',
    },
    gradient: {
        width: '100%',
        height: 320,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: 0,
    },
    subtitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        textAlign: 'left',
        margin: 30,
        color: '#1a1a1a',
        width: 256,
        lineHeight: 15,
        transform: [{ translateY: -10 }],
    },
    buttonBottomContainer: {
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -30 }],
    },
    button: {
        width: normalize(340),
    },
    signinText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
    },
    signinTextUnderline: {
        textDecorationLine: 'underline',
        color: baseColors.black,
        fontSize: 15,
    },
});
