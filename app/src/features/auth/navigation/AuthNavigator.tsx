import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// 1) Welcome & Wizard
import WelcomeScreen from '../screens/Welcome/Welcome';
import OnboardingWizard from '../screens/Onboarding/Onboarding';

// 2) SignIn flow
import { LogIn } from '../screens/SignIn/LogIn';
import ForgotPassword from '../screens/SignIn/ForgotPassword';
import { CodeVerification } from '../screens/SignIn/CodeVerification';
import ResetPassword from '../screens/SignIn/ResetPassword';

export type AuthStackParamList = {
    Welcome: undefined;
    Onboarding: undefined;
    SignIn: undefined;
    ForgotPassword: undefined;
    CodeVerification: { email: string };
    ResetPassword: { email: string; code: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* 1) Écran de bienvenue */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />

            {/* 2) Wizard Onboarding (Name → … → Success) */}
            <Stack.Screen name="Onboarding" component={OnboardingWizard} />

            {/* 3) Flow SignIn */}
            <Stack.Screen name="SignIn" component={LogIn} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen
                name="CodeVerification"
                component={CodeVerification}
            />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
    );
}
