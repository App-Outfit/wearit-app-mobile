// src/features/auth/screens/Onboarding/steps/NameStep.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setName } from '../../../slices/onboardingSlice';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

export default function NameStep({
    onNext,
    onBack,
    currentStep,
    totalSteps,
}: OnboardingStepProps) {
    // 1️⃣ Récupère la valeur initiale depuis le store
    const onboardName = useAppSelector((s) => s.onboarding.name ?? '');
    const [name, setLocalName] = useState(onboardName);

    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    // 2️⃣ Calcule la progression
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    // 3️⃣ Lorsqu’on valide, on enregistre dans le store puis onNext()
    const handlePress = () => {
        dispatch(setName(name));
        onNext!();
    };

    return (
        <StepLayout
            title="Inscris ton prénom"
            subtitle="Cela nous permet d’en savoir plus sur toi"
            progress={progress}
            onNext={handlePress}
            onBack={onBack}
            // on désactive tant que le champ est vide (ou ne fait que des espaces)
            disableNext={!name.trim()}
        >
            {/* Ton TextInput inchangé */}
            <TextInput
                mode="flat"
                placeholder="Prénom"
                value={name}
                onChangeText={setLocalName}
                style={styles.input}
                placeholderTextColor="rgba(128, 128, 128, 0.5)"
                underlineColor="transparent"
            />
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 32,
        backgroundColor: 'transparent',
        textAlign: 'left',
        elevation: 0,
        borderBottomWidth: 0,
        fontSize: 36,
        transform: [{ translateY: -30 }],
    },
});
