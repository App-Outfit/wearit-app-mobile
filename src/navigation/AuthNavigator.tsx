import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Here all screens refer to Auth Screens
import { Onboarding } from '../screens/SignUpScreen/Onboarding';

const AuthStack = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false, title: 'Sign Up' }}
            />
        </AuthStack.Navigator>
    );
};
