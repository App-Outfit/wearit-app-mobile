import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { screenOptions } from '../../../styles/screen';
import VTOTopTabNavigator from './VTOTabNavigator';
import { VTODressingScreen } from '../screen/VTOHomeScreen';

const VTOStack = createStackNavigator();

export function VTONavigator() {
    return (
        <VTOStack.Navigator initialRouteName="VTOHome">
            <VTOStack.Screen
                name="VTOHome"
                component={VTODressingScreen}
                options={{
                    ...screenOptions,
                    headerShown: true,
                    title: 'Virtual Try On',
                }}
            />
        </VTOStack.Navigator>
    );
}
