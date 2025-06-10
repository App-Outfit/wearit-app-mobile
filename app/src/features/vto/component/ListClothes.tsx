import * as React from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';

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
import { fetchTryons } from '../tryonThunks';
import { selectAllTryons, selectTryonByClothID } from '../tryonSelectors';
import { ClothItem } from '../../clothing/components/ClothItem';
import { useTryonSSE } from '../hooks/useTryonSSE';

export function MiniDressing() {
    const dispatch = useAppDispatch();
    const [newPictureUri, setNewPictureUri] = React.useState<string | null>(
        null,
    );
    const [importModalOpen, setImportModalOpen] = React.useState(false);
    const [infoModalOpen, setInfoModalOpen] = React.useState(false);
    const openModalAddCloth = () => {
        setImportModalOpen(true);
    };

    const userCloth = useAppSelector(selectAllClothes);
    const allTryons = useAppSelector(selectAllTryons);
    const allCloths = userCloth;

    const userTryon = useAppSelector(selectAllTryons);
    const jwtToken = useAppSelector((state) => state.auth.token);

    useTryonSSE();

    React.useEffect(() => {
        dispatch(fetchClothes());

        // try on
        dispatch(fetchTryons());
    }, [dispatch]);

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

            const action = await dispatch(uploadClothing(payload));
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
            return <ClothItem cloth={item} associatedTryon={associatedTryon} />;
        },
        [allTryons],
    );

    return (
        <>
            <FlatList
                data={allCloths}
                keyExtractor={(c) => c.id}
                renderItem={renderItem}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListHeaderComponent={
                    <AddButtonText
                        onPress={openModalAddCloth}
                        text="Ajouter un vêtement"
                    />
                }
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
    scrollViewContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-end',
        width: '100%',
    },
});
<Text>React Component</Text>;
