import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { ButtonGroup, normalize } from '@rneui/themed';
import { lightTheme } from '../../styles/theme';

type ToggleButtonProps = {
    firstText?: string;
    secondText?: string;
    onPress?: (...args: any[]) => void;
    disabled?: boolean;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
    firstText = 'Ongoing',
    secondText = 'Completed',
    onPress = () => {},
    disabled = false,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const buttons = [firstText, secondText];

    const handlePress = (index: number) => {
        setSelectedIndex(index);
        onPress();
    };

    return (
        <View style={styles.container}>
            <ButtonGroup
                buttons={buttons}
                selectedIndex={selectedIndex}
                onPress={handlePress}
                containerStyle={styles.buttonGroupContainer}
                buttonStyle={styles.button}
                selectedButtonStyle={styles.selectedButton}
                selectedTextStyle={styles.selectedText}
                textStyle={styles.text}
                innerBorderStyle={styles.innerBorderStyle}
                disabled={disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: normalize(54),
    },
    buttonGroupContainer: {
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: lightTheme.colors.secondary_2,
        backgroundColor: lightTheme.colors.secondary_2,
        height: normalize(54),
        padding: normalize(8),
        width: '100%',
    },
    button: {
        backgroundColor: lightTheme.colors.secondary_2,
        borderRadius: normalize(5),
    },
    selectedButton: {
        backgroundColor: lightTheme.colors.white,
    },
    text: {
        fontSize: normalize(14),
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
        color: lightTheme.colors.lightGray,
    },
    selectedText: {
        color: lightTheme.colors.primary,
    },
    innerBorderStyle: {
        color: lightTheme.colors.secondary_2,
    },
});
