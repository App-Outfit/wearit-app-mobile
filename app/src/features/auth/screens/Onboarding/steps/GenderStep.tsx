import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from '@rneui/themed';
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
    const { theme } = useTheme();
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
                        <Button
                            key={key}
                            title={label}
                            type={selected ? 'solid' : 'outline'}
                            onPress={() => setGenre(key)}
                            buttonStyle={[
                                styles.chip,
                                {
                                    backgroundColor: selected
                                        ? theme.colors.primary
                                        : '#E0E0E0',
                                    borderWidth: selected ? 0 : 1,
                                    borderColor: '#BDBDBD',
                                },
                            ]}
                            titleStyle={{
                                color: selected ? '#FFFFFF' : '#757575',
                                fontSize: 16,
                                fontFamily: 'Poppins-Regular',
                            }}
                        />
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
    },
    chip: {
        width: '80%',
        height: 57,
        marginBottom: 20,
        justifyContent: 'center',
        borderRadius: 30,
    },
});
