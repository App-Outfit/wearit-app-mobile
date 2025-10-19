import * as React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';

import { lightTheme } from '../../../styles/theme';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { deleteClothing } from '../../clothing/clothingThunks';
import { useNavigation } from '@react-navigation/native';
import { setUpper, setLower, setDress } from '../../vto/tryonSlice';
import { selectTryonByClothID } from '../../vto/tryonSelectors';
import { createTryon } from '../../vto/tryonThunks';
import { selectCurrentBody } from '../../body/bodySelectors';
import { selectUserCredits } from '../../profil/selectors/userSelectors';
import Toast from 'react-native-toast-message';

export const ClothItem = ({ source, clothingItem }: any) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const [showModal, setShowModal] = React.useState(false);
    
    // Récupérer le try-on associé à ce vêtement
    const associatedTryon = useAppSelector(selectTryonByClothID(clothingItem?.id));
    const currentBody = useAppSelector(selectCurrentBody);
    const credits = useAppSelector(selectUserCredits);
    
    const tryCloth = async () => {
        if (!clothingItem) return;
        
        // Si un try-on existe déjà et est prêt, le sélectionner et naviguer
        if (associatedTryon && associatedTryon.status === 'ready') {
            // Sélectionner le try-on selon le type de vêtement
            if (clothingItem.cloth_type === 'dress') {
                dispatch(setDress(associatedTryon));
            } else if (clothingItem.cloth_type === 'upper') {
                dispatch(setUpper(associatedTryon));
            } else if (clothingItem.cloth_type === 'lower') {
                dispatch(setLower(associatedTryon));
            }
            
            // Naviguer vers Virtual Try-On
            navigation.navigate('VirtualTryOn');
        } else if (!associatedTryon) {
            // Si aucun try-on n'existe, proposer d'en créer un
            Alert.alert(
                'Essayer ce vêtement',
                'Voulez-vous créer un essayage virtuel ? Cette opération coûte 1 crédit.',
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Essayer',
                        onPress: async () => {
                            if (!currentBody) {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Vous devez d\'abord ajouter un mannequin',
                                    position: 'bottom',
                                });
                                return;
                            }
                            
                            if (credits && credits <= 0) {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Crédits insuffisants',
                                    position: 'bottom',
                                });
                                navigation.navigate('Profile');
                                return;
                            }
                            
                            try {
                                await dispatch(createTryon({
                                    body_id: currentBody.id,
                                    clothing_id: clothingItem.id,
                                })).unwrap();
                                
                                Toast.show({
                                    type: 'info',
                                    text1: 'Try-on en cours de création',
                                    position: 'bottom',
                                });
                                
                                // Naviguer vers Virtual Try-On
                                navigation.navigate('VirtualTryOn');
                            } catch (error) {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur lors de la création du try-on',
                                    position: 'bottom',
                                });
                            }
                        },
                    },
                ]
            );
        } else if (associatedTryon.status === 'pending') {
            Toast.show({
                type: 'info',
                text1: 'Try-on en cours de création',
                position: 'bottom',
            });
            navigation.navigate('VirtualTryOn');
        }
    };
    
    const removeCloth = () => {
        if (!clothingItem) return;
        
        Alert.alert(
            'Supprimer le vêtement',
            'Êtes-vous sûr de vouloir supprimer ce vêtement ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    onPress: () => dispatch(deleteClothing(clothingItem.id)),
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <View style={styleImage.boxImage}>
            <Image source={source} style={styleImage.img} />
            <TouchableOpacity onPress={tryCloth} style={styleImage.textBox}>
                <Text style={styleImage.text}>Essayer</Text>
            </TouchableOpacity>

            {/*Remove btn */}
            <TouchableOpacity
                onPress={removeCloth}
                style={styleImage.removeBtnBox}
            >
                <FontAwesome name="trash-o" size={20} color={'black'} />
            </TouchableOpacity>
        </View>
    );
};

const styleImage = StyleSheet.create({
    boxImage: {
        width: 160,
        height: 210,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 25,
    },
    img: {
        width: 160,
        height: 210,
        resizeMode: 'cover',
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0px 0px 8px -3px #00000040',
    },
    textBox: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    text: {
        textAlign: 'left',
        color: lightTheme.colors.primary,
        fontFamily: 'Poppins',
        fontWeight: 700,
    },
    removeBtnBox: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
});
