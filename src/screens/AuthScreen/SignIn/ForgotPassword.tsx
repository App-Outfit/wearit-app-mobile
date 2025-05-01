import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../../components/core/Typography';
import { lightTheme } from '../../../styles/theme';
import { InputField } from '../../../components/core/PlaceHolders';
import { TextInput } from 'react-native-gesture-handler';
import { validateEmail } from '../../../utils/validation';
import { CButton } from '../../../components/core/Buttons';

export const ForgotPassword = ({ navigation }: any) => {
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [errorEmail, setErrorEmail] = useState<string>('');

    const [emailValid, setEmailValid] = useState<boolean | undefined>(
        undefined,
    );

    const emailRef = useRef<TextInput>(null);

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        const is_valid = validateEmail(text);
        setEmailValid(is_valid);

        const errorMessage = !is_valid ? 'Email invalide' : '';
        setErrorEmail(errorMessage);
    }, []);

    const handleSubmit = () => {
        // TODO: Change 'true' by email validation
        if (true) {
            // Send email to the server
            // Redirect to the next screen
            navigation.push('CodeVerification');
        }
    };

    return (
        <View style={styles.pageContainer}>
            <View style={styles.container}>
                <Header variant="h2" style={styles.header}>
                    Mot de passe oublié
                </Header>
                <Text style={styles.subtitle}>
                    Entrez votre email pour le processus de vérification. Nous
                    vous enverrons un code à 4 chiffres à votre adresse e-mail.
                </Text>

                {/* Formulaire */}
                <View style={styles.form}>
                    <Text style={styles.label}>E-mail</Text>
                    <InputField
                        ref={emailRef}
                        placeholder="Entrez votre adresse email"
                        keyboardType="email-address"
                        returnKeyType="next"
                        submitBehavior="submit"
                        isValid={emailValid}
                        onChangeText={handleEmailChange}
                        errorMessage={errorEmail}
                    />
                </View>
            </View>

            <CButton
                variant="primary"
                size="xlarge"
                disabled={!emailValid}
                onPress={handleSubmit}
                style={{ alignSelf: 'flex-end' }}
            >
                Envoyez le code
            </CButton>
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    header: {
        marginTop: 0,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    form: {
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginBottom: 0,
        color: lightTheme.colors.black,
    },
});

export default ForgotPassword;
