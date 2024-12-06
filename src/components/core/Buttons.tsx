import React from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, TextStyle } from 'react-native';
import { lightTheme, normalize } from '../../styles/theme';

type ButtonProps = {
    children: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    style?: TextStyle;
};

export const CButton: React.FC<ButtonProps> = ({
    children,
    onPress,
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
            buttonStyle={buttonStyle}
            titleStyle={titleStyle}
            disabled={disabled}
            disabledStyle={styles.disabledButton}
            disabledTitleStyle={styles.disabledTitle}
        />
    );
};

const styles = StyleSheet.create({
    // Base styles
    baseButton: {
        borderRadius: normalize(10),
        paddingVertical: normalize(16),
        paddingHorizontal: normalize(8),
        height: normalize(54),
        overflow: 'hidden',
        gap: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    baseTitle: {
        fontSize: normalize(16),
        fontWeight: '600',
        fontFamily: 'Poppins-Medium',
        margin: 'auto',
    },

    // Variant: Primary
    primaryButton: {
        backgroundColor: lightTheme.colors.primary,
    },
    primaryTitle: {
        color: '#ffffff',
    },

    // Variant: Secondary
    secondaryButton: {
        backgroundColor: lightTheme.colors.white,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: lightTheme.colors.primary,
    },
    secondaryTitle: {
        color: lightTheme.colors.primary,
    },

    // Variant: Danger
    dangerButton: {
        backgroundColor: '#e74c3c',
    },
    dangerTitle: {
        color: '#ffffff',
    },

    // Disabled state
    disabledButton: {
        backgroundColor: lightTheme.colors.lightGray_2,
        borderWidth: 0,
    },
    disabledTitle: {
        color: lightTheme.colors.white,
    },

    // Variant small
    smallButton: {
        width: normalize(100),
    },

    // Variant medium
    mediumButton: {
        width: normalize(150),
    },

    // Variant large
    largeButton: {
        width: normalize(200),
    },

    // Variant xlarge
    xlargeButton: {
        width: '100%',
    },
});
