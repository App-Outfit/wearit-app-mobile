// Question1Step.tsx
import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
    ProgressBar,
    Title,
    Subheading,
    Button,
    useTheme,
} from 'react-native-paper';

import MultiChoice, {
    Option,
} from '../../../../../components/choice_component/MultipleChoice';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setAnswers2 } from '../../../slices/onboardingSlice';
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
    { key: 'organize', label: '🗂️ Mieux organiser et gérer ma garde-robe.' },
    { key: 'inspire', label: "🎨 Découvrir mon style et m'inspirer." },
    {
        key: 'mixbrands',
        label: '🛍️ Mixer des habits de marques avec ceux que je possède.',
    },
];

export default function Question2Step({
    onNext,
    onBack,
    currentStep = 1,
    totalSteps = 1,
}: OnboardingStepProps) {
    const onboardAnswers2 = useAppSelector((s) => s.onboarding.answers2 ?? []);
    const [selected, setSelected] = useState<string[]>(onboardAnswers2);
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        dispatch(setAnswers2(selected));
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
                    <Title style={styles.title}>
                        Que veux-tu faire principalement avec WearIT ?
                    </Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                <MultiChoice
                    options={options}
                    selected={selected}
                    onChange={setSelected}
                />

                <View>
                    <Button
                        mode="contained"
                        disabled={selected.length === 0}
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
        fontSize: 24,
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    question: {
        fontSize: 16,
        color: '#333',
        marginBottom: 24,
    },
    button: {
        borderRadius: 24,
        width: '80%',
        marginInline: 'auto',
        marginBottom: 8,
    },
    buttonMargin: {
        marginBottom: 50,
    },
    buttonContent: {
        height: 48,
    },
});
