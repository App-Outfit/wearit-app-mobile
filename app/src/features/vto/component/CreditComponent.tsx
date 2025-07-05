import * as React from 'react';

import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectUserCredits } from '../../profil/selectors/userSelectors';
import { fetchCredits, fetchProfile } from '../../profil/thunks/userThunks';

export const CreditComponent = ({ navigation }) => {
    const credits = useAppSelector(selectUserCredits);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (!credits) {
            dispatch(fetchCredits());
        }
    }, [dispatch]);

    return (
        <View style={styles.creditBox}>
            <TouchableOpacity
                style={styles.creditContent}
                onPress={() => navigation.push('ProfilSubscription')}
            >
                <Text style={styles.textCredit}>{credits || 0}</Text>
                <MaterialCommunityIcons
                    name="diamond"
                    size={18}
                    color="#FFB300"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    creditBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15, // Décalage vers la gauche
    },
    creditContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 90,
    },
    textCredit: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 8,
    },
});
