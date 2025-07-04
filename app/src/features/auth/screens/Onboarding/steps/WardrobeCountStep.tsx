import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Chip } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setWardrobeCounts } from '../../../slices/onboardingSlice';
import { StepLayout } from '../StepLayout';
import type { OnboardingStepProps } from '../types';

const ranges = [
    { label: '5-10', value: 7 },
    { label: '10-20', value: 15 },
    { label: '20-40', value: 30 },
    { label: '>50', value: 60 },
];

function QuickRangeChoice({ label, icon, value, onChange }: { label: string; icon: string; value: number | null; onChange: (v: number) => void }) {
    const { colors } = useTheme();
    return (
        <View style={styles.catBlock}>
            <View style={styles.catHeader}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.choices}>
                {ranges.map((r) => {
                    const selected = value === r.value;
                    return (
                        <Chip
                            key={r.label}
                            selected={selected}
                            onPress={() => onChange(r.value)}
                            style={[
                                styles.chip,
                                selected && styles.chipSelected,
                            ]}
                            textStyle={[
                                styles.chipText,
                                selected && styles.chipTextSelected,
                            ]}
                        >
                            {r.label}
                        </Chip>
                    );
                })}
            </View>
        </View>
    );
}

export default function WardrobeCountStep({ onNext, onBack, currentStep, totalSteps }: OnboardingStepProps) {
    const dispatch = useAppDispatch();
    const stored = useAppSelector((s) => s.onboarding.wardrobeCounts ?? { tops: 0, bottoms: 0, shoes: 0, outers: 0 });
    const [tops, setTops] = useState<number | null>(stored.tops || null);
    const [bottoms, setBottoms] = useState<number | null>(stored.bottoms || null);
    const [shoes, setShoes] = useState<number | null>(stored.shoes || null);
    const [outers, setOuters] = useState<number | null>(stored.outers || null);
    const progress = (currentStep ?? 1) / (totalSteps ?? 1);

    const isValid = [tops, bottoms, shoes, outers].every((v) => typeof v === 'number' && v > 0);

    const handleNext = () => {
        dispatch(setWardrobeCounts({
            tops: tops || 0,
            bottoms: bottoms || 0,
            shoes: shoes || 0,
            outers: outers || 0,
        }));
        onNext && onNext();
    };

    return (
        <StepLayout
            title="Combien as-tu de vêtements dans ta garde-robe ?"
            subtitle="Estimation rapide par catégorie"
            progress={progress}
            onNext={handleNext}
            onBack={onBack}
            disableNext={!isValid}
        >
            <View style={styles.inputsBox}>
                <QuickRangeChoice label="Hauts" icon="👕" value={tops} onChange={setTops} />
                <QuickRangeChoice label="Bas" icon="👖" value={bottoms} onChange={setBottoms} />
                <QuickRangeChoice label="Chaussures" icon="👟" value={shoes} onChange={setShoes} />
                <QuickRangeChoice label="Vestes/Manteaux" icon="🧥" value={outers} onChange={setOuters} />
            </View>
        </StepLayout>
    );
}

const styles = StyleSheet.create({
    inputsBox: {
        flex: 1,
        justifyContent: 'center',
    },
    catBlock: {
        marginBottom: 22,
    },
    catHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    icon: {
        fontSize: 30,
        marginRight: 10,
        width: 36,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },
    choices: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        gap: 6,
        marginBottom: 2,
    },
    chip: {
        borderRadius: 18,
        marginRight: 6,
        marginBottom: 0,
        borderColor: '#eee',
        borderWidth: 1,
        backgroundColor: '#f6f6fa',
        minWidth: 54,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        shadowColor: 'transparent',
        transform: [{ scale: 1 }],
    },
    chipSelected: {
        backgroundColor: '#7E57C2',
        borderColor: '#7E57C2',
        shadowColor: '#7E57C2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        transform: [{ scale: 1.08 }],
    },
    chipText: {
        color: '#7E57C2',
        fontWeight: '500',
        fontSize: 15,
    },
    chipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
}); 