import React from 'react';
import { View, Text } from 'react-native';

export const VirtualScreen = () => {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text
                onPress={() => alert('This is the "Profile" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}
            >
                Virtual Screen
            </Text>
        </View>
    );
};
