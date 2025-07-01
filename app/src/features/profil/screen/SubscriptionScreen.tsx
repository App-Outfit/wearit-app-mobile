import * as React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { baseColors, spacing, typography } from '../../../styles/theme';
import { Button, Chip } from 'react-native-paper';
import { CButton } from '../../../components/core/Buttons';
import { color } from 'react-native-elements/dist/helpers';

export function SubscribtionScreen() {
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Rechargez des Crédits !</Text>
                </View>

                <View>
                    <SubscribtionItem
                        title="Gratuit"
                        price={'0'}
                        description={'Profitez de 100 crédits gratuits.'}
                        isActive={true}
                    />
                    <SubscribtionItem
                        title="Petite Recharge"
                        price={'4,99'}
                        description={
                            'Recharger vous de X credits, représentant X essais'
                        }
                    />
                    <SubscribtionItem
                        title="Recharge"
                        price={'9,99'}
                        description={
                            'Recharger vous de X credits, représentant X essais'
                        }
                        isRecommanded={true}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

function SubscribtionItem({
    title,
    price,
    description,
    isActive = false,
    isRecommanded = false,
}) {
    return (
        <View
            style={[
                styles.subscriptionItem,
                isActive && styles.subscriptionActive,
            ]}
        >
            {isRecommanded && (
                <Chip style={styles.chip} selectedColor={baseColors.yellow}>
                    Recommandé
                </Chip>
            )}

            <View>
                <Text
                    style={[
                        styles.subTitle,
                        isActive && { color: baseColors.white },
                    ]}
                >
                    {title}
                </Text>
            </View>
            <View>
                <Text
                    style={[
                        styles.subPrice,
                        isActive && { color: baseColors.white },
                    ]}
                >
                    {price} €
                </Text>
            </View>
            <View>
                <Text
                    style={[
                        styles.subDescr,
                        isActive && { color: baseColors.white },
                    ]}
                >
                    {description}
                </Text>
            </View>
            {isActive ? (
                <View>
                    <Text style={styles.activeText}>Vous êtes ici</Text>
                </View>
            ) : (
                <View style={{ marginTop: spacing.xLarge }}>
                    <CButton
                        onPress={() => console.log('choose btn')}
                        variant="primary"
                        size="xlarge"
                    >
                        Choisir
                    </CButton>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.medium,
    },
    header: {
        fontSize: 30,
        fontWeight: 700,
        fontFamily: typography.poppins.bold,
        textAlign: 'center',
    },
    headerContainer: {
        marginBottom: spacing.xLarge,
    },
    subscriptionItem: {
        minHeight: 284,
        borderColor: baseColors.lightGray,
        borderWidth: 1,
        borderRadius: spacing.medium,

        paddingHorizontal: spacing.medium,
        paddingVertical: spacing.large,
        justifyContent: 'space-around',
        alignItems: 'center',

        marginBottom: spacing.xLarge,
    },
    subscriptionActive: {
        borderBlockColor: baseColors.primary,
        borderColor: baseColors.primary,
        borderWidth: 3,
        backgroundColor: baseColors.black,
    },
    subTitle: {
        marginTop: spacing.xSmall,
        fontSize: 24,
        fontFamily: typography.poppins.semiBold,
    },
    subPrice: {
        fontSize: 48,
        fontFamily: typography.poppins.bold,
        letterSpacing: -2,
        marginVertical: spacing.small,
    },
    subDescr: {
        fontFamily: typography.poppins.regular,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: spacing.small,
    },
    activeText: {
        fontSize: 16,
        fontFamily: typography.poppins.regular,
        color: baseColors.secondary,
    },
    chip: {
        margin: 0,
        marginBottom: spacing.medium,
        alignSelf: 'flex-end',
        backgroundColor: baseColors.yellow_2,
    },
});
