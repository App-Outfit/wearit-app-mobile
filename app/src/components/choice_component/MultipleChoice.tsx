// MultiChoice.tsx
import * as React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';

export interface Option {
    key: string;
    label: string;
}

interface MultiChoiceProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

const MultiChoice: React.FC<MultiChoiceProps> = ({
    options,
    selected,
    onChange,
}) => {
    const toggle = (key: string) => {
        if (selected.includes(key)) {
            onChange(selected.filter((k) => k !== key));
        } else {
            onChange([...selected, key]);
        }
    };

    return (
        <View style={styles.optionsContainer}>
            {options.map(({ key, label }) => {
                const isSelected = selected.includes(key);
                return (
                    <Pressable
                        key={key}
                        onPress={() => toggle(key)}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isSelected
                                    ? colors.primary
                                    : '#E0E0E0',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.textStyle,
                                { color: isSelected ? '#ffffff' : '#757575' },
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 0.9,
    },
    chip: {
        marginBottom: 20,
        height: 60,
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 0,
    },
    textStyle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        textAlign: 'left',
    },
});

export default MultiChoice;
