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
} from '../../../components/choice_component/MultipleChoice';

import { useAppDispatch } from '../../../utils/hooks';
import { setAnswers2 } from '../../../store/onboardingSlice';

interface Question1StepProps {
    navigation: any;
    currentStep?: number;
    totalSteps?: number;
}

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

const Question2Step: React.FC<Question1StepProps> = ({
    navigation,
    currentStep = 4,
    totalSteps = 9,
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const { colors } = useTheme();
    const progress = currentStep / totalSteps;
    const dispatch = useAppDispatch();

    const handleNext = () => {
        dispatch(setAnswers2(selected));
        navigation.navigate('Question3Step', { answers: selected });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Loader / Progress bar */}
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

                <Button
                    mode="contained"
                    disabled={selected.length === 0}
                    onPress={handleNext}
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                >
                    Suivant
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

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
        alignSelf: 'center',
    },
    buttonContent: {
        height: 48,
    },
});

export default Question2Step;
