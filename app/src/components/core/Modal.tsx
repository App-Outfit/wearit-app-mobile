import * as React from 'react';

import { Modal, Portal } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import { baseColors, spacing, typography } from '../../styles/theme';
import { CButton } from '../core/Buttons';

import AntDesign from 'react-native-vector-icons/AntDesign';

export function ModalWarning({
    open,
    onCancel,
    textHeader,
    textSubHeader,
    textButtonConfirm,
    textButtonCancel,
}) {
    const handleDeconnect = () => {
        //Deconnexion service
        //Navigate to Login Page
    };

    return (
        <Portal>
            <Modal
                visible={open}
                onDismiss={onCancel}
                contentContainerStyle={styles.modalContentContainer}
                theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
            >
                <View style={styles.modalContent}>
                    <View style={styles.iconWarningBox}>
                        <View style={styles.iconWarning}>
                            <AntDesign
                                name="exclamation"
                                color={baseColors.warning}
                                size={50}
                            />
                        </View>
                    </View>

                    <View style={styles.textInfoBox}>
                        <Text style={styles.textInfoHeader}>{textHeader}</Text>
                        <Text style={styles.textInfoSubHeader}>
                            {textSubHeader}
                        </Text>
                    </View>

                    <View style={styles.buttonBox}>
                        <CButton
                            variant="danger"
                            size="xlarge"
                            onPress={handleDeconnect}
                        >
                            {textButtonConfirm}
                        </CButton>
                        <CButton
                            variant="secondary"
                            size="xlarge"
                            onPress={onCancel}
                        >
                            {textButtonCancel}
                        </CButton>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContentContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',

        borderBlockColor: '#000',
        borderWidth: 1,
    },
    modalContent: {
        width: '90%',
        backgroundColor: baseColors.white,
        borderRadius: 8,
        paddingHorizontal: spacing.medium,
        paddingVertical: spacing.large,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconWarningBox: {
        marginBottom: spacing.medium,
    },
    iconWarning: {
        width: 70,
        height: 70,
        borderColor: baseColors.warning,
        borderWidth: 5,
        borderRadius: '50%',
        backgroundColor: '#fbcfe1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInfoBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.medium,
    },
    textInfoHeader: {
        textAlign: 'center',
        fontFamily: typography.poppins.semiBold,
        fontSize: 20,
        color: baseColors.black,
    },
    textInfoSubHeader: {
        textAlign: 'center',
        fontFamily: typography.poppins.semiBold,
        fontSize: 16,
        color: baseColors.gray_5,
    },
    buttonBox: {},
});
