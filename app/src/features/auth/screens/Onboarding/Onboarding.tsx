import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../utils/hooks';

// Vos étapes, dans l’ordre :
import NameStep from './steps/Name';
import AgeStep from './steps/AgeStep';
import GenderStep from './steps/GenderStep';
import Question1Step from './steps/Question1Step';
import Question2Step from './steps/Question2Step';
import Question3Step from './steps/Question3Step';
import BrandStep from './steps/BrandStep';
import MailStep from './steps/MailStep';
import SuccessStep from './steps/SuccessStep';

const steps = [
    NameStep,
    AgeStep,
    GenderStep,
    Question1Step,
    Question2Step,
    Question3Step,
    BrandStep,
    MailStep,
    SuccessStep,
];

export default function OnboardingWizard({ navigation }: any) {
    const [idx, setIdx] = useState(0);
    const Step = steps[idx];
    const dispatch = useAppDispatch();
    const onboard = useAppSelector((s) => s.onboarding);
    const { status, error, token } = useAppSelector((s) => s.auth);

    // Si succès signup → reset et nav MainTabs
    useEffect(() => {
        // if (token) {
        //   dispatch(resetOnboarding());
        //   navigation.replace('MainTabs');
        // }
    }, [token]);

    const next = () => {
        if (idx === steps.length - 1) {
            navigation.replace('MainTabs');
        } else {
            setIdx((i) => Math.min(i + 1, steps.length - 1));
        }
    };

    const back = () => {
        if (idx === 0) {
            navigation.replace('Welcome');
        } else {
            setIdx((i) => Math.max(i - 1, 0));
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {/* On injecte next & back dans chaque Step */}
            <Step
                onNext={next}
                onBack={back}
                currentStep={idx + 1}
                totalSteps={steps.length}
            />
        </View>
    );
}
