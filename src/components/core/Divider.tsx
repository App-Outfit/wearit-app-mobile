import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightTheme } from '../../styles/theme';

interface DividerTextProps {
    text: string;
}

export const DividerText: React.FC<DividerTextProps> = ({ text }) => {
    return (
        <View style={styles.orContainer}>
            <View style={styles.orDivider} />
            <Text style={styles.orText}>{text}</Text>
            <View style={styles.orDivider} />
        </View>
    );
};

const styles = StyleSheet.create({
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 20,
    },
    orDivider: {
        flex: 1,
        height: 1,
        backgroundColor: lightTheme.colors.lightGray_3,
    },
    orText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: lightTheme.colors.gray_4,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
});
