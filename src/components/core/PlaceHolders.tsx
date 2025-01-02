import React, { useState, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { Input, normalize } from 'react-native-elements';
import { lightTheme } from '../../styles/theme';
import { circleCheckIcon, circleErrorIcon } from '../../assets';

type InputFieldProps = {
    placeholder: string; // Votre prop obligatoire
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    isValid?: boolean | undefined;
    iconRight?: React.JSX.Element;
} & React.ComponentProps<typeof Input>;

export const InputField = forwardRef<any, InputFieldProps>(
    (
        {
            placeholder,
            value = '',
            onChangeText = () => {},
            secureTextEntry = false,
            disabled = false,
            errorMessage = '',
            isValid = undefined,
            iconRight = undefined,
            ...rest
        },
        ref,
    ) => {
        const [current_value, setCurrentValue] = useState(value);
        const [isFocused, setIsFocused] = useState(false);

        const handleOnChangeText = (text: string) => {
            setCurrentValue(text);
            onChangeText(text);
        };

        return (
            <Input
                ref={ref}
                placeholder={placeholder}
                value={current_value}
                onChangeText={handleOnChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={secureTextEntry}
                disabled={disabled}
                errorMessage={errorMessage}
                rightIcon={
                    isValid === true
                        ? circleCheckIcon
                        : isValid === false
                          ? circleErrorIcon
                          : iconRight
                }
                containerStyle={[
                    styles.container,
                    isValid === false && { marginBottom: normalize(30) },
                ]}
                inputStyle={[
                    styles.inputText,
                    current_value.length !== 0
                        ? styles.inputValue
                        : StyleSheet.create({}),
                ]}
                inputContainerStyle={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    isValid === false && styles.errorContainer,
                    isValid === true && styles.validContainer,
                ]}
                errorStyle={isValid === false && styles.errorMessage}
                {...rest}
            />
        );
    },
);

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: '100%',
        height: normalize(52),
        marginVertical: normalize(0),
        marginHorizontal: normalize(0),
        paddingHorizontal: normalize(0),
        paddingVertical: normalize(0),
        marginBottom: normalize(16),
    },
    inputContainer: {
        height: normalize(52),
        borderRadius: normalize(10),
        borderStyle: 'solid',
        borderColor: '#e6e6e6',
        borderWidth: 1,
        // paddingRight: 20,
        marginBottom: 0,
    },
    inputContainerFocused: {
        borderColor: lightTheme.colors.primary,
    },
    inputText: {
        fontSize: normalize(15),
        color: 'black',
        fontFamily: 'Poppins-Regular',
        margin: 'auto',
        marginHorizontal: normalize(14),
    },
    inputValue: {
        fontSize: normalize(16),
        fontFamily: 'Poppins-SemiBold',
    },
    errorContainer: {
        borderColor: lightTheme.colors.error,
    },
    errorMessage: {
        color: lightTheme.colors.error,
        fontFamily: 'Poppins-Regular',
        fontSize: normalize(14),
    },
    validContainer: {
        borderColor: lightTheme.colors.primary,
    },
});
