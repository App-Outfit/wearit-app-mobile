// src/features/auth/screens/Onboarding/steps/BrandStep.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import BrandChoice, {
    Option,
} from '../../../../../components/choice_component/BrandChoice';
import { BrandIcons } from '../../../../../assets/index';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setBrands } from '../../../slices/onboardingSlice';
import type { OnboardingStepProps } from '../types';
import { StepLayout } from '../StepLayout';

// génère dynamiquement vos options
const options: Option[] = Object.keys(BrandIcons).map((key) => ({
    key,
    label: key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export default function BrandStep({
    onNext,
    onBack,
    currentStep = 7,
    totalSteps = 9,
}: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const onboardBrands = useAppSelector((s) => s.onboarding.brands ?? []);
    const [selected, setSelected] = useState<string[]>(onboardBrands);
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        dispatch(setBrands(selected));
        onNext();
    };

    return (
        <StepLayout
            title="Choisis les marques qui te correspondent"
            subtitle="Cela nous permet d'en savoir plus sur toi"
            progress={progress}
            onNext={handlePress}
            onBack={onBack}
            disableNext={selected.length === 0}
            scrollable={true}
        >
            <View style={styles.brandChoiceBox}>
                <BrandChoice
                    options={options}
                    selected={selected}
                    onChange={setSelected}
                />
            </View>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    brandChoiceBox: {
        width: '100%',
        // garde votre espacement d’origine
        marginBottom: 24,
    },
});
