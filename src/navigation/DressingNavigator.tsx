import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DressingHomeScreen } from '../screens/DressingScreen/DressingHomeScreen';
import { screenOptions } from '../styles/screen';

// Here all screens refer to Auth Screens

const DressingStack = createStackNavigator();

export const DressingNavigator = () => {
    return (
        <DressingStack.Navigator initialRouteName="Dressing">
            <DressingStack.Screen
                name="Dressing"
                component={DressingHomeScreen}
                options={
                    {
                        headerShown: true,
                        title: 'Dressing',
                    } && screenOptions
                }
            />
        </DressingStack.Navigator>
    );
};
