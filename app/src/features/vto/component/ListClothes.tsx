import * as React from 'react';
import { Text, StyleSheet, FlatList, Dimensions } from 'react-native';

import { ImportChoice } from '../../../components/choice_component/ImportChoice';
import { ModalAddClothInfo } from '../component/ModalAddClothInfo';
import { baseColors, spacing, typography } from '../../../styles/theme';

import { AddButtonText } from '../../../components/core/Buttons';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectAllClothes } from '../../clothing/clothingSelectors';
import { fetchClothes, uploadClothing } from '../../clothing/clothingThunks';
import {
    ClothingItem,
    ClothingUploadPayload,
} from '../../clothing/clothingTypes';
import { fetchTryons, fetchTryonsByBodyId } from '../tryonThunks';
import { selectAllTryons, selectTryonByClothID } from '../tryonSelectors';
import { ClothItem } from '../../clothing/components/ClothItem';
import { useTryonSSE } from '../hooks/useTryonSSE';
import { DrawerToggleButton } from '../../../components/core/DrawerToggleButton';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { selectCurrentBody } from '../../body/bodySelectors';
import { fetchCurrentBody } from '../../body/bodyThunks';

export function MiniDressing({ setDrawerCloth, drawerCloth }) {
    // Navigation
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [newPictureUri, setNewPictureUri] = React.useState<string | null>(
        null,
    );
    const [importModalOpen, setImportModalOpen] = React.useState(false);
    const [infoModalOpen, setInfoModalOpen] = React.useState(false);
    const openModalAddCloth = () => {
        setImportModalOpen(true);
    };

    const current_body = useAppSelector(selectCurrentBody);
    const userCloth = useAppSelector(selectAllClothes);
    const allTryons = useAppSelector(selectAllTryons);
    const allCloths = userCloth;

    const screenWidth = Dimensions.get('window').width;

    useTryonSSE();

    React.useEffect(() => {
        dispatch(fetchClothes());
        dispatch(fetchCurrentBody());
    }, [dispatch]);

    React.useEffect(() => {
        if (current_body) {
            dispatch(fetchTryonsByBodyId(current_body.id));
        }
    }, [current_body, dispatch]);

    const handleImagePicked = async (uri) => {
        setImportModalOpen(false);
        if (uri) {
            setNewPictureUri(uri);
            setInfoModalOpen(true);
        }
    };

    const createF = (uri: string): FormData => {
        const uriParts = uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop() || 'jpeg';

        const formData = new FormData();

        formData.append('file', {
            uri,
            name: fileName,
            type: `image/${fileType}`,
        } as any);

        return formData;
    };

    const handleSaveNewCloth = async ({ cloth_type, category, cloth_id }) => {
        if (!newPictureUri) return null;

        try {
            const formData = createF(newPictureUri);
            const payload: ClothingUploadPayload = {
                category,
                cloth_type,
                name: cloth_id,
                file: formData,
            };

            const action = await dispatch(uploadClothing(payload)).then(
                (result) => {
                    if (uploadClothing.fulfilled.match(result)) {
                        Toast.show({
                            type: 'success',
                            text1: 'Vêtement ajouté avec succès !',
                            position: 'bottom',
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: "Erreur lors de l'ajout du vêtement.",
                            position: 'bottom',
                        });
                    }
                },
            );
        } catch (error) {
            console.error('ERROR UPLOAD CLOTHING :', error);
        }

        setNewPictureUri(null);
        setInfoModalOpen(false);
    };

    const renderItem = React.useCallback(
        ({ item }: { item: ClothingItem }) => {
            const associatedTryon =
                allTryons.find((t) => t.clothing_id === item.id) ?? null;
            return (
                <ClothItem
                    navigation={navigation}
                    cloth={item}
                    associatedTryon={associatedTryon}
                />
            );
        },
        [allTryons],
    );

    return (
        <>
            {drawerCloth && (
                <FlatList
                    data={allCloths}
                    style={styleDressing.scrollView}
                    contentContainerStyle={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                    keyExtractor={(c) => c.id}
                    renderItem={renderItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    removeClippedSubviews={true}
                    ListHeaderComponent={
                        <AddButtonText
                            onPress={openModalAddCloth}
                            text="Ajouter un vêtement"
                        />
                    }
                />
            )}

            <DrawerToggleButton
                active={true}
                onPress={() => {
                    setDrawerCloth(!drawerCloth);
                }}
                size={40}
                iconColor={baseColors.black}
                backgroundColor={baseColors.white}
                style={{
                    position: 'absolute',
                    top: screenWidth / 1.5,
                    right: '90%',
                }}
            />

            <ImportChoice
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onPicked={handleImagePicked}
            />
            <ModalAddClothInfo
                open={infoModalOpen}
                onCancel={() => setInfoModalOpen(false)}
                onSave={handleSaveNewCloth}
            />
        </>
    );
}

const styleDressing = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: '100%',
    },
});
