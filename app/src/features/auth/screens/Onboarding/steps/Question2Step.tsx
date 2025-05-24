// src/features/auth/screens/Onboarding/steps/Question2Step.tsx
import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import MultiChoice, {
    Option,
} from '../../../../../components/choice_component/MultipleChoice';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setAnswers2 } from '../../../slices/onboardingSlice';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

const options: Option[] = [
    {
        key: 'tryon',
        label: '🔄 Essayer des vêtements virtuellement avant de les acheter.',
    },
    {
        key: 'combine',
        label: "👕 Visualiser comment mes vêtements s'associent ensemble.",
    },
    {
        key: 'organize',
        label: '🗂️ Mieux organiser et gérer ma garde-robe.',
    },
    {
        key: 'inspire',
        label: "🎨 Découvrir mon style et m'inspirer.",
    },
    {
        key: 'mixbrands',
        label: '🛍️ Mixer des habits de marques avec ceux que je possède.',
    },
];

export default function Question2Step({
    onNext,
    onBack,
    currentStep,
    totalSteps,
}: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const stored = useAppSelector((s) => s.onboarding.answers2 ?? []);
    const [selected, setSelected] = useState<string[]>(stored);
    const { colors } = useTheme();
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    const handleNext = () => {
        dispatch(setAnswers2(selected));
        onNext!();
    };

    return (
        <StepLayout
            title="Que veux-tu faire principalement avec WearIT ?"
            subtitle="Cela nous permet d'en savoir plus sur toi"
            progress={progress}
            onNext={handleNext}
            onBack={onBack}
            disableNext={selected.length === 0}
        >
            <MultiChoice
                options={options}
                selected={selected}
                onChange={setSelected}
            />
        </StepLayout>
    );
}
