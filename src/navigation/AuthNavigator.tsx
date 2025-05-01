import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Here all screens refer to Auth Screens
import { Onboarding } from '../screens/AuthScreen/Onboarding';
import { SignUp } from '../screens/AuthScreen/SignUp';
import { LogIn } from '../screens/AuthScreen/SignIn/LogIn';
import ForgotPassword from '../screens/AuthScreen/SignIn/ForgotPassword';
import { ResetPassword } from '../screens/AuthScreen/SignIn/ResetPassword';
import NameStep from '../screens/AuthScreen/SignUp/Name';
import GenderStep from '../screens/AuthScreen/SignUp/GenderStep';
import AgeStep from '../screens/AuthScreen/SignUp/AgeStep';
import Question1Step from '../screens/AuthScreen/SignUp/Question1Step';
import Question2Step from '../screens/AuthScreen/SignUp/Question2Step';
import Question3Step from '../screens/AuthScreen/SignUp/Question3Step';
import MailStep from '../screens/AuthScreen/SignUp/MailStep';
import BrandStep from '../screens/AuthScreen/SignUp/Brand Step';
import SuccessStep from '../screens/AuthScreen/SignUp/SuccessStep';
import { CodeVerification } from '../screens/AuthScreen/SignIn/CodeVerification';

const AuthStack = createStackNavigator();
const SignInStack = createStackNavigator();
const SignUpStack = createStackNavigator();

const name_page = {
    0: 'Onboarding',
    1: 'NameStep',
};

export const AuthNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName="Onboarding">
            <AuthStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="SignUp"
                component={SignUpNavigator}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="SignIn"
                component={SignInNavigator}
                options={{ headerShown: false }}
            />
        </AuthStack.Navigator>
    );
};

export const SignUpNavigator = () => {
    return (
        <SignUpStack.Navigator initialRouteName="NameStep">
            <SignUpStack.Screen
                name="NameStep"
                component={NameStep}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="GenderStep"
                component={GenderStep}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="AgeStep"
                component={AgeStep}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="Question1Step"
                component={Question1Step}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="Question2Step"
                component={Question2Step}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="Question3Step"
                component={Question3Step}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="BrandStep"
                component={BrandStep}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="MailStep"
                component={MailStep}
                options={{ headerShown: false }}
            />

            <SignUpStack.Screen
                name="SuccessStep"
                component={SuccessStep}
                options={{ headerShown: false }}
            />
        </SignUpStack.Navigator>
    );
};

export const SignInNavigator = () => {
    return (
        <SignInStack.Navigator initialRouteName="LogIn">
            <SignInStack.Screen
                name="LogIn"
                component={LogIn}
                options={{ headerShown: false }}
            />

            <SignInStack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerTitle: '' }}
            />

            <SignInStack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{ headerTitle: '' }}
            />

            <SignInStack.Screen
                name="CodeVerification"
                component={CodeVerification}
                options={{ headerTitle: '' }}
            />
        </SignInStack.Navigator>
    );
};
