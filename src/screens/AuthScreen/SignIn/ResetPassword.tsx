import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { Header } from '../../../components/core/Typography';
import { lightTheme } from '../../../styles/theme';
import { InputField } from '../../../components/core/PlaceHolders';
import { TextInput } from 'react-native-gesture-handler';
import { validatePassword } from '../../../utils/validation';
import { CButton } from '../../../components/core/Buttons';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { resetPassword } from '../../../store/authSlice';

export const ResetPassword: React.FC<any> = ({ navigation, route }) => {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);

    // on récupère email+code passés en params
    const { email, code } = route.params as {
        email: string;
        code: string;
    };

    // local state pour les deux champs
    const [password, setPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState('');

    const [errorPassword, setErrorPassword] = useState('');
    const [errorPasswordValidation, setErrorPasswordValidation] = useState('');

    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    const [passwordValidationValid, setPasswordValidationValid] =
        useState<boolean>(false);

    const passwordRef = useRef<TextInput>(null);
    const passwordValidationRef = useRef<TextInput>(null);

    // 1️⃣ validation mot de passe
    const handlePasswordChange = useCallback(
        (text: string) => {
            setPassword(text);
            const ok = validatePassword(text);
            setPasswordValid(ok);
            if (!ok) {
                setErrorPassword('Mot de passe invalide (ex: GTH6dk_dk!)');
            } else {
                setErrorPassword('');
            }
            // on revérifie la confirmation
            const match = text === passwordValidation;
            setPasswordValidationValid(match);
            setErrorPasswordValidation(
                match ? '' : 'Les mots de passe doivent être identiques.',
            );
        },
        [passwordValidation],
    );

    // 2️⃣ validation confirmation
    const handlePasswordValidationChange = useCallback(
        (text: string) => {
            setPasswordValidation(text);
            const match = text === password;
            setPasswordValidationValid(match);
            setErrorPasswordValidation(
                match ? '' : 'Les mots de passe doivent être identiques.',
            );
        },
        [password],
    );

    // 3️⃣ dispatch du thunk
    const handleSubmit = useCallback(() => {
        if (passwordValid && passwordValidationValid) {
            dispatch(resetPassword({ email, code, new_password: password }));
        }
    }, [
        dispatch,
        email,
        code,
        password,
        passwordValid,
        passwordValidationValid,
    ]);

    // 4️⃣ écoute du status pour naviguer
    useEffect(() => {
        if (status === 'succeeded') {
            // une fois réinitialisé, on va à l'écran de connexion
            navigation.replace('LogIn');
        }
    }, [status, navigation]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.pageContainer}>
                <View style={styles.container}>
                    <Header variant="h2" style={styles.header}>
                        Réinitialiser le mot de passe
                    </Header>
                    <Text style={styles.subtitle}>
                        Définissez le nouveau mot de passe pour continuer.
                    </Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Nouveau mot de passe :</Text>
                        <InputField
                            ref={passwordRef}
                            placeholder="Entrez votre nouveau mot de passe"
                            secureTextEntry
                            isValid={passwordValid}
                            onChangeText={handlePasswordChange}
                            errorMessage={errorPassword}
                        />

                        <Text style={styles.label}>
                            Confirmez le mot de passe :
                        </Text>
                        <InputField
                            ref={passwordValidationRef}
                            placeholder="Confirmer le mot de passe"
                            secureTextEntry
                            isValid={passwordValidationValid}
                            onChangeText={handlePasswordValidationChange}
                            errorMessage={errorPasswordValidation}
                        />
                    </View>

                    {status === 'failed' && error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}
                </View>

                <CButton
                    variant="primary"
                    size="xlarge"
                    disabled={
                        !passwordValid ||
                        !passwordValidationValid ||
                        status === 'loading'
                    }
                    onPress={handleSubmit}
                    style={{ alignSelf: 'flex-end' }}
                >
                    Continuer
                </CButton>
            </View>
        </TouchableWithoutFeedback>
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
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: lightTheme.colors.black,
        marginTop: 12,
    },
    errorText: {
        color: '#B00020',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default ResetPassword;
