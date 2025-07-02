import * as React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { baseColors, spacing, typography } from '../../styles/theme';
import { CButton } from '../core/Buttons';

export function ModalChoice({
    open,
    onCancel,
    onAccept,
    textHeader,
    textSubHeader,
    textButtonConfirm,
    textButtonCancel,
}) {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={open}
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.textInfoBox}>
                                <Text style={styles.textInfoHeader}>
                                    {textHeader}
                                </Text>
                                <Text style={styles.textInfoSubHeader}>
                                    {textSubHeader}
                                </Text>
                            </View>

                            <View style={styles.simpleButtonBox}>
                                <CButton
                                    variant="secondary"
                                    size="small"
                                    onPress={onCancel}
                                    style={{ marginRight: spacing.small }}
                                >
                                    {textButtonCancel}
                                </CButton>

                                <CButton
                                    variant="primary"
                                    size="small"
                                    onPress={onAccept}
                                    style={{ marginLeft: spacing.small }}
                                >
                                    {textButtonConfirm}
                                </CButton>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
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
    simpleButtonBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
