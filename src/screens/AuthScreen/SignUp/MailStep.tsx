// MailStep.tsx
import React, { useCallback, useState } from 'react';
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
    TextInput,
    Button,
    useTheme,
} from 'react-native-paper';
import { DividerText } from '../../../components/core/Divider';
import { validateEmail, validatePassword } from '../../../utils/validation';

interface MailStepProps {
    navigation: any;
    currentStep?: number;
    totalSteps?: number;
}

const MailStep: React.FC<MailStepProps> = ({
    navigation,
    currentStep = 8,
    totalSteps = 9,
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { colors } = useTheme();
    const progress = currentStep / totalSteps;

    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [passwordValid, setPasswordValid] = useState<boolean>(false);

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        const is_valid = validateEmail(text);
        setEmailValid(is_valid);
        setErrorEmail(is_valid ? '' : 'Email invalide');
    }, []);

    const handlePasswordChange = useCallback((text: string) => {
        setPassword(text);
        const is_valid = validatePassword(text);
        setPasswordValid(is_valid);
        setErrorPassword(
            is_valid ? '' : 'Mot de passe invalide (ex: GTH6dk_dk!)',
        );
    }, []);

    const handleContinue = () => {
        navigation.navigate('SuccessStep');
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
                    <Title style={styles.title}>Finalise ton inscription</Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                <View style={styles.contentBody}>
                    <View>
                        <TextInput
                            mode="flat"
                            placeholder="Adresse email"
                            value={email}
                            onChangeText={handleEmailChange}
                            style={styles.input}
                            placeholderTextColor="rgba(128, 128, 128, 0.5)"
                            // underlineColor="transparent"
                        />
                        {errorEmail ? (
                            <Text style={styles.errorText}>{errorEmail}</Text>
                        ) : null}

                        <TextInput
                            mode="flat"
                            placeholder="Mot de passe"
                            value={password}
                            onChangeText={handlePasswordChange}
                            style={styles.input}
                            placeholderTextColor="rgba(128, 128, 128, 0.5)"
                            // underlineColor="transparent"
                            secureTextEntry
                        />
                        {errorPassword ? (
                            <Text style={styles.errorText}>
                                {errorPassword}
                            </Text>
                        ) : null}

                        <Button
                            mode="contained"
                            disabled={!emailValid || !passwordValid}
                            onPress={handleContinue}
                            contentStyle={styles.buttonContent}
                            style={styles.button}
                        >
                            Continuer
                        </Button>
                    </View>

                    <DividerText text="Ou alors" />

                    <View style={styles.buttonsContainer}>
                        <Button
                            mode="outlined"
                            icon="google"
                            onPress={() => {
                                // TODO: intégration Google Sign-In
                            }}
                            contentStyle={styles.socialButtonContent}
                            style={[styles.button, styles.socialButton]}
                        >
                            Continuer avec Google
                        </Button>

                        <Button
                            mode="outlined"
                            icon="apple"
                            onPress={() => {
                                // TODO: intégration Apple Sign-In
                            }}
                            contentStyle={styles.socialButtonContent}
                            style={[styles.button, styles.socialButton]}
                        >
                            Continuer avec Apple
                        </Button>
                    </View>
                </View>
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
    contentBody: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 40,
    },
    input: {
        marginHorizontal: 18,
        marginVertical: 6,
        backgroundColor: 'transparent',
        textAlign: 'left',
        elevation: 0,
        borderBottomWidth: 0,
        fontSize: 16,
        transform: [{ translateY: -20 }],
    },
    errorText: {
        color: '#B00020',
        fontSize: 12,
        marginHorizontal: 18,
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        borderRadius: 24,
        width: '80%',
        marginBottom: 20,
        alignSelf: 'center',
    },
    buttonContent: {
        height: 48,
    },
    socialButton: {
        borderColor: '#ccc',
        marginVertical: 0,
    },
    socialButtonContent: {
        height: 48,
    },
});

export default MailStep;
