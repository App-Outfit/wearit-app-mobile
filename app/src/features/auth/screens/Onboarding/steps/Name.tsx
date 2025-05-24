// src/features/auth/screens/Onboarding/steps/NameStep.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { TextInput } from 'react-native-paper';
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
    const dispatch = useAppDispatch();
    const onboardName = useAppSelector((s) => s.onboarding.name ?? '');
    const [name, setLocalName] = useState(onboardName);

    const progress = (currentStep ?? 1) / (totalSteps ?? 1);
    const handlePress = () => {
        dispatch(setName(name));
        onNext!();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <StepLayout
                    title="Inscris ton prénom"
                    subtitle="Cela nous permet d’en savoir plus sur toi"
                    progress={progress}
                    onNext={handlePress}
                    onBack={onBack}
                    disableNext={!name.trim()}
                >
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
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 16,
        backgroundColor: 'transparent',
        textAlign: 'left',
        elevation: 0,
        borderBottomWidth: 0,
        marginTop: 65,
        fontSize: 36,
        transform: [{ translateY: -30 }],
    },
});
