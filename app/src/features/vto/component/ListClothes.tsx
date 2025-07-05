import * as React from 'react';
import { StyleSheet, FlatList, Dimensions } from 'react-native';

import { ImportChoice } from '../../../components/choice_component/ImportChoice';
import { ModalAddClothInfo } from '../component/ModalAddClothInfo';
import { baseColors } from '../../../styles/theme';

import { AddButtonText } from '../../../components/core/Buttons';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectAllClothes } from '../../clothing/clothingSelectors';
import { fetchClothes } from '../../clothing/clothingThunks';
import { ClothingItem } from '../../clothing/clothingTypes';
import { fetchTryonsByBodyId } from '../tryonThunks';
import { selectAllTryons, selectTryonByClothID } from '../tryonSelectors';
import { ClothItem } from '../../clothing/components/ClothItem';
import { useTryonSSE } from '../hooks/useTryonSSE';
import { DrawerToggleButton } from '../../../components/core/DrawerToggleButton';
import { useNavigation } from '@react-navigation/native';
import { selectCurrentBody } from '../../body/bodySelectors';
import { fetchCurrentBody } from '../../body/bodyThunks';
import { useUploadClothing } from '../../clothing/hooks/useUploadClothing';

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
    const {
        saveClothing,
        loading: uploading,
        error: uploadError,
    } = useUploadClothing();

    const current_body = useAppSelector(selectCurrentBody);
    const userCloth = useAppSelector(selectAllClothes);
    const allTryons = useAppSelector(selectAllTryons);
    const allCloths = userCloth;
    const [lastFetchedBodyId, setLastFetchedBodyId] = React.useState<string | null>(null);

    const screenWidth = Dimensions.get('window').width;

    useTryonSSE();

    React.useEffect(() => {
        dispatch(fetchClothes());
    }, [dispatch]);

    React.useEffect(() => {
        // Éviter les appels répétés pour le même body_id
        if (current_body && current_body.id !== lastFetchedBodyId) {
            dispatch(fetchTryonsByBodyId(current_body.id));
            setLastFetchedBodyId(current_body.id);
        }
    }, [current_body, dispatch, lastFetchedBodyId]);

    const handleImagePicked = async (uri) => {
        setImportModalOpen(false);
        if (uri) {
            setNewPictureUri(uri);
            setInfoModalOpen(true);
        }
    };

    const handleSaveNewCloth = async ({ cloth_type, category, cloth_id }) => {
        if (!newPictureUri) return;
        await saveClothing({
            uri: newPictureUri,
            category,
            cloth_type,
            name: cloth_id,
        });
        // on ferme la modale et reset l'URI seulement si pas d'erreur
        if (!uploadError) {
            setNewPictureUri(null);
            setInfoModalOpen(false);
            dispatch(fetchClothes());
        }
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
                // loading={uploading}
                // error={uploadError}
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
