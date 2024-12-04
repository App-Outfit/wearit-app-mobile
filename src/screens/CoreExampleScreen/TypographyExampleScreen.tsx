import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, BodyText } from '../../components/core/Typography';

const TypographyExampleScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Header variant="h1">Salut </Header>
            <Header variant="h2">Header 2</Header>
            <Header variant="h3">Header 3</Header>
            <Header variant="h4">Header 4</Header>

            <BodyText variant="large">This is body text (large)</BodyText>
            <BodyText variant="medium">This is body text (medium)</BodyText>
            <BodyText variant="small">This is body text (small)</BodyText>
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

export default TypographyExampleScreen;
