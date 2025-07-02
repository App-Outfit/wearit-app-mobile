//SuccessStep.tsx
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearProgress, Avatar, Button } from '@rneui/themed';
import type { OnboardingStepProps } from '../types';
import { CButton } from '../../../../../components/core/Buttons';
import { baseColors } from '../../../../../styles/theme';

export default function SuccessStep({
    onNext,
    onBack,
    currentStep = 1,
    totalSteps = 1,
}: OnboardingStepProps) {
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        onNext();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <LinearProgress
                value={progress}
                color={baseColors.primary}
                variant="determinate"
                style={styles.progressBar}
            />

            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>Félicitations</Text>
                    <Text style={styles.subtitle}>
                        Tu as été correctement inscrit sur l’application.
                    </Text>
                </View>

                <View style={styles.successIconBox}>
                    <Avatar
                        size={78}
                        icon={{
                            name: 'check',
                            type: 'material-community',
                            color: '#6a0dad',
                        }}
                        containerStyle={{
                            backgroundColor: '#e1cfef',
                            borderWidth: 4,
                            borderColor: '#6a0dad',
                        }}
                    />
                </View>

                <CButton
                    onPress={handlePress}
                    style={styles.button}
                    variant="primary"
                >
                    Continuer
                </CButton>
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
