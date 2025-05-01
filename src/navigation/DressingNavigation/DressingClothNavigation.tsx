import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DressingHomeScreen } from '../../screens/DressingScreen/DressingHomeScreen';
import { screenOptions } from '../../styles/screen';
import { DressingClothGaleryScreen } from '../../screens/DressingScreen/DressingClothsScreen';

const DressingClothStack = createStackNavigator();

export const DressingClothNavigator = () => {
    const main_options_screen =
        {
            headerShown: true,
            title: 'Dressing',
        } && screenOptions;

    return (
        <DressingClothStack.Navigator initialRouteName="DressingMainCLoth">
            <DressingClothStack.Screen
                name="DressingMainCLoth"
                component={DressingHomeScreen}
                options={main_options_screen}
            />
            <DressingClothStack.Screen
                name="DressingClothGalery"
                component={DressingClothGaleryScreen}
                options={main_options_screen}
            />
        </DressingClothStack.Navigator>
    );
};
