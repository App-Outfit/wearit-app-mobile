import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { InputField } from '../../../components/core/PlaceHolders';
import { baseColors, spacing } from '../../../styles/theme';
import { Picker } from '@react-native-picker/picker';

import { useSelector } from 'react-redux';
import {
    selectUserProfile,
    selectUserSummary,
} from '../selectors/userSelectors';
import { RootState } from '../../../store'; // adapte selon ton projet

export function UserDataScreen() {
    // on récupère le profil (ou null)
    const userProfile = useSelector((state: RootState) =>
        selectUserSummary(state),
    );
    const formatGender = React.useCallback(
        (str) => str?.charAt(0).toUpperCase() + str?.slice(1),
        [],
    );

    // états locaux, avec valeurs par défaut
    const [email, setEmail] = React.useState<string>(userProfile?.email ?? '');
    const [firstName, setFirstName] = React.useState<string>(
        userProfile?.first_name ?? '',
    );
    const [age, setAge] = React.useState<string>(
        userProfile?.answers?.age ?? '',
    );
    const [gender, setGender] = React.useState<string>(
        userProfile?.gender ? formatGender(userProfile.gender) : 'None',
    );

    // Handlers
    const handleChangeFirstName = React.useCallback(
        (text: string) => setFirstName(text),
        [],
    );
    const handleChangeEmail = React.useCallback(
        (text: string) => setEmail(text),
        [],
    );
    const handleGenderChange = React.useCallback(
        (value: string) => setGender(value as any),
        [],
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Prénom</Text>
                <InputField
                    value={firstName}
                    placeholder="Entrez votre prénom"
                    disabled
                    onChangeText={handleChangeFirstName}
                />

                <Text style={styles.label}>E-mail</Text>
                <InputField
                    value={email}
                    placeholder="Entrez votre adresse email"
                    disabled
                    onChangeText={handleChangeEmail}
                />

                <Text style={styles.label}>Âge</Text>
                <InputField
                    value={age}
                    placeholder="Votre tranche d'âge"
                    disabled
                />

                <Text style={styles.label}>Genre</Text>
                {/* <Picker
          selectedValue={gender}
          onValueChange={handleGenderChange}
          enabled={false}
        >
          <Picker.Item label="Homme" value="Homme" />
          <Picker.Item label="Femme" value="Femme" />
          <Picker.Item label="Non-Binaire" value="Non-Binaire" />
        </Picker> */}
                <InputField value={gender} placeholder="Ton genre" disabled />
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
        marginBottom: 4,
        color: baseColors.black,
    },
});
