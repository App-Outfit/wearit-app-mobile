import * as React from 'react';
import { useCallback, useRef, useState, useEffect } from 'react';
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
import { validateEmail } from '../../../utils/validation';
import { CButton } from '../../../components/core/Buttons';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { forgotPassword, clearStatus } from '../../../store/authSlice';

export const ForgotPassword = ({ navigation }: any) => {
    // 1) État local
    const [emailLocal, setEmailLocal] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [emailValid, setEmailValid] = useState<boolean>(false);

    // 2) Connexion au store
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((s) => s.auth);

    const prevStatus = useRef(status);

    const emailRef = useRef<TextInput>(null);

    // 3) Validation locale
    const handleEmailChange = useCallback((text: string) => {
        setEmailLocal(text);
        const ok = validateEmail(text);
        setEmailValid(ok);
        setErrorEmail(ok ? '' : 'Email invalide');
    }, []);

    // 4) Envoi de l’action Redux
    const handleSubmit = () => {
        if (!emailValid) return;
        dispatch(forgotPassword(emailLocal));
    };

    // 5) Dès que la requête est réussie, on navigue
    useEffect(() => {
        // On passe de loading→succeeded => on navigue
        if (prevStatus.current === 'loading' && status === 'succeeded') {
            navigation.navigate('CodeVerification', { email: emailLocal });
            // puis on clear pour ne pas retomber dessus
            dispatch(clearStatus());
        }
        prevStatus.current = status;
    }, [status]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.pageContainer}>
                <View style={styles.container}>
                    <Header variant="h2" style={styles.header}>
                        Mot de passe oublié
                    </Header>
                    <Text style={styles.subtitle}>
                        Entrez votre email pour le processus de vérification.
                        Nous vous enverrons un code à 4 chiffres à votre adresse
                        e-mail.
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
