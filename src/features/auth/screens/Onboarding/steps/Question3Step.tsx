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

import { Option } from '../../../../../components/choice_component/MultipleChoice';
import UniqueChoice from '../../../../../components/choice_component/UniqueChoice';

import { useAppDispatch } from '../../../../../utils/hooks';
import { setAnswers3 } from '../../../slices/onboardingSlice';
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
    currentStep = 1,
    totalSteps = 1,
}: OnboardingStepProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        dispatch(setAnswers3(selected));
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
                        Comment décrirais-tu ton rapport aux vêtements ?
                    </Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                <UniqueChoice
                    options={options}
                    selected={selected[0]}
                    onChange={(key) => setSelected([key])}
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
