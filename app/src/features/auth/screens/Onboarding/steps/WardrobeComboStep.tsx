import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Title, Subheading, Button, useTheme } from 'react-native-paper';
import { useAppSelector } from '../../../../../utils/hooks';
import ConfettiCannon from 'react-native-confetti-cannon';
import type { OnboardingStepProps } from '../types';

export default function WardrobeComboStep({ onNext, onBack, currentStep, totalSteps }: OnboardingStepProps) {
    const { colors } = useTheme();
    const wardrobeCounts = useAppSelector((s) => s.onboarding.wardrobeCounts);
    const [comboCount, setComboCount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const finalCount = Math.max(
        0,
        (wardrobeCounts?.tops || 0) *
            (wardrobeCounts?.bottoms || 0) *
            (wardrobeCounts?.shoes || 0) *
            (wardrobeCounts?.outers || 0)
    );

    useEffect(() => {
        setComboCount(0);
        setShowConfetti(false);
        if (finalCount > 0) {
            let current = 0;
            const step = Math.max(1, Math.floor(finalCount / 40));
            const interval = setInterval(() => {
                current += step;
                if (current >= finalCount) {
                    setComboCount(finalCount);
                    setShowConfetti(true);
                    clearInterval(interval);
                } else {
                    setComboCount(current);
                }
            }, 18);
            return () => clearInterval(interval);
        }
    }, [finalCount]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
                <View style={styles.headerBlock}>
                    <Title style={styles.title}>Explorons ensemble</Title>
                    <Subheading style={styles.subtitle}>
                        toutes les possibilités de ta garde-robe !
                    </Subheading>
                </View>
                <View style={styles.comboBlock}>
                    <Title style={styles.comboCount}>
                        {comboCount.toLocaleString()}
                    </Title>
                    {showConfetti && (
                        <ConfettiCannon
                            count={80}
                            origin={{ x: 180, y: 0 }}
                            fadeOut
                            fallSpeed={2500}
                        />
                    )}
                </View>
            </ScrollView>
            <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContent}
                onPress={onNext}
                accessibilityLabel="Continuer"
            >
                Continuer
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    headerBlock: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    comboBlock: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 220,
    },
    comboCount: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#7E57C2',
        textAlign: 'center',
        marginVertical: 0,
        lineHeight: 90,
    },
    button: {
        marginTop: 32,
        alignSelf: 'center',
        width: 280,
        borderRadius: 24,
        marginBottom: 40,
    },
    buttonContent: {
        height: 52,
    },
}); 