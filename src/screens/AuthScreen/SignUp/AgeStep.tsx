// AgeStep.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Text,
} from 'react-native';
import {
    ProgressBar,
    Title,
    Subheading,
    Button,
    useTheme,
} from 'react-native-paper';

interface AgeStepProps {
    navigation: any;
    currentStep?: number;
    totalSteps?: number;
}

import { useAppDispatch } from '../../../utils/hooks';
import { setAge } from '../../../store/onboardingSlice';

const ageRanges = ['-18', '18‑24', '25‑34', '35‑44', '45‑54', '55‑64', '65+'];

const ITEM_HEIGHT = 50; // hauteur de chaque item
const VISIBLE_ITEMS = 5; // nombre d'items visibles (dont le selected)
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const AgeStep: React.FC<AgeStepProps> = ({
    navigation,
    currentStep = 3,
    totalSteps = 9,
}) => {
    const [ageRange, setAgeRange] = useState<string>('18‑24');
    const { colors } = useTheme();
    const wheelRef = useRef<FlatList<string>>(null);
    const progress = currentStep / totalSteps;
    const dispatch = useAppDispatch();

    // Au montage, on scroll vers la valeur par défaut sans animation
    useEffect(() => {
        const idx = ageRanges.indexOf(ageRange);
        setTimeout(() => {
            wheelRef.current?.scrollToOffset({
                offset: idx * ITEM_HEIGHT,
                animated: false,
            });
        }, 0);
    }, []);

    const onMomentumScrollEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        const y = e.nativeEvent.contentOffset.y;
        const idx = Math.round(y / ITEM_HEIGHT);
        const clamped = Math.min(Math.max(idx, 0), ageRanges.length - 1);
        setAgeRange(ageRanges[clamped]);
        // on recentre pile sur l'item
        wheelRef.current?.scrollToOffset({
            offset: clamped * ITEM_HEIGHT,
            animated: true,
        });
    };

    const handlePress = () => {
        dispatch(setAge(ageRange));
        navigation.navigate('Question1Step', { ageRange });
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => {
        const selected = item === ageRange;
        return (
            <View style={styles.itemContainer}>
                <Text
                    style={[
                        styles.itemText,
                        selected
                            ? {
                                  color: 'black',
                                  fontFamily: 'Poppins-SemiBold',
                                  fontSize: 24,
                              }
                            : {
                                  color: '#AAA',
                                  fontFamily: 'Poppins-Regular',
                                  fontSize: 20,
                              },
                    ]}
                >
                    {item}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ProgressBar
                progress={progress}
                color={colors.primary}
                style={styles.progressBar}
            />

            <View style={styles.content}>
                <View>
                    <Title style={styles.title}>
                        Sélectionne ta tranche d’âge
                    </Title>
                    <Subheading style={styles.subtitle}>
                        Cela nous permet d'en savoir plus sur toi
                    </Subheading>
                </View>

                <View style={styles.wheelWrapper}>
                    <FlatList
                        ref={wheelRef}
                        data={ageRanges}
                        keyExtractor={(i) => i}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={ITEM_HEIGHT}
                        decelerationRate="fast"
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        getItemLayout={(_, index) => ({
                            length: ITEM_HEIGHT,
                            offset: ITEM_HEIGHT * index,
                            index,
                        })}
                        contentContainerStyle={{
                            paddingVertical: (WHEEL_HEIGHT - ITEM_HEIGHT) / 2,
                        }}
                    />

                    {/* Lignes de délimitation */}
                    <View
                        style={[
                            styles.wheelLine,
                            {
                                top: (WHEEL_HEIGHT - ITEM_HEIGHT) / 2,
                                backgroundColor: '#e2e2e2',
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.wheelLine,
                            {
                                top: (WHEEL_HEIGHT + ITEM_HEIGHT) / 2,
                                backgroundColor: '#e2e2e2',
                            },
                        ]}
                    />
                </View>

                <Button
                    mode="contained"
                    disabled={!ageRange}
                    onPress={handlePress}
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                >
                    Suivant
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    progressBar: {
        height: 10,
        marginTop: 20,
        marginBottom: 50,
        borderRadius: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 24,
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    wheelWrapper: {
        height: WHEEL_HEIGHT,
        overflow: 'hidden',
        transform: [{ translateY: -30 }],
    },
    wheelLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        // taille et couleur sont définies dynamiquement selon sélection
    },
    button: {
        borderRadius: 24,
        width: '80%',
        alignSelf: 'center',
    },
    buttonContent: {
        height: 48,
    },
});

export default AgeStep;
