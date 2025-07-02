// MainTabNavigator.tsx
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { VTONavigator } from '../features/vto/navigation/VTOMainNavigation';
import { ProfilNavigator } from '../features/profil/navigation/ProfilNavigator';
import { ExplorerScreen } from '../features/explorer/screens/ExplorerScreen';
import { lightTheme } from '../styles/theme';

export type MainTabParamList = {
    Explorer: undefined;
    VirtualTryOn: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => (
    <Tab.Navigator
        initialRouteName="VirtualTryOn"
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                height: 75,
                backgroundColor: '#F7F7FF',
                borderTopColor: '#E0E0E0',
                borderTopWidth: 1,
            },
            tabBarActiveTintColor: lightTheme.colors.primary,
            tabBarInactiveTintColor: '#757575',
            tabBarIcon: ({ color, size, focused }) => {
                size = focused ? 25 : 23;

                if (route.name === 'Explorer') {
                    return <Feather name="image" size={size} color={color} />;
                } else if (route.name === 'VirtualTryOn') {
                    return (
                        <FontAwesome6
                            name="person-booth"
                            size={size}
                            color={color}
                        />
                    );
                } else if (route.name === 'Profile') {
                    return (
                        <MaterialCommunityIcons
                            name="account-outline"
                            size={size}
                            color={color}
                        />
                    );
                }
                return null;
            },
        })}
    >
        <Tab.Screen
            name="Explorer"
            component={ExplorerScreen}
            options={{ tabBarLabel: 'Explorer' }}
        />
        <Tab.Screen
            name="VirtualTryOn"
            component={VTONavigator}
            options={{ tabBarLabel: 'Try On' }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfilNavigator}
            options={{ tabBarLabel: 'Profil' }}
        />
    </Tab.Navigator>
);

export default MainTabNavigator;
