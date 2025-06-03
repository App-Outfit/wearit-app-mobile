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
import { Avatar } from 'react-native-paper';
import { AvatarCreationNavigation } from './AvatarNavigation';

export type AuthStackParamList = {
    Welcome: undefined;
    Onboarding: undefined;
    SignIn: undefined;
    ForgotPassword: undefined;
    CodeVerification: { email: string };
    ResetPassword: { email: string; code: string };
    AvatarCreation: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    const developerMode = true; // Set this to false in production
    const developerInitialRoute = 'Welcome';
    const initialRoute = developerMode ? developerInitialRoute : 'Welcome';

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
        >
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

            <Stack.Screen
                name="AvatarCreation"
                component={AvatarCreationNavigation}
            />
        </Stack.Navigator>
    );
}
