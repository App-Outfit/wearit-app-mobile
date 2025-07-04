//SuccessStep.tsx
import * as React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
    ProgressBar,
    Title,
    Subheading,
    Button,
    useTheme,
    Avatar,
} from 'react-native-paper';
import type { OnboardingStepProps } from '../types';
import { useAppSelector } from '../../../../../utils/hooks';
import { useEffect, useState } from 'react';

export default function SuccessStep({
    onNext,
    onBack,
    currentStep = 1,
    totalSteps = 1,
}: OnboardingStepProps) {
    const { colors } = useTheme();
    const progress = currentStep / totalSteps;

    const handlePress = () => {
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
                    <Title style={styles.title}>Félicitations</Title>
                    <Subheading style={styles.subtitle}>
                        Tu as été correctement inscrit sur l'application.
                    </Subheading>
                </View>

                <View style={styles.successIconBox}>
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
                </View>

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
}

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
