import React from 'react';
import { View, Text } from 'react-native';

export const DressingScreen = () => {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text
                onPress={() => alert('This is the "Profile" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}
            >
                Dressing Screen
            </Text>
        </View>
    );
};
