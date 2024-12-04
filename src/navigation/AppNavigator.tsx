import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
<<<<<<< HEAD
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen'; 
import { HomeScreen } from '../screens/HomeScreen/HomeScreen'; 
=======
import { LoadingScreen } from '../screens/LoadingScreen'; // Your launch screen
import { HomeScreen } from '../screens/HomeScreen'; // Your main screen after the launch
>>>>>>> develop

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
