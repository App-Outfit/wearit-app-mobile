// src/screens/onboarding/MailStep.tsx
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
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import {
    setEmail as setOnboardEmail,
    setPassword as setOnboardPassword,
    resetOnboarding,
} from '../../../store/onboardingSlice';
import { signupUser, clearStatus } from '../../../store/authSlice';
import { validateEmail, validatePassword } from '../../../utils/validation';
import type { SignupData } from '../../../services/authService';

interface Props {
    navigation: any;
    currentStep?: number;
    totalSteps?: number;
}

const MailStep: React.FC<Props> = ({
    navigation,
    currentStep = 8,
    totalSteps = 9,
}) => {
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const { status, error, token } = useAppSelector((s) => s.auth);
    const onboarding = useAppSelector((s) => s.onboarding);

    // champs contrôlés + touched pour n’afficher l’erreur qu’après le premier blur
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // validité dérivée
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const isFormValid = emailValid && passwordValid;

    // au montage, on nettoie tout ancien status/erreur
    useEffect(() => {
        dispatch(clearStatus());
    }, [dispatch]);

    // navigation automatique en cas de succès
    useEffect(() => {
        if (status === 'succeeded' && token) {
            dispatch(resetOnboarding());
            navigation.replace('SuccessStep');
        }
    }, [status, token, dispatch, navigation]);

    const handleContinue = useCallback(() => {
        // on marque comme touché pour déclencher l’affichage des erreurs
        setEmailTouched(true);
        setPasswordTouched(true);
        if (!isFormValid) return;

        // on enregistre temporairement dans le store onboarding
        dispatch(setOnboardEmail(email));
        dispatch(setOnboardPassword(password));

        // on construit le payload complet
        const { name, gender, age, answers1, answers2, answers3, brands } =
            onboarding;
        const payload: SignupData = {
            name: name!,
            email,
            password,
            answers: {
                gender: gender!,
                age: String(age),
                q1: answers1!.join(','),
                q2: answers2!.join(','),
                q3: answers3!.join(','),
                brand: brands!.join(','),
            },
        };

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
                    onChangeText={(t) => setEmail(t)}
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
                    onChangeText={(t) => setPassword(t)}
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

                <Button
                    mode="contained"
                    onPress={handleContinue}
                    disabled={!isFormValid || status === 'loading'}
                    loading={status === 'loading'}
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                >
                    Continuer
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

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
        marginTop: 24,
        borderRadius: 24,
    },
    buttonContent: {
        height: 48,
    },
});

export default MailStep;
