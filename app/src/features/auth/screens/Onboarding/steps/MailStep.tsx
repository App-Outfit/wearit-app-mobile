// src/features/auth/screens/Onboarding/steps/MailStep.tsx
import React, { useEffect, useCallback, useState } from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import {
    setEmail as setOnboardEmail,
    setPassword as setOnboardPassword,
    resetOnboarding,
} from '../../../slices/onboardingSlice';
import { signupUser, clearStatus } from '../../../slices/authSlice';
import {
    validateEmail,
    validatePassword,
} from '../../../../../utils/validation';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

export default function MailStep({
    onNext,
    onBack,
    currentStep = 8,
    totalSteps = 9,
}: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const { status, error, token } = useAppSelector((s) => s.auth);
    const onboarding = useAppSelector((s) => s.onboarding);

    const [email, setEmail] = useState(onboarding.email ?? '');
    const [password, setPassword] = useState(onboarding.password ?? '');
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const isFormValid = emailValid && passwordValid;

    // clear old errors/status on mount
    useEffect(() => {
        dispatch(clearStatus());
    }, [dispatch]);

    // on succès signup → next
    useEffect(() => {
        if (status === 'succeeded' && token) {
            dispatch(resetOnboarding());
            onNext();
        }
    }, [status, token, dispatch, onNext]);

    const handleContinue = useCallback(() => {
        setEmailTouched(true);
        setPasswordTouched(true);
        if (!isFormValid) return;

        dispatch(setOnboardEmail(email));
        dispatch(setOnboardPassword(password));

        dispatch(
            signupUser({
                email: email,
                first_name: onboarding.name!,
                answers: {
                    gender: onboarding.gender!,
                    age: onboarding.age!,
                    q1: onboarding.answers1!.join(','),
                    q2: onboarding.answers2!.join(','),
                    q3: onboarding.answers3!.join(','),
                    brand: onboarding.brands!.join(','),
                },
                password,
            }),
        );
    }, [dispatch, email, password, isFormValid, onboarding]);

    const handleBack = () => {
        dispatch(clearStatus());
        onBack!();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <StepLayout
                    title="Finalise ton inscription"
                    subtitle="Cela nous permet d'en savoir plus sur toi"
                    progress={currentStep / totalSteps}
                    onNext={handleContinue}
                    onBack={handleBack}
                    disableNext={!isFormValid || status === 'loading'}
                >
                    <View>
                        <TextInput
                            label="Adresse email"
                            value={email}
                            onChangeText={setEmail}
                            onBlur={() => setEmailTouched(true)}
                            error={emailTouched && !emailValid}
                            mode="flat"
                        />
                        <HelperText
                            type="error"
                            visible={emailTouched && !emailValid}
                        >
                            {
                                'L’adresse e-mail doit être au format utilisateur@domaine.extension'
                            }
                        </HelperText>

                        <TextInput
                            label="Mot de passe"
                            value={password}
                            onChangeText={setPassword}
                            onBlur={() => setPasswordTouched(true)}
                            secureTextEntry
                            error={passwordTouched && !passwordValid}
                            mode="flat"
                        />
                        <HelperText
                            type="error"
                            visible={passwordTouched && !passwordValid}
                        >
                            {'Le mot de passe doit contenir au moins 8 caractères.\n' +
                                'Inclure au moins une lettre et un chiffre \n' +
                                'Et ne pas comporter d’espaces.'}
                        </HelperText>

                        {error && (
                            <HelperText
                                type="error"
                                visible
                                style={styles.serverError}
                            >
                                {error}
                            </HelperText>
                        )}
                    </View>
                </StepLayout>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    inputs: {
        flex: 1,
        justifyContent: 'center',
    },
    serverError: {
        textAlign: 'center',
    },
});
