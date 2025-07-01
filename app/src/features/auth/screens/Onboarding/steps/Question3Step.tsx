// src/features/auth/screens/Onboarding/steps/Question3Step.tsx
import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import UniqueChoice from '../../../../../components/choice_component/UniqueChoice';
import type { Option } from '../../../../../components/choice_component/MultipleChoice';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setAnswers3 } from '../../../slices/onboardingSlice';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

const options: Option[] = [
    {
        key: 'creative',
        label: '🌟 Créatif : J’adore m’amuser avec les vêtements et créer de nouveaux looks.',
    },
    {
        key: 'organized',
        label: '🧹 Organisé : J’aime avoir une garde-robe simple, efficace et bien rangée.',
    },
    {
        key: 'curious',
        label: '💡 Curieux : J’ai envie de découvrir mon style, mais j’ai parfois besoin d’un coup de pouce.',
    },
    {
        key: 'thoughtful',
        label: '🎯 Réfléchi : Je prends mon temps avant d’acheter et privilégie la qualité à la quantité.',
    },
];

export default function Question3Step({
    onNext,
    onBack,
    currentStep,
    totalSteps,
}: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const stored = useAppSelector((s) => s.onboarding.answers3 ?? []);
    const [selected, setSelected] = useState<string[]>(stored);
    const { colors } = useTheme();
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    const handleNext = () => {
        dispatch(setAnswers3(selected));
        onNext!();
    };

    return (
        <StepLayout
            title="Comment décrirais-tu ton rapport aux vêtements ?"
            subtitle="Cela nous permet d'en savoir plus sur toi"
            progress={progress}
            onNext={handleNext}
            onBack={onBack}
            disableNext={selected.length === 0}
        >
            <UniqueChoice
                options={options}
                selected={selected[0]}
                onChange={(key) => setSelected([key])}
            />
        </StepLayout>
    );
}
