import * as React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';

import { useDispatch } from 'react-redux';
import { setUpper, setLower, setDress } from '../tryonSlice';
import type { ClothData } from '../slice/sampleTryons';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';
import { ImportChoice } from '../../../components/choice_component/ImportChoice';
import { ModalAddClothInfo } from '../component/ModalAddClothInfo';
import { baseColors, spacing, typography } from '../../../styles/theme';

import Feather from 'react-native-vector-icons/Feather';
import { AddButtonText } from '../../../components/core/Buttons';
import { createFormData } from '../../../utils/form';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectAllClothes } from '../../clothing/clothingSelectors';
import { fetchClothes, uploadClothing } from '../../clothing/clothingThunks';
import {
    ClothingItem,
    ClothingUploadPayload,
} from '../../clothing/clothingTypes';
import { fetchTryons } from '../tryonThunks';
import { TryonItem } from '../tryonTypes';
import { selectAllTryons } from '../tryonSelectors';
import { uploadBody } from '../../body/bodyThunks';

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
    const allCloths = [...userCloth];

    const userTryon = useAppSelector(selectAllTryons);

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
            console.log('ACTION UPLOAD CLOTHING :', action);
        } catch (error) {
            console.error('ERROR UPLOAD CLOTHING :', error);
        }

        setNewPictureUri(null);
        setInfoModalOpen(false);
    };

    const onSelect = (cloth: ClothingItem) => {
        const tryon = userTryon.find(
            (t: TryonItem) => t.clothing_id === cloth.id,
        );
        if (!tryon) return;
        if (cloth.cloth_type === 'dress') {
            dispatch(setDress(tryon));
        } else if (cloth.cloth_type === 'upper') {
            dispatch(setUpper(tryon));
        } else {
            dispatch(setLower(tryon));
        }
    };

    return (
        <ScrollView
            style={styleDressing.scrollView}
            contentContainerStyle={styleDressing.scrollViewContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            {allCloths.map((cloth: ClothingItem, idx: number) => {
                return (
                    <>
                        {idx === 0 ? (
                            <AddButtonText
                                key="addButton"
                                onPress={openModalAddCloth}
                                text={'Ajouter un vêtement'}
                            />
                        ) : (
                            <Text> </Text>
                        )}
                        <TouchableOpacity
                            key={idx}
                            onPress={() => onSelect(cloth)}
                            style={styleDressing.imgBox}
                        >
                            <Image
                                source={{ uri: cloth.image_url }}
                                style={styleDressing.img}
                            />
                        </TouchableOpacity>
                    </>
                );
            })}

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
        </ScrollView>
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
    imgBox: {
        width: 90,
        height: 140,
        marginBottom: spacing.small,
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
