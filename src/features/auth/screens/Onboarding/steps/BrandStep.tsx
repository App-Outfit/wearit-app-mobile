// src/features/auth/screens/Onboarding/steps/BrandStep.tsx
import * as React from 'react';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {
    ProgressBar,
    Title,
    Subheading,
    Button,
    useTheme,
} from 'react-native-paper';

import BrandChoice, {
    Option,
} from '../../../../../components/choice_component/BrandChoice';
import { BrandIcons } from '../../../../../assets/index';
import { useAppDispatch, useAppSelector } from '../../../../../utils/hooks';
import { setBrands } from '../../../slices/onboardingSlice';
import type { OnboardingStepProps } from '../types';

// 1) Reconstruire dynamiquement la liste des options depuis BrandIcons
const options: Option[] = Object.keys(BrandIcons).map((key) => ({
    key,
    label: key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export default function BrandStep({
    onNext,
    onBack,
    currentStep = 7,
    totalSteps = 9,
}: OnboardingStepProps) {
    const onboardBrands = useAppSelector((s) => s.onboarding.brands ?? []);
    const [selected, setSelected] = useState<string[]>(onboardBrands);
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    const progress = currentStep / totalSteps;

    const handlePress = () => {
        dispatch(setBrands(selected));
        onNext();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    indicatorStyle="black"
                >
                    {/* Progression */}
                    <ProgressBar
                        progress={progress}
                        color={colors.primary}
                        style={styles.progressBar}
                    />

                    <View style={styles.content}>
                        <Title style={styles.title}>
                            Choisis les marques qui te correspondent
                        </Title>
                        <Subheading style={styles.subtitle}>
                            Cela nous permet d'en savoir plus sur toi
                        </Subheading>

                        <View style={styles.brandChoiceBox}>
                            <BrandChoice
                                options={options}
                                selected={selected}
                                onChange={setSelected}
                            />
                        </View>

                        <View>
                            <Button
                                mode="contained"
                                disabled={selected.length === 0}
                                onPress={handlePress}
                                contentStyle={styles.buttonContent}
                                style={[styles.button]}
                            >
                                Suivant
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={onBack}
                                contentStyle={styles.buttonContent}
                                style={[styles.button, styles.buttonMargin]}
                            >
                                Retour
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    progressBar: {
        height: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    brandChoiceBox: {
        width: '100%',
        marginBottom: 24,
    },
    button: {
        borderRadius: 24,
        width: '80%',
        marginInline: 'auto',
        marginTop: 20,
        marginBottom: 8,
    },
    buttonMargin: {
        marginBottom: 50,
    },
    buttonContent: {
        height: 48,
    },
});
