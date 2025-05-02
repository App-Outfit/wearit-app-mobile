// src/features/auth/screens/Onboarding/steps/Question1Step.tsx
import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import MultiChoice, {
    Option,
} from '../../../../../components/choice_component/MultipleChoice';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setAnswers1 } from '../../../slices/onboardingSlice';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

const options: Option[] = [
    {
        key: 'associer',
        label: '🤔 Je ne sais jamais comment associer mes vêtements entre eux.',
    },
    {
        key: 'same',
        label: "🔄 J’ai l'impression de toujours porter les mêmes tenues.",
    },
    {
        key: 'fitting',
        label: '🛍️ Je n’arrive pas à savoir si un vêtement m’ira vraiment avant de l’acheter.',
    },
    {
        key: 'time',
        label: '⏰ Je perds trop de temps à choisir mes tenues chaque jour.',
    },
    {
        key: 'style',
        label: '🎨 J’ai envie de changer de style, mais je ne sais pas par où commencer.',
    },
];

export default function Question1Step({
    onNext,
    onBack,
    currentStep,
    totalSteps,
}: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const stored = useAppSelector((s) => s.onboarding.answers1 ?? []);
    const [selected, setSelected] = useState<string[]>(stored);
    const { colors } = useTheme();
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    const handleNext = () => {
        dispatch(setAnswers1(selected));
        onNext!();
    };

    return (
        <StepLayout
            title="Aujourd’hui, quels problèmes rencontres-tu côté vêtements ?"
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
