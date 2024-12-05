import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import TypographyExampleScreen from '../screens/CoreExampleScreen/TypographyExampleScreen';

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
                    name="Typo"
                    component={TypographyExampleScreen}
                    options={{ headerShown: true, title: 'Typo' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
