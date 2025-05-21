// BrandChoice.tsx
import * as React from 'react';
import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BrandIcons } from '../../assets/index';

export interface Option {
    key: string;
    label: string;
}

interface BrandChoiceProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

const BrandChoice: React.FC<BrandChoiceProps> = ({
    options,
    selected,
    onChange,
}) => {
    const { colors } = useTheme();

    const toggle = (key: string) => {
        onChange(
            selected.includes(key)
                ? selected.filter((k) => k !== key)
                : [...selected, key],
        );
    };

    return (
        <View style={styles.optionsContainer}>
            {options.map(({ key, label }) => {
                const IconAsset = BrandIcons[key];
                const isSelected = selected.includes(key);
                return (
                    <View key={key} style={styles.brandItem}>
                        <Pressable
                            onPress={() => toggle(key)}
                            style={[
                                styles.chip,
                                isSelected && { borderColor: colors.primary },
                            ]}
                        >
                            <Image
                                source={BrandIcons[key]}
                                style={[styles.chipImage]}
                            />
                        </Pressable>
                        <Text
                            style={[
                                styles.textStyle,
                                isSelected && { color: colors.primary },
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    brandItem: {
        width: '33.33%',
        alignItems: 'center',
        marginBottom: 16,
    },
    chip: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',

        overflow: 'hidden',
    },
    chipImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    textStyle: {
        marginTop: 4,
        fontSize: 14,
        textAlign: 'center',
        width: '90%',
    },
});

export default BrandChoice;
