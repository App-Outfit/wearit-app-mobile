// src/features/auth/screens/Onboarding/steps/GenderStep.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setGender } from '../../../slices/onboardingSlice';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

const options = [
    { key: 'homme', label: 'Homme' },
    { key: 'femme', label: 'Femme' },
    { key: 'non-binaire', label: 'Non-binaire' },
];

export default function GenderStep({
    onNext,
    onBack,
    currentStep,
    totalSteps,
}: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const onboardGenre = useAppSelector((s) => s.onboarding.gender ?? '');
    const [genre, setGenre] = useState(onboardGenre);
    const { colors } = useTheme();
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    const handlePress = () => {
        dispatch(setGender(genre));
        onNext!();
    };

    return (
        <StepLayout
            title="Sélectionne ton genre"
            subtitle="Cela nous permet d'en savoir plus sur toi"
            progress={progress}
            onNext={handlePress}
            onBack={onBack}
            disableNext={!genre}
        >
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
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        // on centre les chips horizontalement
    },
    chip: {
        width: '80%', // même largeur que les boutons
        height: 57,
        marginBottom: 20,
        elevation: 0,
        justifyContent: 'center',
    },
});
