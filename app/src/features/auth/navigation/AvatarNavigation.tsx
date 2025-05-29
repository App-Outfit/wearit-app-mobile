import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AvatarCreationScreen } from '../screens/AvatarCreation/AvatarCreation';
import { AvatarWaitingCreationScreen } from '../screens/AvatarCreation/AvatarWaitingCreation';

const AvatarStack = createStackNavigator();

export function AvatarCreationNavigation() {
    return (
        <AvatarStack.Navigator initialRouteName="AvatarCreation">
            <AvatarStack.Screen
                name="AvatarCreation"
                component={AvatarCreationScreen}
                options={{
                    headerShown: false,
                }}
            />

            <AvatarStack.Screen
                name="AvatarWaiting"
                component={AvatarWaitingCreationScreen}
                options={{
                    headerShown: false,
                }}
            />
        </AvatarStack.Navigator>
    );
}
