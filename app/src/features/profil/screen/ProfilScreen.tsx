import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';
import { baseColors, spacing } from '../../../styles/theme';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DeconnexionModal } from '../components/DeconnexionModal';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectUserReferralCode } from '../selectors/userSelectors';
import {
    fetchCredits,
    fetchProfile,
    fetchReferralCode,
} from '../thunks/userThunks';
import { logout } from '../../auth/slices/authSlice';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ProfilScreen({ navigation }) {
    const [modalDisconect, setModalDisconnect] = React.useState<boolean>(false);
    const userRefferalCode = useAppSelector(selectUserReferralCode);
    const dispatch = useAppDispatch();

    const sizeIcon = 25;

    const onDisconnect = React.useCallback(() => {
        dispatch(logout());
        AsyncStorage.removeItem('token');

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Auth',
                        state: {
                            index: 0,
                            routes: [{ name: 'Welcome' }],
                        },
                    },
                ],
            }),
        );
    }, []);

    React.useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchCredits());
        dispatch(fetchReferralCode());
    }, [dispatch]);

    return (
        <View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: spacing.large }}
            >
                {/* Section: Utilisateur */}
                <Text style={styles.subHeader}>Utilisateur</Text>

                <ListItem
                    bottomDivider
                    onPress={() => navigation.push('ProfilBody')}
                >
                    <Icon
                        name="body-outline"
                        type="ionicon"
                        size={sizeIcon}
                        color={baseColors.black}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.itemTitle}>
                            Mon mannequin
                        </ListItem.Title>
                    </ListItem.Content>
                    <Feather
                        name="chevron-right"
                        size={sizeIcon}
                        color={baseColors.lightGray}
                    />
                </ListItem>

                <ListItem
                    bottomDivider
                    onPress={() => navigation.push('ProfilUserData')}
                >
                    <Icon
                        name="id-card-o"
                        type="font-awesome"
                        size={sizeIcon}
                        color={baseColors.black}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.itemTitle}>
                            Mes données
                        </ListItem.Title>
                    </ListItem.Content>
                    <Feather
                        name="chevron-right"
                        size={sizeIcon}
                        color={baseColors.lightGray}
                    />
                </ListItem>

                <ListItem
                    bottomDivider
                    onPress={() => navigation.push('ProfilSubscription')}
                >
                    <Icon
                        name="wallet-membership"
                        type="material-community"
                        size={sizeIcon}
                        color={baseColors.black}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.itemTitle}>
                            Plans et Crédits
                        </ListItem.Title>
                    </ListItem.Content>
                    <Feather
                        name="chevron-right"
                        size={sizeIcon}
                        color={baseColors.lightGray}
                    />
                </ListItem>

                {/* Section: Essayages */}
                <Text style={styles.subHeader}>Essayages</Text>

                <ListItem
                    bottomDivider
                    onPress={() => navigation.push('OufitSaved')}
                >
                    <Icon
                        name="bookmark-o"
                        type="font-awesome"
                        size={sizeIcon}
                        color={baseColors.black}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.itemTitle}>
                            Essayages enregistrés
                        </ListItem.Title>
                    </ListItem.Content>
                    <Feather
                        name="chevron-right"
                        size={sizeIcon}
                        color={baseColors.lightGray}
                    />
                </ListItem>

                {/* Section: Parrainage */}
                <Text style={styles.subHeader}>Code de Parrainage</Text>

                <ListItem bottomDivider>
                    <Icon
                        name="user-plus"
                        type="feather"
                        size={sizeIcon}
                        color={baseColors.black}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.itemTitle}>
                            {userRefferalCode}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                {/* Section: Session */}
                <Text style={styles.subHeader}>Paramètres de Session</Text>

                <ListItem
                    bottomDivider
                    onPress={() => setModalDisconnect(true)}
                >
                    <Icon
                        name="log-out"
                        type="feather"
                        size={sizeIcon}
                        color={baseColors.error}
                    />
                    <ListItem.Content>
                        <ListItem.Title
                            style={[
                                styles.itemTitle,
                                { color: baseColors.error },
                            ]}
                        >
                            Se déconnecter
                        </ListItem.Title>
                    </ListItem.Content>
                    <Feather
                        name="chevron-right"
                        size={sizeIcon}
                        color={baseColors.error}
                    />
                </ListItem>
            </ScrollView>

            <DeconnexionModal
                open={modalDisconect}
                onCancel={() => setModalDisconnect(false)}
                onAccept={onDisconnect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    subHeader: {
        color: baseColors.gray_5,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: spacing.large,
        marginLeft: spacing.medium,
        marginBottom: spacing.small,
    },
    itemTitle: {
        color: baseColors.black,
        fontSize: 16,
    },
});
