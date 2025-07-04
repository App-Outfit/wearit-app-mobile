import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { CoreExampleScreen } from '../screens/CoreExampleScreen/CoreExampleScreen';

import AuthNavigator from '../features/auth/navigation/AuthNavigator';
import { DressingNavigator } from '../features/dressing/navigation/DressingNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { loadToken } from '../features/auth/slices/authSlice';
import { AvatarCreationNavigation } from '../features/auth/navigation/AvatarNavigation';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const developerMode = true; // Set this to false in production
    const developerInitialRoute = 'Auth';
    // const [initialRoute, setInitialRoute] = React.useState<string>(developerInitialRoute)
    const initialRoute = developerMode ? developerInitialRoute : 'Auth';

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'LaunchScreen'}>
                <Stack.Screen
                    name="LaunchScreen"
                    component={LoadingScreen}
                    options={{ headerShown: false }}
                    initialParams={{ initialRoute }}
                />

                <Stack.Screen
                    name="Core"
                    component={CoreExampleScreen}
                    options={{ headerShown: true, title: 'Core' }}
                />

                <Stack.Screen
                    name="MainTabs"
                    component={MainTabNavigator}
                    options={{ headerShown: false }}
                />

                {/* AuthNavigator is a stack navigator that contains all the auth screens */}
                <Stack.Screen
                    name="Auth"
                    component={AuthNavigator}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="AvatarCreation"
                    component={AvatarCreationNavigation}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}
