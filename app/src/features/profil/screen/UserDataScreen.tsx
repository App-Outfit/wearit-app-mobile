import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { InputField } from '../../../components/core/PlaceHolders';
import { baseColors, spacing } from '../../../styles/theme';

import { Picker } from '@react-native-picker/picker';

export function UserDataScreen() {
    // Valeurs par défaut (à adapter à ton contexte utilisateur)
    const [email, setEmail] = React.useState<string>('utilisateur@email.com');
    const [firstName, setFirstName] = React.useState<string>('Jean');
    const [lastName, setLastName] = React.useState<string>('Dupont');
    const [birthDate, setBirthDate] = React.useState('01/01/1990');
    const [gender, setGender] = React.useState<
        'Homme' | 'Femme' | 'Non-Binaire'
    >('Homme');
    const genderPickerRef = React.useRef<'Homme' | 'Femme' | 'Non-Binaire'>(
        'Homme',
    );

    const handleChangeFirstName = React.useCallback((text: string) => {
        setFirstName(text);

        //TODO: Verification
        //TODO: HandleError
    }, []);

    const handleChangeLastName = React.useCallback((text: string) => {
        setLastName(text);

        //TODO: Verification
        //TODO: HandleError
    }, []);

    const handleChangeEmail = React.useCallback((text: string) => {
        setEmail(text);

        //TODO: Verification
        //TODO: HandleError
    }, []);

    const handleGenderChange = React.useCallback((text: string) => {
        console.log(text);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Prénom</Text>
                <InputField
                    value={firstName}
                    placeholder="Entrez votre prénom"
                    returnKeyType="next"
                    submitBehavior="submit"
                    disabled={true}
                    onChangeText={handleChangeFirstName}
                />

                <Text style={styles.label}>Nom</Text>
                <InputField
                    value={lastName}
                    placeholder="Entrez votre nom"
                    returnKeyType="next"
                    submitBehavior="submit"
                    disabled={true}
                    onChangeText={handleChangeLastName}
                />

                <Text style={styles.label}>E-mail</Text>
                <InputField
                    value={email}
                    placeholder="Entrez votre adresse email"
                    returnKeyType="next"
                    submitBehavior="submit"
                    disabled={true}
                    onChangeText={handleChangeEmail}
                />

                <Text style={styles.label}>Date de naissance</Text>
                <InputField
                    value={birthDate}
                    placeholder="JJ/MM/AAAA"
                    keyboardType="default"
                    returnKeyType="next"
                    submitBehavior="submit"
                    disabled={true}
                />

                <Text style={styles.label}>Genre</Text>
                <InputField
                    value={gender}
                    placeholder="Votre genre"
                    keyboardType="default"
                    returnKeyType="done"
                    submitBehavior="submit"
                    disabled={true}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.medium,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginBottom: 0,
        color: baseColors.black,
    },
});
