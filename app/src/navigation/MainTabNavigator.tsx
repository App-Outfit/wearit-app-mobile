// MainTabNavigator.tsx
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import {
    BottomNavigation,
    Provider as PaperProvider,
    TouchableRipple,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { View, Text } from 'react-native';

// Import your screens
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { baseColors, lightTheme } from '../styles/theme';
import { VTONavigator } from '../features/vto/navigation/VTOMainNavigation';
import { ProfilNavigator } from '../features/profil/navigation/ProfilNavigator';

import Feather from 'react-native-vector-icons/Feather';
import { ExplorerScreen } from '../features/explorer/screens/ExplorerScreen';

export type MainTabParamList = {
    Home: undefined;
    Explorer: undefined;
    Marketplace: undefined;
    VirtualTryOn: undefined;
    Dressing: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => (
    <PaperProvider>
        <Tab.Navigator
            initialRouteName="VirtualTryOn"
            screenOptions={{
                headerShown: false,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    activeColor="#7E57C2"
                    inactiveColor="#757575"
                    style={{
                        height: 75,
                        backgroundColor: '#f7f7ff',
                    }}
                    shifting={false}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!event.defaultPrevented) {
                            navigation.dispatch(
                                CommonActions.navigate(
                                    route.name,
                                    route.params,
                                ),
                            );
                        } else {
                            preventDefault();
                        }
                    }}
                    renderIcon={({ route, focused }) => {
                        const { options } = descriptors[route.key];
                        const size = focused ? 25 : 23;
                        const color = focused
                            ? lightTheme.colors.primary
                            : '#f7f7ff7';

                        return (
                            options.tabBarIcon?.({ focused, color, size }) ??
                            null
                        );
                    }}
                    getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];
                        return typeof options.tabBarLabel === 'string'
                            ? options.tabBarLabel
                            : typeof options.title === 'string'
                              ? options.title
                              : route.name;
                    }}
                    theme={{
                        colors: {
                            secondaryContainer: 'transparent',
                        },
                    }}
                />
            )}
        >
            {/* <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Accueil',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="home-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="Explorer"
                component={ExplorerScreen}
                options={{
                    tabBarLabel: 'Explorer',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="image" color={color} size={size} />
                    ),
                }}
            />
            {/* <Tab.Screen
                name="Marketplace"
                component={RandomComponent}
                options={{
                    tabBarLabel: 'Marketplace',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="storefront-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="VirtualTryOn"
                component={VTONavigator}
                options={{
                    tabBarLabel: 'Try On',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6
                            name="person-booth"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            {/* <Tab.Screen
                name="Dressing"
                component={DressingNavigator}
                options={{
                    tabBarLabel: 'Dressing',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="wardrobe-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="Profile"
                component={ProfilNavigator}
                options={{
                    tabBarLabel: 'Profil',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="account-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    </PaperProvider>
);

const RandomComponent = () => {
    return (
        <View>
            <Text>Hello</Text>
        </View>
    );
};

export default MainTabNavigator;
