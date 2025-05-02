// src/features/auth/screens/Onboarding/steps/AgeStep.tsx
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
    View,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Text,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setAge } from '../../../slices/onboardingSlice';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

const ageRanges = ['-18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function AgeStep({
    onNext,
    onBack,
    currentStep,
    totalSteps,
}: OnboardingStepProps) {
    const onboardAge = useAppSelector((s) => s.onboarding.age ?? '18-24');
    const [ageRange, setAgeRange] = useState(onboardAge);
    const dispatch = useAppDispatch();
    const wheelRef = useRef<FlatList<string>>(null);
    const { colors } = useTheme();
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    // centrer la roue
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
        wheelRef.current?.scrollToOffset({
            offset: clamped * ITEM_HEIGHT,
            animated: true,
        });
    };

    const handlePress = () => {
        dispatch(setAge(ageRange));
        onNext!();
    };

    return (
        <StepLayout
            title="Sélectionne ta tranche d’âge"
            subtitle="Cela nous permet d'en savoir plus sur toi"
            progress={progress}
            onNext={handlePress}
            onBack={onBack}
            disableNext={!ageRange}
        >
            <View
                style={{
                    height: WHEEL_HEIGHT,
                    overflow: 'hidden',
                    transform: [{ translateY: -30 }],
                }}
            >
                <FlatList
                    ref={wheelRef}
                    data={ageRanges}
                    keyExtractor={(i) => i}
                    renderItem={({ item }) => {
                        const selected = item === ageRange;
                        return (
                            <View
                                style={{
                                    height: ITEM_HEIGHT,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: selected ? 'black' : '#AAA',
                                        fontFamily: selected
                                            ? 'Poppins-SemiBold'
                                            : 'Poppins-Regular',
                                        fontSize: selected ? 24 : 20,
                                    }}
                                >
                                    {item}
                                </Text>
                            </View>
                        );
                    }}
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
                {/* lignes délimitation */}
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: 1,
                        top: (WHEEL_HEIGHT - ITEM_HEIGHT) / 2,
                        backgroundColor: '#e2e2e2',
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: 1,
                        top: (WHEEL_HEIGHT + ITEM_HEIGHT) / 2,
                        backgroundColor: '#e2e2e2',
                    }}
                />
            </View>
        </StepLayout>
    );
}
