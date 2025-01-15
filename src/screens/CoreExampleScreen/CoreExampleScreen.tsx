import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header, BodyText } from '../../components/core/Typography';
import { CButton } from '../../components/core/Buttons';
import { ToggleButton } from '../../components/core/Toggle';
import ValidationCard from '../../components/core/ValidationCard';

export const CoreExampleScreen: React.FC = () => {
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(true);
    };
    const buttonFunction = () => {
        Alert.alert('Button was pressed!');
        setVisible(!visible);
    };

    return (
        <ScrollView>
            <TypographyExample />
            <ButtonExample />
            <ToggleBtnExample />
            <CButton variant="primary" onPress={toggleOverlay}>
                Validation Card toggle
            </CButton>
            <ValidationCard
                title="fecilitations"
                message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure amet tenetur ea aut reprehenderit saepe, quia molestiae."
                buttonTitle="L'Essayer Maintenant"
                buttonFunction={buttonFunction}
                visible={visible}
                toggleOverlay={toggleOverlay}
            />
        </ScrollView>
    );
};

const ToggleBtnExample: React.FC = () => {
    return (
        <View style={styles.container}>
            <ToggleButton firstText="Ongoing" secondText="Completed" />
        </View>
    );
};

const TypographyExample: React.FC = () => {
    return (
        <View style={styles.container}>
            <Header variant="h1">Header 1 </Header>
            <Header variant="h2">Header 2</Header>
            <Header variant="h3">Header 3</Header>
            <Header variant="h4">Header 4</Header>

            <BodyText variant="large">This is body text (large)</BodyText>
            <BodyText variant="medium">This is body text (medium)</BodyText>
            <BodyText variant="small">This is body text (small)</BodyText>
        </View>
    );
};

const ButtonExample: React.FC = () => {
    return (
        <View style={styles.container}>
            <CButton
                variant="primary"
                onPress={() => console.log('Primary button pressed')}
            >
                Primary Button
            </CButton>
            <CButton
                variant="secondary"
                onPress={() => console.log('Secondary button pressed')}
            >
                Secondary Button
            </CButton>

            <CButton
                variant="danger"
                onPress={() => console.log('Danger button pressed')}
            >
                Danger Button
            </CButton>

            <CButton
                variant="secondary"
                disabled={true}
                onPress={() => console.log('Danger button pressed')}
            >
                Disabled Button
            </CButton>

            <CButton
                variant="primary"
                size="small"
                onPress={() => console.log('Danger button pressed')}
            >
                Small Btn
            </CButton>

            <CButton
                variant="primary"
                size="medium"
                onPress={() => console.log('Danger button pressed')}
            >
                Medium Btn
            </CButton>

            <CButton
                variant="primary"
                size="large"
                onPress={() => console.log('Danger button pressed')}
            >
                Large Btn
            </CButton>

            <CButton
                variant="primary"
                size="xlarge"
                onPress={() => console.log('Danger button pressed')}
            >
                Btn Whole width
            </CButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 16,
        height: '100%',
    },
});
