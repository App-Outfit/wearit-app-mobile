import * as React from 'react';
import { useCallback, useState } from 'react';
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    Keyboard,
    Image,
} from 'react-native';
import { Header } from '../../../components/core/Typography';
import { lightTheme } from '../../../styles/theme';
import { InputField } from '../../../components/core/PlaceHolders';
import { CButton } from '../../../components/core/Buttons';
import { validateEmail } from '../../../utils/validation';
import { DividerText } from '../../../components/core/Divider';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const LogIn: React.FC = ({ navigation }: any) => {
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    const [emailValid, setEmailValid] = useState<boolean | undefined>(
        undefined,
    );
    const [passwordValid, setPasswordValid] = useState<boolean | undefined>(
        undefined,
    );

    const emailRef = React.useRef<TextInput>(null);
    const passwordRef = React.useRef<TextInput>(null);

    const handleEmailChange = useCallback((text: string) => {
        setEmail(text);
        const is_valid = validateEmail(text);
        setEmailValid(is_valid);

        const errorMessage = !is_valid
            ? 'Veuillez entrez une adresse e-mail valide'
            : '';
        setErrorEmail(errorMessage);
    }, []);

    const handlePasswordChange = useCallback(
        (text: string) => {
            setPassword(text);
            const is_valid = text.length > 0;
            setPasswordValid(is_valid);

            const errorMessage = !is_valid
                ? 'Veuillez entrez un mot de passe valide'
                : '';
            setErrorPassword(errorMessage);
        },
        [emailValid, passwordValid],
    );

    const handleSubmit = useCallback(() => {
        if (emailValid && passwordValid) {
            // Submit the form
        }
    }, [emailValid, passwordValid]);

    const moveToSignInPage = () => {
        navigation.navigate('SignUp');
    };

    const moveToForgotPassword = () => {
        navigation.push('ForgotPassword');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header variant="h2" style={styles.header}>
                Connectez-vous à votre compte
            </Header>
            <Text style={styles.subtitle}>
                C'est formidable de vous revoir.
            </Text>

            {/* Formulaire */}
            <View style={styles.form}>
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
                />

                {/* Mot de passe oublié */}
                <Text style={styles.conditions}>
                    Vous avez oublié le mot de passe ?{' '}
                    <Text style={styles.link} onPress={moveToForgotPassword}>
                        Reinitialisez
                    </Text>
                </Text>
            </View>

            {/* Bouton Connexion */}
            <CButton
                variant="primary"
                size="xlarge"
                disabled={!emailValid || !passwordValid} // Désactiver le bouton si un champ est invalide
                onPress={handleSubmit}
            >
                Se Connecter
            </CButton>

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

            {/* Inscription */}
            <Text style={styles.loginText}>
                Vous n'avez pas de compte ?{' '}
                <Text style={styles.link} onPress={moveToSignInPage}>
                    Inscription
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'flex-start',
    },
    header: {
        marginTop: 60,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: lightTheme.colors.gray_4,
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
    loginText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        textAlign: 'center',
        color: lightTheme.colors.lightGray,
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
});
