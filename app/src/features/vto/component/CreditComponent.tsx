import * as React from 'react';

import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectUserCredits } from '../../profil/selectors/userSelectors';
import { fetchCredits } from '../../profil/thunks/userThunks';

export const CreditComponent = ({ navigation }) => {
    const credits = useAppSelector(selectUserCredits);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (credits === null || credits === undefined || credits <= 0) {
            dispatch(fetchCredits());
        }
    }, [credits]);

    return (
        <View style={styles.creditBox}>
            <TouchableOpacity
                style={styles.creditContent}
                onPress={() => navigation.push('ProfilSubscription')}
            >
                <Text style={styles.textCredit}>{credits || 0}</Text>
                <MaterialCommunityIcons
                    name="diamond"
                    size={14}
                    color="#FFB300"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    creditBox: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    creditContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        minWidth: 70,
    },
    textCredit: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 5,
    },
});
