import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Here all screens refer to Auth Screens
import { Onboarding } from '../screens/AuthScreen/Onboarding';
import { SignUp } from '../screens/AuthScreen/SignUp';
import { LogIn } from '../screens/AuthScreen/LogIn';
import { ForgotPassword } from '../screens/AuthScreen/ForgotPassword';
import { ResetPassword } from '../screens/AuthScreen/ResetPassword';
import NameStep from '../screens/AuthScreen/SignUp/Name';
import GenderStep from '../screens/AuthScreen/SignUp/GenderStep';
import AgeStep from '../screens/AuthScreen/SignUp/AgeStep';
import Question1Step from '../screens/AuthScreen/SignUp/Question1Step';
import Question2Step from '../screens/AuthScreen/SignUp/Question2Step';
import Question3Step from '../screens/AuthScreen/SignUp/Question3Step';
import MailStep from '../screens/AuthScreen/SignUp/MailStep';
import BrandStep from '../screens/AuthScreen/SignUp/Brand Step';

const AuthStack = createStackNavigator();

const name_page = {
    0: 'Onboarding',
    1: 'NameStep',
};

export const AuthNavigator = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="NameStep"
                component={NameStep}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="GenderStep"
                component={GenderStep}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="AgeStep"
                component={AgeStep}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="Question1Step"
                component={Question1Step}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="Question2Step"
                component={Question2Step}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="Question3Step"
                component={Question3Step}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="BrandStep"
                component={BrandStep}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="MailStep"
                component={MailStep}
                options={{ headerShown: false }}
            />
        </AuthStack.Navigator>
    );
};
