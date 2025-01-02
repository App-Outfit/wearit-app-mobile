import React, { useRef, useState, useCallback, isValidElement } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Keyboard,
} from 'react-native';
import { Header } from '../../components/core/Typography';
import { lightTheme } from '../../styles/theme';
import { InputField } from '../../components/core/PlaceHolders';
import { CButton } from '../../components/core/Buttons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    validateEmail,
    validatePassword,
    validateUsername,
} from '../../utils/validation';
import { DividerText } from '../../components/core/Divider';
import { eyeIcon } from '../../assets';

export function SignUp({ navigation }: any) {
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorUsername, setErrorUsername] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    const [emailValid, setEmailValid] = useState<boolean | undefined>(
        undefined,
    );
    const [usernameValid, setUsernameValid] = useState<boolean | undefined>(
        undefined,
    );
    const [passwordValid, setPasswordValid] = useState<boolean | undefined>(
        undefined,
    );

    const [showPassword, setShowPassword] = useState(false);

    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        const is_valid = validateEmail(text);
        setEmailValid(is_valid);

        const errorMessage = !is_valid ? 'Email invalide' : '';
        setErrorEmail(errorMessage);
    }, []);

    const handleUsernameChange = useCallback((text: string) => {
        setUsername(text);
        const is_valid = validateUsername(text);
        setUsernameValid(is_valid);

        const errorMessage = !is_valid ? 'Username invalide' : '';
        setErrorUsername(errorMessage);
    }, []);

    const handlePasswordChange = useCallback((text: string) => {
        setPassword(text);
        const is_valid = validatePassword(text);
        setPasswordValid(is_valid);

        const errorMessage = !is_valid
            ? 'Mot de passe invalide (ex: GTH6dk_dk!)'
            : '';
        setErrorPassword(errorMessage);
    }, []);

    const handleSubmit = useCallback(() => {
        if (emailValid && usernameValid && passwordValid) {
            console.log('Form is valid, submitting...');
        } else {
            console.log('Form is invalid, please correct the errors.');
        }
    }, [emailValid, usernameValid, passwordValid]);

    const moveToLoginPage = () => {
        navigation.navigate('LogIn');
    };

    return (
        <View style={styles.container}>
            {/* Titre */}
            <Header variant="h2" style={styles.header}>
                Créer un compte
            </Header>
            <Text style={styles.subtitle}>Créons votre compte.</Text>

            {/* Formulaire */}
            <View style={styles.form}>
                {/* Nom et prénom */}
                <Text style={styles.label}>Nom et prénom</Text>
                <InputField
                    ref={nameRef}
                    placeholder="Entrez votre nom complet"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current!.focus()}
                    submitBehavior="submit"
                    isValid={usernameValid}
                    onChangeText={handleUsernameChange}
                    errorMessage={errorUsername}
                />

                {/* E-mail */}
                <Text style={styles.label}>E-mail</Text>
                <InputField
                    ref={emailRef}
                    placeholder="Entrez votre adresse email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current!.focus()}
                    submitBehavior="submit"
                    isValid={emailValid}
                    onChangeText={handleEmailChange}
                    errorMessage={errorEmail}
                />

                {/* Mot de passe */}
                <Text style={styles.label}>Mot de passe</Text>
                <InputField
                    ref={passwordRef}
                    placeholder="Entrez votre mot de passe"
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    isValid={passwordValid}
                    onChangeText={handlePasswordChange}
                    errorMessage={errorPassword}
                    iconRight={eyeIcon}
                />
            </View>

            {/* Conditions */}
            <Text style={styles.conditions}>
                En vous inscrivant, vous acceptez nos{' '}
                <Text style={styles.link}>conditions générales</Text>, notre{' '}
                <Text style={styles.link}>politique de confidentialité</Text> et
                notre <Text style={styles.link}>utilisation des cookies</Text>.
            </Text>

            {/* Bouton Créer un compte */}
            <CButton
                variant="primary"
                size="xlarge"
                disabled={!emailValid || !usernameValid || !passwordValid} // Désactiver le bouton si un champ est invalide
                onPress={handleSubmit}
            >
                Créer un compte
            </CButton>

            {/* Ou */}
            <DividerText text="Ou" />

            {/* Boutons Google et Facebook */}
            <TouchableOpacity style={styles.googleButton}>
                <Image
                    source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                    }}
                    style={styles.socialIcon}
                />
                <Text style={styles.googleButtonText}>
                    Inscrivez-vous avec Google
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebookButton}>
                <Image
                    source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_2019.png',
                    }}
                    style={styles.socialIcon}
                />
                <Text style={styles.facebookButtonText}>
                    Inscrivez-vous avec Facebook
                </Text>
            </TouchableOpacity>

            {/* Connexion */}
            <Text style={styles.loginText}>
                Vous avez déjà un compte ?{' '}
                <Text style={styles.link} onPress={moveToLoginPage}>
                    Connecter
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        marginTop: 60,
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
    conditions: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: lightTheme.colors.black,
        marginBottom: 20,
    },
    link: {
        color: lightTheme.colors.primary,
        textDecorationLine: 'underline',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6200EE',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    facebookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1877F2',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    socialIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#6200EE',
        fontSize: 16,
        fontWeight: 'bold',
    },
    facebookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        textAlign: 'center',
        color: lightTheme.colors.lightGray,
    },
});
