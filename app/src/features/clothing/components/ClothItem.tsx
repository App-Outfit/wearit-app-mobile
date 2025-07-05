import * as React from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { baseColors, spacing } from '../../../styles/theme';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectTryonByClothID } from '../../vto/tryonSelectors';
import { ClothingItem } from '../clothingTypes';
import { TryonCreatePayload, TryonItem } from '../../vto/tryonTypes';
import { setDress, setLower, setUpper, removeTryonsByClothingId } from '../../vto/tryonSlice';
import { ModalChoice, ModalWarning } from '../../../components/core/Modal';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { createTryon } from '../../vto/tryonThunks';
import { selectCurrentBody } from '../../body/bodySelectors';
import { BodyItem } from '../../body/bodyTypes';
import { selectUserCredits } from '../../profil/selectors/userSelectors';
import { deleteClothing } from '../clothingThunks';
import { fetchClothes } from '../clothingThunks';

import Toast from 'react-native-toast-message';
import { fetchCredits } from '../../profil/thunks/userThunks';
import Feather from 'react-native-vector-icons/Feather';

export const ClothItem = React.memo(function ClothItem({
    navigation,
    cloth,
    associatedTryon,
}: any) {
    const [status, setStatus] = React.useState<
        'loading' | 'success' | 'undefined'
    >('undefined');
    const [modal, setModal] = React.useState(false);
    const [isDeleteMode, setIsDeleteMode] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const credits = useAppSelector(selectUserCredits);

    const dispatch = useAppDispatch();
    // const associatedTryon: TryonItem | null = useAppSelector(
    //     selectTryonByClothID(cloth.id),
    // );
    const body: BodyItem | null = useAppSelector(selectCurrentBody);

    React.useEffect(() => {
        if (!associatedTryon) {
            setStatus('undefined');
        } else if (associatedTryon.status === 'pending') {
            setStatus('loading');
        } else if (associatedTryon.status === 'ready') {
            setStatus('success');
        }
    }, [associatedTryon?.status]);

    const onPress = (cloth: ClothingItem) => {
        if (isDeleteMode) return; // Ne pas déclencher l'action normale en mode suppression
        
        if (status === 'success' && associatedTryon) {
            if (cloth.cloth_type === 'dress') {
                dispatch(setDress(associatedTryon));
            } else if (cloth.cloth_type === 'upper') {
                dispatch(setUpper(associatedTryon));
            } else {
                dispatch(setLower(associatedTryon));
            }
        } else if (status === 'undefined') {
            setModal(true);
        }
    };

    const onLongPress = () => {
        setIsDeleteMode(true);
        // Auto-désactiver le mode suppression après 3 secondes
        setTimeout(() => {
            setIsDeleteMode(false);
        }, 3000);
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        
        setIsDeleting(true);
        try {
            await dispatch(deleteClothing(cloth.id)).unwrap();
            Toast.show({
                type: 'success',
                text1: 'Vêtement supprimé',
                position: 'bottom',
            });
            // Rafraîchir la liste des vêtements
            dispatch(fetchClothes());
            dispatch(removeTryonsByClothingId(cloth.id));
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erreur lors de la suppression',
                position: 'bottom',
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteMode(false);
        }
    };

    const verifyCredits = () => {
        if (credits && credits <= 0) {
            navigation.navigate('ProfilSubscription');
        } else {
            getTryon();
        }

    };

    const getTryon = async () => {
        if (status != 'undefined') return null;

        try {
            await dispatch(
                createTryon({ body_id: body!.id, clothing_id: cloth.id }),
            );

            Toast.show({
                type: 'info',
                text1: "Try on en cours d'excution",
                position: 'bottom',
            });

            setStatus('loading');
            dispatch(fetchCredits());
        } catch (errorMessage) {
            Toast.show({
                type: 'error',
                text1: 'Erreur lors de la création du try on',
                position: 'bottom',
            });

            setStatus('undefined');
        }

        setModal(false);
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => onPress(cloth)}
                onLongPress={onLongPress}
                style={[
                    styleClothing.imgBox,
                    isDeleteMode && styleClothing.imgBoxDeleteMode
                ]}
                disabled={isDeleting}
            >
                <Image
                    source={{ uri: cloth.image_url }}
                    style={[
                        styleClothing.img,
                        isDeleteMode && styleClothing.imgDeleteMode
                    ]}
                />

                {/* Indicateur de statut */}
                <View
                    style={[
                        styleClothing.status,
                        {
                            backgroundColor:
                                status === 'loading'
                                    ? baseColors.yellow
                                    : status === 'success'
                                      ? baseColors.success
                                      : baseColors.primary,
                        },
                    ]}
                ></View>

                {/* Bouton de suppression */}
                {isDeleteMode && (
                    <TouchableOpacity
                        style={styleClothing.deleteButton}
                        onPress={handleDelete}
                        disabled={isDeleting}
                    >
                        <Feather 
                            name="x" 
                            size={16} 
                            color="white" 
                        />
                    </TouchableOpacity>
                )}

                {/* Overlay de suppression */}
                {isDeleteMode && (
                    <View style={styleClothing.deleteOverlay}>
                        <Text style={styleClothing.deleteText}>
                            {isDeleting ? 'Suppression...' : 'Appuyez sur X pour supprimer'}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <ModalChoice
                open={modal}
                onCancel={() => setModal(false)}
                onAccept={verifyCredits}
                textHeader="Essayer un vêtement"
                textSubHeader="Cette opération vous coutera X crédits."
                textButtonConfirm="Essayer"
                textButtonCancel="Annuler"
            />
        </>
    );
});

const styleClothing = StyleSheet.create({
    imgBox: {
        minWidth: 90,
        width: 90,
        height: 140,
        marginBottom: spacing.medium,
        position: 'relative',
        borderRadius: spacing.small,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
        overflow: 'hidden',
    },
    imgBoxDeleteMode: {
        borderWidth: 2,
        borderColor: baseColors.error,
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imgDeleteMode: {
        opacity: 0.7,
    },
    status: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 10,
        height: 10,
        borderRadius: '50%',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: baseColors.error,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    deleteOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    deleteText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingHorizontal: 5,
    },
});
