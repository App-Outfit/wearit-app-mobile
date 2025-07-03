import * as React from 'react';
import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { baseColors, lightTheme, typography } from '../../styles/theme';

type ToggleButtonProps = {
    firstText?: string;
    secondText?: string;
    onPress?: (index: number) => void;
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
        if (disabled) return;
        setSelectedIndex(index);
        onPress(index);
    };

    return (
        <View style={styles.container}>
            {buttons.map((text, index) => {
                const isSelected = selectedIndex === index;
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.button,
                            isSelected && styles.selectedButton,
                            disabled && styles.disabledButton,
                        ]}
                        onPress={() => handlePress(index)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                styles.text,
                                isSelected && styles.selectedText,
                            ]}
                        >
                            {text}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 54,
        backgroundColor: baseColors.secondary_2,
        borderRadius: 10,
        padding: 4,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 46,
        borderRadius: 6,
        backgroundColor: baseColors.secondary_2,
    },
    selectedButton: {
        backgroundColor: baseColors.white,
    },
    disabledButton: {
        opacity: 0.5,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: typography.poppins.semiBold,
        color: baseColors.lightGray,
    },
    selectedText: {
        color: baseColors.primary,
    },
});
