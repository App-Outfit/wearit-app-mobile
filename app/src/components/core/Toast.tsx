// src/components/ToastAlert.tsx
import * as React from 'react';
import { StyleSheet } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import { baseColors, spacing, typography } from '../../styles/theme';

export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            text1Style={styles.text1}
            renderLeadingIcon={() => (
                <Feather
                    name="check"
                    size={23}
                    color="#fff"
                    style={styles.icon}
                />
            )}
            trailingIcon={null}
        />
    ),
};

export function ToastAlert() {
    return (
        <Toast
            config={toastConfig}
            position="bottom"
            visibilityTime={3000}
            bottomOffset={10}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: baseColors.success,
        borderLeftWidth: 0,
        borderRadius: 6,
        marginHorizontal: spacing.medium,
        padding: spacing.medium,

        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    text1: {
        color: '#fff',
        fontSize: 14,
        fontFamily: typography.poppins.regular,
    },
});
