// BrandStep.tsx
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
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
} from '../../../components/choice_component/BrandChoice';
import { BrandIcons } from '../../../assets/index';

import { useAppDispatch } from '../../../utils/hooks';
import { setBrands } from '../../../store/onboardingSlice';

// Dynamically build options from BrandIcons keys
const options: Option[] = Object.keys(BrandIcons).map((key) => ({
    key,
    label: key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

interface BrandStepProps {
    navigation: any;
    currentStep?: number;
    totalSteps?: number;
}

const BrandStep: React.FC<BrandStepProps> = ({
    navigation,
    currentStep = 7,
    totalSteps = 9,
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const { colors } = useTheme();
    const progress = currentStep / totalSteps;
    const dispatch = useAppDispatch();

    const handleNext = () => {
        dispatch(setBrands(selected));
        navigation.navigate('MailStep', { answers: selected });
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
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    indicatorStyle="black"
                >
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

                        <Button
                            mode="contained"
                            disabled={selected.length === 0}
                            onPress={handleNext}
                            contentStyle={styles.buttonContent}
                            style={styles.button}
                        >
                            Suivant
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    scroll: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    progressBar: {
        height: 10,
        marginVertical: 20,
        borderRadius: 5,
    },
    content: {
        flex: 1,
        alignItems: 'center',
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
        marginBottom: 40,
        marginTop: 20,
    },
    button: {
        borderRadius: 24,
        width: '80%',
    },
    buttonContent: {
        height: 48,
    },
});

export default BrandStep;
