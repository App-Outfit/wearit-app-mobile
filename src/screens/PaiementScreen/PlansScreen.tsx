import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Header } from '../../components/core/Typography';
import { StyleSheet } from 'react-native';

import { core_header_styles, sub_header_styles } from '../../styles/coreStyle';
import { ScrollView } from 'react-native-gesture-handler';

export function PlansScreen() {
    return (
        <View>
            <ScrollView />
            <Text style={[core_header_styles, styles.header]}>
                Choisissez votre meilleur plan !
            </Text>

            <View style={styles.plansContainer}>
                <PlansBox
                    title="Gratuit"
                    price={0}
                    description="Bénéficiez de 10 essais de vêtements par jours."
                    recommandation={false}
                />
            </View>
            <ScrollView />
        </View>
    );
}

type planBoxProps = {
    title: string;
    price: number;
    description: string;
    recommandation: boolean;
};
const PlansBox = ({
    title,
    price,
    description,
    recommandation = false,
}: planBoxProps) => {
    return (
        <View style={planBoxStyle.container}>
            <View>
                <Text style={[sub_header_styles]}>{title}</Text>
            </View>

            <View>
                <Text>{price} EUR</Text>
                <Text>/ mois</Text>
            </View>

            <View>
                <Text>{description}</Text>
            </View>

            <View>
                <Text>Vous êtes ici</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 60,
    },
    plansContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        marginTop: 30,
        marginBottom: 30,
    },
});

const planBoxStyle = StyleSheet.create({
    container: {
        height: 284,
        width: 335,
        padding: 30,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginHorizontal: 'auto',

        backgroundColor: 'white',
        color: '#ffffff',

        borderRadius: 20,
    },
});
