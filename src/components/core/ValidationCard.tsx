import React, { FC, useState } from 'react';
import { Button, Overlay } from '@rneui/themed';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CButton } from './Buttons';
import { BodyText, Header } from './Typography';
import { lightTheme } from '../../styles/theme';

interface CardProps {
    title: string;
    message: string;
    buttonTitle: string;
    buttonFunction: () => void;
    visible: boolean;
    toggleOverlay: () => void;
}

const ValidationCard: FC<CardProps> = ({
    title,
    message,
    buttonTitle,
    buttonFunction,
    visible,
    toggleOverlay,
}) => {
    return (
        <View>
            <Overlay
                isVisible={visible}
                overlayStyle={{
                    borderBottomLeftRadius: 20,
                    borderTopLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    borderTopRightRadius: 20,
                }}
                onBackdropPress={toggleOverlay}
            >
                <View style={styles.container}>
                    <Icon
                        name={'check-circle-outline'}
                        size={54}
                        color={lightTheme.colors.primary}
                        style={styles.icon}
                    />
                    <Header style={styles.header} variant="h3">
                        {title}
                    </Header>
                    <BodyText style={styles.text} variant="large">
                        {message}
                    </BodyText>
                    <CButton
                        variant="primary"
                        size="large"
                        onPress={buttonFunction}
                    >
                        {buttonTitle}
                    </CButton>
                </View>
            </Overlay>
        </View>
    );
};

export default ValidationCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    header: {
        paddingTop: 14,
        paddingBottom: 14,
    },
    text: {
        paddingBottom: 8,
        paddingHorizontal: 12,
        color: lightTheme.colors.gray_4,
        textAlign: 'center',
    },
    icon: {
        paddingTop: 14,
    },
});
