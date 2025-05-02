// src/features/auth/screens/Onboarding/steps/GenderStep.tsx
import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
    ProgressBar,
    Title,
    Subheading,
    Chip,
    Button,
    useTheme,
} from 'react-native-paper';

import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setGender } from '../../../slices/onboardingSlice';
import type { OnboardingStepProps } from '../types';

const options = [
    { key: 'homme', label: 'Homme' },
    { key: 'femme', label: 'Femme' },
    { key: 'non-binaire', label: 'Non-binaire' },
];

export default function GenderStep({
    onNext,
    onBack,
    currentStep = 1,
    totalSteps = 1,
}: OnboardingStepProps) {
    const onboardGenre = useAppSelector((s) => s.onboarding.gender ?? '');
    const [genre, setGenre] = useState<string>(onboardGenre);
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        dispatch(setGender(genre));
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
                    <Title style={styles.title}>Sélectionne ton genre</Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                <View style={styles.optionsContainer}>
                    {options.map(({ key, label }) => {
                        const selected = genre === key;
                        return (
                            <Chip
                                key={key}
                                mode="flat"
                                selected={selected}
                                onPress={() => setGenre(key)}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: selected
                                            ? colors.primary
                                            : '#E0E0E0',
                                    },
                                ]}
                                textStyle={{
                                    color: selected ? '#FFFFFF' : '#757575',
                                    fontSize: 16,
                                    fontFamily: 'Poppins-Regular',
                                }}
                            >
                                {label}
                            </Chip>
                        );
                    })}
                </View>

                <View>
                    <Button
                        mode="contained"
                        disabled={!genre}
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
        backgroundColor: '#FFFFFF',
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
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 0.9,
    },
    chip: {
        marginBottom: 20,
        elevation: 0,
        height: 57,
        justifyContent: 'center',
    },
    button: {
        borderRadius: 24,
        width: '80%',
        alignSelf: 'center',
        marginBottom: 8,
    },
    buttonMargin: {
        marginBottom: 50,
    },
    buttonContent: {
        height: 48,
    },
});
