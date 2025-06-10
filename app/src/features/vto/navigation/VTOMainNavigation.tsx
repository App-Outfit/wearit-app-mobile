import {
    StackHeaderProps,
    createStackNavigator,
} from '@react-navigation/stack';
import * as React from 'react';
import { screenOptions } from '../../../styles/screen';
import { VTODressingScreen } from '../screen/VTOHomeScreen';
import { CreditComponent } from '../component/CreditComponent';
import { useNavigation } from '@react-navigation/native';
import { SubscribtionScreen } from '../../profil/screen/SubscriptionScreen';

const VTOStack = createStackNavigator();

export function VTONavigator() {
    return (
        <VTOStack.Navigator initialRouteName="VTOHome">
            <VTOStack.Screen
                name="VTOHome"
                component={VTODressingScreen}
                options={({ navigation }) => ({
                    ...screenOptions,
                    headerShown: true,
                    title: 'Virtual Try On',
                    headerRight: () => (
                        <CreditComponent navigation={navigation} />
                    ),
                })}
            />

            <VTOStack.Screen
                name="ProfilSubscription"
                component={SubscribtionScreen}
                options={{
                    ...screenOptions,
                    headerShown: true,
                    title: 'Mes Crédits',
                }}
            />
        </VTOStack.Navigator>
    );
}
