import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { Header } from '../../components/core/Typography';
import { lightTheme } from '../../styles/theme';
import { InputField } from '../../components/core/PlaceHolders';
import { Input } from 'react-native-elements';
import { CButton } from '../../components/core/Buttons';

export function SignUp() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            {/* Titre */}
            <Header variant="h2">Créer un compte</Header>
            <Text style={styles.subtitle}>Créons votre compte.</Text>

            {/* Formulaire */}
            <View style={styles.form}>
                {/* Nom et prénom */}
                <Text style={styles.label}>Nom et prénom</Text>
                <InputField placeholder="Entrez votre nom complet" />

                {/* E-mail */}
                <Text style={styles.label}>E-mail</Text>
                <InputField placeholder="Entrez votre adresse email" />

                {/* Mot de passe */}
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.passwordContainer}>
                    <InputField
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry={!showPassword}
                    />
                </View>
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
                disabled={true}
                onPress={() => console.log('connexion ...')}
            >
                Créer un compte
            </CButton>

            {/* Ou */}
            <Text style={styles.orText}>Ou</Text>

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
                <Text style={styles.link}>Connecter</Text>
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
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    form: {
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 0,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginBottom: 0,
        color: lightTheme.colors.black,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    showPassword: {
        color: '#888',
        marginLeft: 10,
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
    orText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
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
