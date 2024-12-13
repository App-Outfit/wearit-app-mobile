import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Ionicons,
    FontAwesome6,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import { lightTheme } from '../../styles/theme';
import { HomeScreen } from '../../screens/HomeScreen/HomeScreen';
import { CoreExampleScreen } from '../../screens/CoreExampleScreen/CoreExampleScreen';
import { MarketScreen } from '../../screens/MarketScreen/MarketScreen';
import { ProfileScreen } from '../../screens/ProfileScreen/ProfileScreen';
import { DressingScreen } from '../../screens/DressingScreen/DressingScreen';
import { VirtualScreen } from '../../screens/VirtualScreen/VirtualScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
    <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'HomeScreen') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Core') {
                    iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'Marketplace') {
                    iconName = focused ? 'storefront' : 'storefront-outline';
                } else if (route.name === 'Virtual Try On') {
                    iconName = focused
                        ? 'person-half-dress'
                        : 'person-half-dress';
                    return (
                        <FontAwesome6
                            name={iconName as any}
                            size={size}
                            color={color}
                        />
                    );
                } else if (route.name === 'Dressing') {
                    iconName = focused ? 'dresser' : 'dresser-outline';
                    return (
                        <MaterialCommunityIcons
                            name={iconName as any}
                            size={size}
                            color={color}
                        />
                    );
                } else if (route.name === 'Profile') {
                    iconName = focused
                        ? 'account-circle'
                        : 'account-circle-outline';
                    return (
                        <MaterialCommunityIcons
                            name={iconName as any}
                            size={size}
                            color={color}
                        />
                    );
                }
                return (
                    <Ionicons
                        name={iconName as any}
                        size={size}
                        color={color}
                    />
                );
            },
            tabBarActiveTintColor: lightTheme.colors.primary,
            tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="Marketplace" component={MarketScreen} />
        <Tab.Screen name="Virtual Try On" component={VirtualScreen} />
        <Tab.Screen name="Dressing" component={DressingScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

export default BottomTabNavigator;
