import React from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, TextStyle } from 'react-native';

import { styles } from './Buttons.styles';

type ButtonProps = {
    children: string;
    onPress: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    onLongPress?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    style?: TextStyle;
};

export const CButton: React.FC<ButtonProps> = ({
    children,
    onPress,
    onLongPress = () => {},
    onPressIn = () => {},
    onPressOut = () => {},
    variant = 'primary',
    size = 'large',
    disabled = false,
    style,
}) => {
    // Determine the style based on the variant
    const buttonStyle = StyleSheet.flatten([
        styles.baseButton,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton,
        size === 'small' && styles.smallButton,
        size === 'medium' && styles.mediumButton,
        size === 'large' && styles.largeButton,
        size === 'xlarge' && styles.xlargeButton,
        disabled && styles.disabledButton,
        style,
    ]);

    const titleStyle = StyleSheet.flatten([
        styles.baseTitle,
        variant === 'primary' && styles.primaryTitle,
        variant === 'secondary' && styles.secondaryTitle,
        variant === 'danger' && styles.dangerTitle,
        disabled && styles.disabledTitle,
    ]);

    return (
        <Button
            title={children}
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            buttonStyle={buttonStyle}
            titleStyle={titleStyle}
            disabled={disabled}
            disabledStyle={styles.disabledButton}
            disabledTitleStyle={styles.disabledTitle}
        />
    );
};
