import { lightTheme, normalize } from '../../styles/theme';
import { StyleSheet, TextStyle } from 'react-native';

export const styles = StyleSheet.create({
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
