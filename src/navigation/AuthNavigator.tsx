import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Here all screens refer to Auth Screens
import { Onboarding } from '../screens/SignUpScreen/Onboarding';
import { SignUp } from '../screens/SignUpScreen/SignUp';

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
        </AuthStack.Navigator>
    );
};
