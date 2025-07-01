import * as React from 'react';
import { Button } from 'react-native-elements';
import {
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';

import { styles } from './Buttons.styles';
import Entypo from 'react-native-vector-icons/Entypo';
import { IconButton } from 'react-native-paper';
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
    // Determine the style based on the variant
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

    const containerStyle = StyleSheet.flatten([
        styles.center,
        size === 'small' && styles.smallButton,
        size === 'medium' && styles.mediumButton,
        size === 'large' && styles.largeButton,
        size === 'xlarge' && styles.xlargeButton,
    ]);

    return (
        <Button
            title={children}
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            buttonStyle={buttonStyle}
            // containerStyle={containerStyle}
            titleStyle={titleStyle}
            disabled={disabled}
            disabledStyle={styles.disabledButton}
            disabledTitleStyle={styles.disabledTitle}
        />
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
        <IconButton
            style={styles2.addButton}
            icon="plus"
            iconColor="white"
            size={28}
            onPress={onPressFunction}
        />
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
