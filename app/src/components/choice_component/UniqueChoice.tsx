// UniqueChoice.tsx
import * as React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Option } from './MultipleChoice';
import { baseColors } from '../../styles/theme';

interface UniqueChoiceProps {
    options: Option[];
    selected?: string;
    onChange: (key: string) => void;
}

const UniqueChoice: React.FC<UniqueChoiceProps> = ({
    options,
    selected,
    onChange,
}) => {
    return (
        <View style={styles.optionsContainer}>
            {options.map(({ key, label }) => {
                const isSelected = selected === key;
                return (
                    <Pressable
                        key={key}
                        onPress={() => onChange(key)}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isSelected
                                    ? baseColors.primary
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

export default UniqueChoice;
