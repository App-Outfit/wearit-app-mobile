import * as React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { baseColors, spacing } from '../../../styles/theme';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function ProfilScreen({ navigation }) {
    const styleItem = {
        titleStyle: styles.itemTitle,
        containerStyle: styles.itemContainerStyle,
    };

    const sizeIcon = 25;
    const leftArrow = () => (
        <Feather
            name="chevron-right"
            size={sizeIcon}
            color={baseColors.lightGray}
        />
    );
    const leftArrowWarning = () => (
        <Feather
            name="chevron-right"
            size={sizeIcon}
            color={baseColors.error}
        />
    );
    const iconLeftConfig = { size: sizeIcon, color: baseColors.black };

    return (
        <ScrollView>
            <List.Section>
                <List.Subheader style={styles.subHeader}>
                    Utilisateur
                </List.Subheader>
                <List.Item
                    {...styleItem}
                    title="Mon mannequin"
                    right={leftArrow}
                    left={() => (
                        <Ionicons name="body-outline" {...iconLeftConfig} />
                    )}
                    // onPress={}
                />
                <List.Item
                    {...styleItem}
                    title="Mes données"
                    right={leftArrow}
                    left={() => (
                        <FontAwesome name="id-card-o" {...iconLeftConfig} />
                    )}
                    onPress={() => navigation.push('ProfilUserData')}
                />
                <List.Item
                    {...styleItem}
                    title="Plans et Crédits"
                    right={leftArrow}
                    left={() => (
                        <MaterialCommunityIcons
                            name="wallet-membership"
                            {...iconLeftConfig}
                        />
                    )}
                    onPress={() => navigation.push('ProfilSubscription')}
                />
            </List.Section>
            <List.Section>
                <List.Subheader style={styles.subHeader}>
                    Essayages
                </List.Subheader>
                <List.Item
                    {...styleItem}
                    title="Essayages enregistrés"
                    right={leftArrow}
                    left={() => (
                        <FontAwesome name="bookmark-o" {...iconLeftConfig} />
                    )}
                    // onPress={}
                />
            </List.Section>
            <List.Section>
                <List.Subheader style={styles.subHeader}>
                    Paramètres de Session
                </List.Subheader>
                <List.Item
                    {...styleItem}
                    titleStyle={{
                        ...styleItem.titleStyle,
                        color: baseColors.error,
                    }}
                    title="Se déconnecter"
                    right={leftArrowWarning}
                    left={() => (
                        <Feather
                            name="log-out"
                            {...iconLeftConfig}
                            color={baseColors.error}
                        />
                    )}
                    // onPress={}
                />
            </List.Section>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    subHeader: {
        color: baseColors.gray_5,
    },
    itemTitle: {
        color: baseColors.black,
        fontSize: 16,
    },
    itemContainerStyle: {
        justifyContent: 'center',
        paddingLeft: spacing.medium,

        // borderBlockColor: "#000",
        // borderWidth: 1,
    },
});
