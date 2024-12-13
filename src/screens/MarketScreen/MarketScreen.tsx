import React from 'react';
import { View, Text } from 'react-native';

export const MarketScreen = () => {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text
                onPress={() => alert('This is the "Market" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}
            >
                Market Screen
            </Text>
        </View>
    );
};
