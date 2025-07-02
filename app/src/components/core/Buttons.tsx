import * as React from 'react';
import {
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';

import { styles } from './Buttons.styles';
import Entypo from 'react-native-vector-icons/Entypo';
import { baseColors, lightTheme, spacing } from '../../styles/theme';

import Feather from 'react-native-vector-icons/Feather';

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
    const buttonStyle = StyleSheet.flatten([
        styles.baseButton,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton,
        styles.center,
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
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
            style={buttonStyle}
        >
            <Text style={titleStyle}>{children}</Text>
        </TouchableOpacity>
    );
};

export const AddCircleButton: React.FC<{ onPress: () => void }> = ({
    onPress,
}) => (
    <TouchableOpacity style={styles2.addCircleButton} onPress={onPress}>
        <Entypo name="plus" size={24} color="#fff" />
    </TouchableOpacity>
);

export const AddButton = ({ onPressFunction }: any) => {
    return (
        <TouchableOpacity style={styles2.addButton} onPress={onPressFunction}>
            <Feather name="plus" size={28} color="white" />
        </TouchableOpacity>
    );
};

const styles2 = StyleSheet.create({
    addCircleButton: {
        width: 26,
        height: 26,
        borderRadius: 24,
        backgroundColor: '#C839B8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: lightTheme.colors.primary,
        width: 50,
        height: 50,
        borderRadius: 8,
    },
});

// ---- ADD BUTTON CIRCLE TEXT --- //
export const AddButtonText = ({ onPress, text }) => {
    return (
        <TouchableOpacity
            key={0}
            onPress={onPress}
            style={styleAddButtonText.addButton}
        >
            <View style={styleAddButtonText.addButtonCircle}>
                <Feather name="plus" color={baseColors.white} size={23} />
            </View>
            <Text style={styleAddButtonText.addButtonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styleAddButtonText = StyleSheet.create({
    addButton: {
        width: 90,
        height: 70,
        backgroundColor: baseColors.white,
        marginBottom: spacing.medium,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonCircle: {
        width: 30,
        height: 30,
        backgroundColor: baseColors.primary,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 11,
        textAlign: 'center',
        margin: 0,
        marginTop: 5,
    },
});
