// src/features/auth/screens/Onboarding/steps/MailStep.tsx
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import {
    TextInput,
    Button,
    ProgressBar,
    Title,
    Subheading,
    HelperText,
    useTheme,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import {
    setEmail as setOnboardEmail,
    setPassword as setOnboardPassword,
    resetOnboarding,
} from '../../../slices/onboardingSlice';
import { signupUser, clearStatus } from '../../../slices/authSlice';
import type { OnboardingStepProps } from '../types';
import {
    validateEmail,
    validatePassword,
} from '../../../../../utils/validation';

export default function MailStep({
    onNext,
    onBack,
    currentStep = 8,
    totalSteps = 9,
}: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const { status, error, token } = useAppSelector((s) => s.auth);
    const onboarding = useAppSelector((s) => s.onboarding);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const isFormValid = emailValid && passwordValid;

    // 1️⃣ On monte, on nettoie tout ancien status/erreur
    useEffect(() => {
        dispatch(clearStatus());
    }, [dispatch]);

    // 2️⃣ Quand le signup est OK, on passe à l’étape suivante
    useEffect(() => {
        if (status === 'succeeded' && token) {
            // (optionnel) reset du wizard
            dispatch(resetOnboarding());
            onNext();
        }
    }, [status, token, dispatch, onNext]);

    const handleContinue = useCallback(() => {
        setEmailTouched(true);
        setPasswordTouched(true);
        if (!isFormValid) return;

        // on stocke dans le slice onboarding
        dispatch(setOnboardEmail(email));
        dispatch(setOnboardPassword(password));

        // on construit le payload complet
        const payload = {
            name: onboarding.name!,
            gender: onboarding.gender!,
            age: Number(onboarding.age!),
            answers: {
                q1: onboarding.answers1!.join(','),
                q2: onboarding.answers2!.join(','),
                q3: onboarding.answers3!.join(','),
                brand: onboarding.brands!.join(','),
            },
            email,
            password,
        };

        // on déclenche le thunk signupUser
        dispatch(signupUser(payload));
    }, [dispatch, email, password, isFormValid, onboarding]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ProgressBar
                progress={currentStep / totalSteps}
                color={colors.primary}
                style={styles.progressBar}
            />

            <View style={styles.content}>
                <Title style={styles.title}>Finalise ton inscription</Title>
                <Subheading style={styles.subtitle}>
                    Cela nous permet d'en savoir plus sur toi
                </Subheading>

                <TextInput
                    label="Adresse email"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => setEmailTouched(true)}
                    error={emailTouched && !emailValid}
                    mode="flat"
                />
                <HelperText type="error" visible={emailTouched && !emailValid}>
                    Email invalide
                </HelperText>

                <TextInput
                    label="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setPasswordTouched(true)}
                    secureTextEntry
                    error={passwordTouched && !passwordValid}
                    mode="flat"
                    style={styles.input}
                />
                <HelperText
                    type="error"
                    visible={passwordTouched && !passwordValid}
                >
                    Mot de passe invalide (ex: GTH6dk_dk!)
                </HelperText>

                {/* Erreur serveur */}
                {error && (
                    <HelperText type="error" visible style={styles.serverError}>
                        {error}
                    </HelperText>
                )}

                <View>
                    <Button
                        mode="contained"
                        disabled={!isFormValid || status === 'loading'}
                        onPress={handleContinue}
                        contentStyle={styles.buttonContent}
                        style={[styles.button]}
                    >
                        Continuer
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={onBack}
                        contentStyle={styles.buttonContent}
                        style={[styles.button, styles.buttonMargin]}
                    >
                        Retour
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginBottom: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    input: {
        marginTop: 16,
    },
    serverError: {
        textAlign: 'center',
        marginBottom: 16,
    },
    button: {
        borderRadius: 24,
        width: '80%',
        marginInline: 'auto',
        marginBottom: 8,
    },
    buttonMargin: {
        marginBottom: 50,
    },
    buttonContent: {
        height: 48,
    },
});
