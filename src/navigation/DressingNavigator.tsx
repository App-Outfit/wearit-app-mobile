import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DressingHomeScreen } from '../screens/DressingScreen/DressingHomeScreen';
import { screenOptions } from '../styles/screen';

import {
    MaterialTopTabBarProps,
    createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import {
    View,
    Text,
    LayoutChangeEvent,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { lightTheme } from '../styles/theme';

type TabParamList = {
    Categories: undefined;
    Outfits: undefined;
};

// Here all screens refer to Auth Screens

const DressingStack = createStackNavigator();

export const DressingNavigator = () => {
    return (
        <DressingStack.Navigator initialRouteName="Dressing">
            <DressingStack.Screen
                name="Dressing"
                component={CategoryOutfitNavigator}
                options={
                    {
                        headerShown: true,
                        title: 'Dressing',
                    } && screenOptions
                }
            />
        </DressingStack.Navigator>
    );
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

export default function CategoryOutfitNavigator() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName="Categories"
            backBehavior="history"
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                // swipeEnable/d: false,
                tabBarPressColor: 'transparent',
                tabBarScrollEnabled: false,
                sceneStyle: {
                    backgroundColor: 'white',

                    borderTopColor: 'black',
                    borderWidth: 1,
                },
            }}
        >
            <Tab.Screen
                name="Categories"
                component={DressingHomeScreen}
                options={{
                    tabBarLabel: 'Catégories',
                    tabBarLabelStyle: { textAlign: 'center' },
                }}
            />
            <Tab.Screen
                name="Outfits"
                component={() => (
                    <View>
                        <Text>Hello outfit</Text>
                    </View>
                )}
                options={{
                    tabBarLabel: 'Outfits',
                    tabBarLabelStyle: { textAlign: 'center' },
                }}
            />
        </Tab.Navigator>
    );
}

function TabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
    const { colors } = useTheme();
    const [containerWidth, setContainerWidth] = React.useState(0);

    // largeur d'un onglet
    const tabWidth = containerWidth / state.routes.length;

    return (
        <View
            style={[styles.barContainer, { backgroundColor: '#f5eaff' }]}
            onLayout={(e: LayoutChangeEvent) =>
                setContainerWidth(e.nativeEvent.layout.width)
            }
        >
            {/* Pill actif */}
            {containerWidth > 0 && (
                <View
                    style={[
                        styles.activePill,
                        {
                            width: tabWidth - 8, // 8 = margin*2
                            left: state.index * tabWidth + 4, // 4 = margin left
                        },
                    ]}
                />
            )}

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel ?? options.title ?? route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.tabButton}
                        onPress={onPress}
                        activeOpacity={1}
                    >
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: isFocused
                                        ? colors.primary
                                        : '#999999',
                                },
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    barContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        margin: 16,
        height: 60,
        overflow: 'hidden',
        marginVertical: 15,
        paddingVertical: 15,
    },
    activePill: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 5,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    label: {
        fontWeight: '600',
    },
});
