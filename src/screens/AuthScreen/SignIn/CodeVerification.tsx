import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { Header } from '../../../components/core/Typography';
import { lightTheme } from '../../../styles/theme';
import { InputField } from '../../../components/core/PlaceHolders';
import { TextInput } from 'react-native-gesture-handler';
import { validatePassword } from '../../../utils/validation';
import { CButton } from '../../../components/core/Buttons';
import OTPInput from '../../../components/core/OTPInput';

export const CodeVerification = ({ navigation }: any) => {
    const handleSubmit = () => {
        navigation.navigate('ResetPassword');
    };

    const handleCodeFilled = (code: string) => {
        console.log('Code entré:', code);
        // appeler ton API / navigation / etc.
    };

    return (
        <View style={styles.pageContainer}>
            <View style={styles.container}>
                <Header variant="h2" style={styles.header}>
                    Entrez le code à 4 chiffres
                </Header>
                <Text style={styles.subtitle}>
                    Saisissez le code à 4 chiffres que vous recevez sur votre
                    e-mail (cody.fisher45@example.com).
                </Text>

                {/* Code Input */}
                <View style={styles.codeBox}>
                    <OTPInput length={4} onCodeFilled={handleCodeFilled} />
                </View>
            </View>

            <CButton
                variant="primary"
                size="xlarge"
                disabled={false}
                onPress={handleSubmit}
                style={{ alignSelf: 'flex-end' }}
            >
                Valider
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
    codeBox: {
        flex: 1,
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginBottom: 0,
        color: lightTheme.colors.black,
    },
});
