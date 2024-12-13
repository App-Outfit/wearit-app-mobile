import React from 'react';
import { View, Text } from 'react-native';

export const ProfileScreen = () => {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text
                onPress={() => alert('This is the "Profile" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}
            >
                Profile Screen
            </Text>
        </View>
    );
};
