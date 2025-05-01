// GenderStep.tsx
import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
    ProgressBar,
    Title,
    Button,
    Chip,
    useTheme,
    Subheading,
} from 'react-native-paper';

import { useAppDispatch } from '../../../utils/hooks';
import { setGender } from '../../../store/onboardingSlice';

interface GenderStepProps {
    /** Callback appelé quand on passe à l’étape suivante */
    navigation: any;
    /** Étape courante (2 par défaut) */
    currentStep?: number;
    /** Nombre total d’étapes (3 par défaut) */
    totalSteps?: number;
}

const options = [
    { key: 'homme', label: 'Homme' },
    { key: 'femme', label: 'Femme' },
    { key: 'non-binaire', label: 'Non‑binaire' },
];

export const GenderStep: React.FC<GenderStepProps> = ({
    navigation,
    currentStep = 2,
    totalSteps = 9,
}) => {
    const [genre, setGenre] = useState<string>('');
    const { colors } = useTheme();
    const progress = currentStep / totalSteps;
    const dispatch = useAppDispatch();

    const handlePress = () => {
        dispatch(setGender(genre));
        navigation.navigate('AgeStep');
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
                    <Title style={styles.title}>Sélectionne ton genre</Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {options.map(({ key, label }) => {
                        const selected = genre === key;
                        return (
                            <Chip
                                key={key}
                                mode="flat"
                                selected={selected}
                                onPress={() => setGenre(key)}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: selected
                                            ? colors.primary
                                            : '#E0E0E0',
                                    },
                                ]}
                                textStyle={{
                                    color: selected ? '#FFFFFF' : '#757575',
                                    fontSize: 16,
                                    fontFamily: 'Poppins-Regular',
                                }}
                            >
                                {label}
                            </Chip>
                        );
                    })}
                </View>

                {/* Bouton Suivant */}
                <Button
                    mode="contained"
                    disabled={!genre}
                    onPress={handlePress}
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
        marginBottom: 8,
        fontSize: 24,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 16,
        color: '#666',
    },
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: 'auto',
        flex: 0.9,
    },
    chip: {
        marginBottom: 20,
        elevation: 0,
        height: 57,
        justifyContent: 'center',
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

export default GenderStep;
