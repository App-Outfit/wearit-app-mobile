import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ProfilScreen } from '../screen/ProfilScreen';
import { screenOptions } from '../../../styles/screen';
import { UserDataScreen } from '../screen/UserDataScreen';
import { SubscribtionScreen } from '../screen/SubscriptionScreen';
import { DressingOutfitScreen } from '../../dressing/screen/DressingOutfit';
import { spacing } from '../../../styles/theme';
import { DressingOutfitDetail } from '../../dressing/screen/DressingOutfitDetail';

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
            <ProfilStack.Screen
                name="OufitSaved"
                component={DressingOutfitScreen}
                options={{
                    ...screenOptions,
                    title: 'Mes Outfits',
                    headerShown: true,
                    cardStyle: {
                        backgroundColor: '#ffffff',
                        paddingHorizontal: spacing.small,
                    },
                }}
            />
            <ProfilStack.Screen
                name="DressingOutfitDetail"
                component={DressingOutfitDetail}
                options={{
                    ...screenOptions,
                    title: 'Mes Outfits',
                    headerShown: true,
                    cardStyle: {
                        backgroundColor: '#ffffff',
                        paddingHorizontal: spacing.small,
                    },
                }}
            />
        </ProfilStack.Navigator>
    );
}
