import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { CoreExampleScreen } from '../screens/CoreExampleScreen/CoreExampleScreen';
import BottomTabNavigator from '../components/core/BottomTabNavigator'; // Import Bottom Tab Navigator

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
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Core"
                    component={BottomTabNavigator}
                    options={{ headerShown: false, title: 'Core' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
