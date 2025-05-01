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
import OTPInput from '../../../components/core/OTPInput';
import { CButton } from '../../../components/core/Buttons';

import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { verifyReset } from '../../../store/authSlice';

export const CodeVerification: React.FC<any> = ({ navigation, route }) => {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((s) => s.auth);
    const { email } = route.params as { email: string };

    const [code, setCode] = useState<string>('');

    // Dès que la vérification est réussie, on navigue
    useEffect(() => {
        if (status === 'succeeded') {
            navigation.replace('ResetPassword', { email, code });
        }
    }, [status, navigation]);

    const handleCodeFilled = useCallback(
        (entered: string) => {
            setCode(entered);
            // on peut dispatcher directement ici si on veut
            dispatch(verifyReset({ email, code: entered }));
        },
        [dispatch, email, code],
    );

    const handleSubmit = () => {
        dispatch(verifyReset({ email, code }));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.pageContainer}>
                <View style={styles.container}>
                    <Header variant="h2" style={styles.header}>
                        Entrez le code à 4 chiffres
                    </Header>
                    <Text style={styles.subtitle}>
                        Saisissez le code à 4 chiffres que vous recevez sur
                        votre e-mail.
                    </Text>

                    {/* Code Input */}
                    <View style={styles.codeBox}>
                        <OTPInput length={4} onCodeFilled={handleCodeFilled} />
                    </View>

                    {status === 'failed' && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}
                </View>

                <CButton
                    variant="primary"
                    size="xlarge"
                    disabled={code.length !== 4 || status === 'loading'}
                    onPress={handleSubmit}
                    style={{ alignSelf: 'flex-end' }}
                >
                    Valider
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
    codeBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#B00020',
        textAlign: 'center',
        marginTop: 10,
    },
});
