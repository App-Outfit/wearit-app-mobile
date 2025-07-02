import React from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
} from 'react-native';
import { Button, LinearProgress } from '@rneui/themed';
import * as Progress from 'react-native-progress';

interface StepLayoutProps {
    title: string;
    subtitle?: string;
    progress: number;
    onNext?: () => void;
    onBack?: () => void;
    disableNext?: boolean;
    scrollable?: boolean;
    children: React.ReactNode;
}

export function StepLayout({
    title,
    subtitle,
    progress,
    onNext,
    onBack,
    disableNext,
    scrollable = false,
    children,
}: StepLayoutProps) {
    const Body = scrollable ? ScrollView : View;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* <LinearProgress
                value={parseFloat(progress.toFixed(4))}
                variant="determinate"
                color="#6a0dad"
                style={styles.progressBar}
            /> */}
            <Progress.Bar progress={progress} width={null} />

            <View style={styles.inner}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle ? (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    ) : null}
                </View>

                <Body
                    style={[styles.body, !scrollable && styles.bodyCentered]}
                    contentContainerStyle={
                        scrollable ? styles.scrollContainer : undefined
                    }
                >
                    {children}
                </Body>

                <View style={styles.footer}>
                    {onNext && (
                        <Button
                            onPress={onNext}
                            disabled={disableNext}
                            containerStyle={styles.button}
                            buttonStyle={styles.buttonContent}
                        >
                            Suivant
                        </Button>
                    )}
                    {onBack && (
                        <Button
                            type="outline"
                            onPress={onBack}
                            containerStyle={[styles.button, styles.backButton]}
                            buttonStyle={styles.buttonContent}
                        >
                            Retour
                        </Button>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    progressBar: {
        height: 12,
        marginTop: 60,
        marginBottom: 40,
        marginHorizontal: 20,
        borderRadius: 5,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
    },
    header: {
        alignItems: 'center',
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
    body: {
        flex: 1,
    },
    bodyCentered: {
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    footer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 24,
    },
    button: {
        borderRadius: 24,
        width: '80%',
        marginBottom: 16,
    },
    backButton: {
        marginBottom: 24,
    },
    buttonContent: {
        height: 48,
    },
});
