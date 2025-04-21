import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { Header } from '../../components/core/Typography';
import { lightTheme } from '../../styles/theme';
import { InputField } from '../../components/core/PlaceHolders';
import { TextInput } from 'react-native-gesture-handler';
import { validatePassword } from '../../utils/validation';
import { CButton } from '../../components/core/Buttons';

export const ResetPassword = () => {
    const [password, setPassword] = useState<string>('');
    const [passwordValidation, setPasswordValidation] = useState<string>('');

    const [errorPassword, setErrorPassword] = useState<string>('');
    const [errorPasswordValidation, setErrorPasswordValidation] =
        useState<string>('');

    const [passwordValid, setPasswordValid] = useState<boolean | undefined>(
        undefined,
    );
    const [passwordValidationValid, setPasswordValidationValid] = useState<
        boolean | undefined
    >(undefined);

    const passwordRef = useRef<TextInput>(null);
    const passwordValidationRef = useRef<TextInput>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        const is_valid = validatePassword(text);
        setPasswordValid(is_valid);
        setPasswordValidationValid(passwordValidation === text);
        if (passwordValidation === text) {
            setErrorPasswordValidation('');
        } else {
            setErrorPasswordValidation(
                'Les mots de passe doivent être identiques.',
            );
        }

        const errorMessage = !is_valid
            ? 'Mot de passe invalide (ex: GTH6dk_dk!)'
            : '';
        setErrorPassword(errorMessage);
    };

    const handlePasswordValidationChange = (text: string) => {
        setPasswordValidation(text);

        const is_valid = text === password;
        setPasswordValidationValid(is_valid);

        const errorMessage = !is_valid
            ? 'Les mots de passe doivent être identiques.'
            : '';
        setErrorPasswordValidation(errorMessage);
    };

    const handleSubmit = () => {
        // Send email to the server
    };

    return (
        <View style={styles.pageContainer}>
            <View style={styles.container}>
                <Header variant="h2" style={styles.header}>
                    Réinitialiser le mot de passe
                </Header>
                <Text style={styles.subtitle}>
                    Définissez le nouveau mot de passe de votre compte afin de
                    pouvoir vous connecter et accéder à toutes les
                    fonctionnalités.
                </Text>

                {/* Formulaire */}
                <View style={styles.form}>
                    <Text style={styles.label}>Nouveau mot de passe :</Text>
                    <InputField
                        ref={passwordRef}
                        placeholder="Entrez votre nouveau mot de passe"
                        secureTextEntry={!showPassword}
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
                        isValid={passwordValid}
                        onChangeText={handlePasswordChange}
                        errorMessage={errorPassword}
                    />
                    <Text style={styles.label}>Confirmer le mot de passe</Text>
                    <InputField
                        ref={passwordValidationRef}
                        placeholder="Confirmer le mot de passe"
                        secureTextEntry={!showPasswordValidation}
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
                        isValid={passwordValidationValid}
                        onChangeText={handlePasswordValidationChange}
                        errorMessage={errorPasswordValidation}
                    />
                </View>
            </View>

            <CButton
                variant="primary"
                size="xlarge"
                disabled={!passwordValid || !passwordValidationValid}
                onPress={handleSubmit}
                style={{ alignSelf: 'flex-end' }}
            >
                Continuer
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
