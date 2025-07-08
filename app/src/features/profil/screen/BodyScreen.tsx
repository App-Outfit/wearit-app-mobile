import * as React from 'react';

import { View, Text, Image, StyleSheet } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { spacing, typography } from '../../../styles/theme';
import { CButton } from '../../../components/core/Buttons';
import { ModalWarning } from '../../../components/core/Modal';
import { deleteBody } from '../../body/bodyThunks';

export function BodyScreen({ navigation }) {
    const body = useAppSelector((state) => state.body.currentBody);
    const [modal, setModal] = React.useState(false);

    const dispatch = useAppDispatch();

    const removeBody = () => {
        if (!body) return;
        dispatch(deleteBody(body.id));
    };

    if (!body) {
        return (
            <View style={styles.bodyScreenCenter}>
                <Text style={styles.text}>
                    Vous n'avez pas de Mannequin
                </Text>
                <CButton
                    size="large"
                    onPress={() => {
                        navigation.push('AvatarCreation');
                    }}
                >
                    Ajouter un Mannequin
                </CButton>
            </View>
        );
    }

    return (
        <>
            <View style={styles.bodyScreen}>
                <View style={styles.imageBox}>
                    <Image src={body.image_url} style={styles.imageBody} />
                </View>

                <CButton
                    onPress={() => {
                        setModal(true);
                    }}
                    size="large"
                >
                    Supprimer
                </CButton>
            </View>

            <ModalWarning
                open={modal}
                textHeader="Supprimer le Mannequin"
                textSubHeader="Êtes-vous sûr de vouloir supprimer votre mannequin ?"
                onCancel={() => setModal(false)}
                onAccept={removeBody}
                textButtonConfirm="Supprimer"
                textButtonCancel="Annuler"
            />
        </>
    );
}

const styles = StyleSheet.create({
    bodyScreen: {
        flex: 1,
        padding: spacing.large,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bodyScreenCenter: {
        flex: 1,
        padding: spacing.large,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: typography.poppins.semiBold,
        fontSize: 16,
        marginBottom: spacing.large,
    },
    imageBox: {
        flex: 1,
        width: '100%',
    },
    imageBody: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 10,
    },
});
