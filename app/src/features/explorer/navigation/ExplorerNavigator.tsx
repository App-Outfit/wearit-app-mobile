import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ExplorerScreen } from '../screens/ExplorerScreen';

export type ExplorerParamList = {
    ExplorerHome: undefined;
};

const Stack = createStackNavigator<ExplorerParamList>();

export const ExplorerNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="ExplorerHome"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="ExplorerHome"
                component={ExplorerScreen}
            />
        </Stack.Navigator>
    );
}; 