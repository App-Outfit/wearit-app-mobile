//SuccessStep.tsx
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
    Avatar,
} from 'react-native-paper';

interface SuccessStepProps {
    /** Callback appelé quand on passe à l’étape suivante */
    //   onNext: (prenom: string) => void;
    /** Étape courante (1 par défaut) */
    navigation: any;
    currentStep?: number;
    /** Nombre total d’étapes (3 par défaut) */
    totalSteps?: number;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({
    navigation,
    currentStep = 9,
    totalSteps = 9,
}) => {
    const { colors } = useTheme();
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        navigation.navigate('MainTabs');
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
                    <Title style={styles.title}>Félicitations</Title>
                    <Subheading style={styles.subtitle}>
                        Tu as été correctement inscrit sur l’application.
                    </Subheading>
                </View>

                {/* Succes Element */}
                <View style={styles.successIconBox}>
                    <SuccessIcon />
                </View>

                {/* Bouton Suivant */}
                <Button
                    mode="contained"
                    onPress={handlePress}
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                >
                    Continuer
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

const SuccessIcon: React.FC = () => (
    <Avatar.Icon
        size={78}
        icon="check"
        color="#6a0dad"
        style={{
            backgroundColor: '#e1cfef',
            borderWidth: 4,
            borderColor: '#6a0dad',
        }}
    />
);

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
        justifyContent: 'center',
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
    successIconBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 20,
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

export default SuccessStep;
