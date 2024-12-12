import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { CoreExampleScreen } from '../screens/CoreExampleScreen/CoreExampleScreen';

import { AuthNavigator } from './AuthNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LaunchScreen">
                <Stack.Screen
                    name="LaunchScreen"
                    component={LoadingScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{ headerShown: true, title: 'Home' }}
                />

                <Stack.Screen
                    name="Core"
                    component={CoreExampleScreen}
                    options={{ headerShown: true, title: 'Core' }}
                />

                {/* AuthNavigator is a stack navigator that contains all the auth screens */}
                <Stack.Screen
                    name="Auth"
                    component={AuthNavigator}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
