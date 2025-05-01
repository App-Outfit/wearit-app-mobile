import * as React from 'react';
import { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface OTPInputProps {
    length?: number;
    onCodeFilled?: (code: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onCodeFilled }) => {
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const inputsRef = useRef<Array<TextInput | null>>([]);

    const handleChange = (text: string, index: number) => {
        const newCode = [...code];
        if (text === '') {
            // Clear current
            newCode[index] = '';
            setCode(newCode);
            return;
        }
        if (/^\d$/.test(text)) {
            newCode[index] = text;
            setCode(newCode);
            // Move to next
            if (index < length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
            // If last, notify
            if (index === length - 1) {
                onCodeFilled?.(newCode.join(''));
            }
        }
    };

    const handleKeyPress = (
        e: { nativeEvent: { key: string } },
        index: number,
    ) => {
        if (e.nativeEvent.key === 'Backspace') {
            const newCode = [...code];
            if (newCode[index] !== '') {
                // Delete current digit
                newCode[index] = '';
                setCode(newCode);
            } else if (index > 0) {
                // Move focus to previous
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    return (
        <View style={styles.container}>
            {code.map((digit, idx) => (
                <TextInput
                    key={idx}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(t) => handleChange(t, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    ref={(ref) => (inputsRef.current[idx] = ref)}
                    autoFocus={idx === 0}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 5,
        textAlign: 'center',
        fontSize: 24,
    },
});

export default OTPInput;
