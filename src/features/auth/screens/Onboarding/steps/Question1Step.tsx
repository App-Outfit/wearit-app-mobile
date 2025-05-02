// Question1Step.tsx
import * as React from 'react';
import { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
} from 'react-native';
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
import { useAppDispatch } from '../../../../../utils/hooks';
import { setAnswers1 } from '../../../slices/onboardingSlice';
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
    currentStep = 1,
    totalSteps = 1,
}: OnboardingStepProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        dispatch(setAnswers1(selected));
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
                        Aujourd’hui, quels problèmes rencontres-tu côté
                        vêtements ?
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
