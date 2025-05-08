import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenOptions } from '../../../styles/screen';
import { VTODressingScreen } from '../screen/VTOHomeScreen';
import { VTOTabBar } from '../component/VTOTabBar';
import { lightTheme } from '../../../styles/theme';

const VtoTab = createMaterialTopTabNavigator();

export default function VTOTopTabNavigator() {
    return (
        <VtoTab.Navigator
            initialRouteName="VTODressingScreen"
            backBehavior="history"
            tabBar={(props) => <VTOTabBar {...props} />}
            screenOptions={{
                tabBarScrollEnabled: false,
                sceneStyle: {
                    backgroundColor: 'white',
                    paddingHorizontal: 16,
                },
            }}
        >
            <VtoTab.Screen
                name="VTOrecommandation"
                component={VTODressingScreen}
                options={{
                    tabBarLabel: 'Pour Vous',
                }}
            />
            <VtoTab.Screen
                name="VTODressingScreen"
                component={VTODressingScreen}
                options={{
                    tabBarLabel: 'Dressing',
                }}
            />
            <VtoTab.Screen
                name="VTOMarketPlace"
                component={VTODressingScreen}
                options={{
                    tabBarLabel: 'Market Place',
                }}
            />
        </VtoTab.Navigator>
    );
}
