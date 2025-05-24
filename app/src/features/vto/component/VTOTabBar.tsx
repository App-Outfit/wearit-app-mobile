import * as React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    LayoutChangeEvent,
} from 'react-native';
import { useTheme } from 'react-native-paper';

export function VTOTabBar({ state, descriptors, navigation }: any) {
    const { colors } = useTheme();
    const [containerWidth, setContainerWidth] = React.useState<number>(0);

    // largeur d'un onglet
    const tabWidth = containerWidth / state.routes.length;

    const onLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    return (
        <View style={styles.barContainer} onLayout={onLayout}>
            {/* pill sous l'onglet actif */}
            {containerWidth > 0 && (
                <View
                    style={[
                        styles.activePill,
                        {
                            width: tabWidth,
                            left: tabWidth * state.index,
                            backgroundColor: colors.primary,
                        },
                    ]}
                />
            )}

            {state.routes.map((route: any, index: number) => {
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
                                isFocused
                                    ? {
                                          color: colors.primary,
                                          fontFamily: 'Poppins-Bold',
                                          fontSize: 15,
                                      }
                                    : {
                                          color: '#999999',
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'relative',
    },
    tabButton: {
        alignItems: 'center',
        paddingVertical: 8,
        marginHorizontal: 15,
    },
    label: {
        margin: 0,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    activePill: {
        position: 'absolute',
        height: 0,
        width: 0,
    },
});
