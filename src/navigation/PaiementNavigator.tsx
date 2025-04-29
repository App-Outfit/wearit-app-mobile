import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Here all screens refer to Paiement Screens
import { PlansScreen } from '../screens/PaiementScreen/PlansScreen';

const PaiementStack = createStackNavigator();

export const PaiementNavigator = () => {
    return (
        <PaiementStack.Navigator initialRouteName="Plans">
            <PaiementStack.Screen
                name="Plans"
                component={PlansScreen}
                options={{
                    headerShown: true,
                    title: 'Abonnements',
                    headerTitleAlign: 'center',
                }}
            />
        </PaiementStack.Navigator>
    );
};
