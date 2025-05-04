import React from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import {
    ProgressBar,
    useTheme,
    Title,
    Subheading,
    Button,
} from 'react-native-paper';

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
    const { colors } = useTheme();

    const Body = scrollable ? ScrollView : View;

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
            <View style={styles.inner}>
                <View style={styles.header}>
                    <Title style={styles.title}>{title}</Title>
                    {subtitle ? (
                        <Subheading style={styles.subtitle}>
                            {subtitle}
                        </Subheading>
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
                            mode="contained"
                            onPress={onNext}
                            disabled={disableNext}
                            contentStyle={styles.buttonContent}
                            style={styles.button}
                        >
                            Suivant
                        </Button>
                    )}
                    {onBack && (
                        <Button
                            mode="outlined"
                            onPress={onBack}
                            contentStyle={styles.buttonContent}
                            style={[styles.button, styles.backButton]}
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
        height: 10,
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
