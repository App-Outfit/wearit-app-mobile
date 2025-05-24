import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ProfilScreen } from '../screen/ProfilScreen';
import { screenOptions } from '../../../styles/screen';
import { UserDataScreen } from '../screen/UserDataScreen';
import { SubscribtionScreen } from '../screen/SubscriptionScreen';

const ProfilStack = createStackNavigator();

export function ProfilNavigator() {
    return (
        <ProfilStack.Navigator initialRouteName="ProfilHome">
            <ProfilStack.Screen
                name="ProfilHome"
                component={ProfilScreen}
                options={{
                    ...screenOptions,
                    headerShown: true,
                    title: 'Profil',
                }}
            />
            <ProfilStack.Screen
                name="ProfilUserData"
                component={UserDataScreen}
                options={{
                    ...screenOptions,
                    headerShown: true,
                    title: 'Mes données',
                }}
            />
            <ProfilStack.Screen
                name="ProfilSubscription"
                component={SubscribtionScreen}
                options={{
                    ...screenOptions,
                    headerShown: true,
                    title: 'Mes Crédits',
                }}
            />
        </ProfilStack.Navigator>
    );
}
