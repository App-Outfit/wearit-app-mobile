import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Here all screens refer to Auth Screens
import { Onboarding } from '../screens/AuthScreen/Onboarding';
import { SignUp } from '../screens/AuthScreen/SignUp';
import { LogIn } from '../screens/AuthScreen/LogIn';

const AuthStack = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="LogIn"
                component={LogIn}
                options={{ headerShown: false }}
            />
        </AuthStack.Navigator>
    );
};
