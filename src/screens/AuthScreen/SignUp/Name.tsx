// PrenomStep.tsx
import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
    ProgressBar,
    Title,
    Subheading,
    TextInput,
    Button,
    useTheme,
} from 'react-native-paper';

import { useAppDispatch } from '../../../utils/hooks';
import { setName } from '../../../store/onboardingSlice';

interface NameStepProps {
    /** Callback appelé quand on passe à l’étape suivante */
    //   onNext: (prenom: string) => void;
    /** Étape courante (1 par défaut) */
    navigation: any;
    currentStep?: number;
    /** Nombre total d’étapes (3 par défaut) */
    totalSteps?: number;
}

export const NameStep: React.FC<NameStepProps> = ({
    //   onNext,
    navigation,
    currentStep = 1,
    totalSteps = 9,
}) => {
    const [name, setLocalName] = useState('');
    const { colors } = useTheme();
    const progress = currentStep / totalSteps;
    const dispatch = useAppDispatch();

    const handlePress = () => {
        dispatch(setName(name));
        navigation.navigate('GenderStep');
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
                {/* Titre et sous-titre */}
                <View>
                    <Title style={styles.title}>Inscris ton prénom</Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                {/* Input centrée */}
                <TextInput
                    mode="flat"
                    placeholder="          Prénom"
                    value={name}
                    onChangeText={setLocalName}
                    style={styles.input}
                    placeholderTextColor="rgba(128, 128, 128, 0.5)"
                    underlineColor="transparent"
                    // activeUnderlineColor="transparent"
                />

                {/* Bouton Suivant */}
                <Button
                    mode="contained"
                    disabled={!name.trim()}
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
        backgroundColor: '#ffffff',
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
    input: {
        marginBottom: 32,
        backgroundColor: 'transparent',
        textAlign: 'left',
        elevation: 0,
        borderBottomWidth: 0,
        fontSize: 36,
        transform: [{ translateY: -30 }],
    },
    button: {
        borderRadius: 24,
        width: '80%',
        marginInline: 'auto',
    },
    buttonContent: {
        height: 48,
    },
});

export default NameStep;
