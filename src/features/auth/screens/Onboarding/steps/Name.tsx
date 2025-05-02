// src/features/auth/screens/Onboarding/steps/NameStep.tsx
import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
    ProgressBar,
    Title,
    Subheading,
    TextInput,
    Button,
    useTheme,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setName } from '../../../slices/onboardingSlice';
import type { OnboardingStepProps } from '../types';

export default function NameStep({
    onNext,
    onBack,
    currentStep = 1,
    totalSteps = 1,
}: OnboardingStepProps) {
    const onboardName = useAppSelector((s) => s.onboarding.name ?? '');
    const [name, setLocalName] = useState(onboardName);
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    const handlePress = () => {
        dispatch(setName(name));
        onNext();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ProgressBar
                progress={progress}
                color={colors.primary}
                style={styles.progressBar}
            />

            <View style={styles.content}>
                <View>
                    <Title style={styles.title}>Inscris ton prénom</Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                <TextInput
                    mode="flat"
                    placeholder="            Prénom"
                    value={name}
                    onChangeText={setLocalName}
                    style={styles.input}
                    placeholderTextColor="rgba(128, 128, 128, 0.5)"
                    underlineColor="transparent"
                />

                <View>
                    <Button
                        mode="contained"
                        disabled={!name}
                        onPress={handlePress}
                        contentStyle={styles.buttonContent}
                        style={[styles.button]}
                    >
                        Suivant
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
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    progressBar: {
        height: 10,
        marginTop: 20,
        marginBottom: 50,
        borderRadius: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 8,
        fontSize: 24,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 16,
        color: '#666',
    },
    input: {
        marginBottom: 32,
        backgroundColor: 'transparent',
        textAlign: 'left',
        elevation: 0,
        borderBottomWidth: 0,
        fontSize: 36,
        transform: [{ translateY: -30 }],
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
