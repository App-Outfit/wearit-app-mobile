import * as React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { TryonData, ClothData } from '../slice/sampleTryons';
import {
    loadAssetBase64,
    inpaintRegion,
    inpaintUpper,
    inpaintLower,
    inpaintDress,
} from '../service/InpaintingService';
import { loadTryonsSuccess } from '../slice/TryonSlice';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';
import {
    fetchBodies,
    fetchBodyMasks,
    fetchCurrentBody,
} from '../../body/bodyThunks';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { AddButtonText } from '../../../components/core/Buttons';
import { baseColors, spacing } from '../../../styles/theme';
import { TryonItem } from '../tryonTypes';
import { selectResultTryon, selectSelectedTryon } from '../tryonSelectors';
import { ClothingItem } from '../../clothing/clothingTypes';
import {
    selectAllClothes,
    selectClothTypeByTryonID,
} from '../../clothing/clothingSelectors';
import FastImage from '@d11/react-native-fast-image';
import { selectCurrentBody } from '../../body/bodySelectors';
import { setCurrentResult } from '../tryonSlice';
import { inpaintTryon } from '../tryonThunks';
import { current } from '@reduxjs/toolkit';

const ImageDisplay = React.memo(
    ({ uri }: { uri: string }) => (
        <FastImage
            style={styles.image}
            source={{
                uri: uri,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
        />
        // <Image style={styles.image} source={{ uri }} resizeMode="cover" fadeDuration={500} />
    ),
    (prev, next) => prev.uri === next.uri,
);

export default function VTODisplay({ onNavigate }) {
    const dispatch = useAppDispatch();
    const [resultBase64, setResultBase64] = React.useState<string>('');
    const [upperMaskBase64, setUpperMaskBase64] = React.useState<string>();
    const [lowerMaskBase64, setLowerMaskBase64] = React.useState<string>();
    const [dressMaskBase64, setDressMaskBase64] = React.useState<string>();
    const [tryon64, setTryon64] = React.useState<string>('');
    const current_body = useAppSelector(selectCurrentBody);

    React.useEffect(() => {
        dispatch(loadTryonsSuccess(sampleTryons));
        dispatch(fetchCurrentBody());
    }, [dispatch]);

    React.useEffect(() => {
        const initCurrentResult = async () => {
            if (current_body) {
                const uri = await loadAssetBase64(current_body.image_url);
                const upperMask = await loadAssetBase64(
                    current_body.mask_upper,
                );
                const lowerMask = await loadAssetBase64(
                    current_body.mask_lower,
                );
                const dressMask = await loadAssetBase64(
                    current_body.mask_dress,
                );

                dispatch(setCurrentResult(uri));
                setResultBase64(uri);
                setUpperMaskBase64(upperMask);
                setLowerMaskBase64(lowerMask);
                setDressMaskBase64(dressMask);
            }
        };
        initCurrentResult();
    }, [current_body, dispatch]);

    // const userCloth = useAppSelector(selectAllClothes);
    const selected = useAppSelector(selectSelectedTryon);
    const userCloth = useAppSelector(selectAllClothes);
    const selectedTryon: TryonItem | null =
        selected.dress || selected.upper || selected.lower || null;
    const currentType = React.useMemo<string | null | undefined>(() => {
        if (!selectedTryon) return null;
        const cloths = userCloth.find(
            (c: ClothingItem) => c.id === selectedTryon.clothing_id,
        );
        return cloths?.cloth_type;
    }, [selectedTryon]);

    React.useEffect(() => {
        if (!selectedTryon?.id || !selectedTryon.output_url || !currentType) {
            return;
        }

        const computeResult = async () => {
            const tryon64 = await loadAssetBase64(selectedTryon.output_url);
            try {
                let result: string;
                switch (currentType) {
                    case 'upper':
                        result = await inpaintUpper(
                            resultBase64,
                            tryon64,
                            upperMaskBase64,
                        );
                        break;
                    case 'lower':
                        result = await inpaintLower(
                            resultBase64,
                            tryon64,
                            lowerMaskBase64,
                        );
                        break;
                    case 'dress':
                        result = await inpaintDress(
                            resultBase64,
                            tryon64,
                            dressMaskBase64,
                        );
                        break;
                    default:
                        throw new Error(`Unknown inpaint type: ${currentType}`);
                }

                setResultBase64(result);
                dispatch(setCurrentResult(result));
            } catch (err: any) {
                console.log('Error inpainting tryon');
            }
        };

        computeResult();
    }, [selectedTryon?.id, selectedTryon?.output_url, currentType, dispatch]);

    return (
        <View style={styles.boxImg}>
            {current_body !== null ? (
                <ImageDisplay uri={`data:image/png;base64,${resultBase64}`} />
            ) : (
                <View style={styles.boxOri}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: `data:image/png;base64,${resultBase64}`,
                        }}
                        resizeMode="cover"
                    />
                    <View style={styles.addButtonBox}>
                        <AddButtonText
                            onPress={onNavigate}
                            text={'Ajouter votre mannequin'}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    boxImg: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    boxOri: {
        position: 'relative',
        flex: 1,
        width: '100%',
    },
    addButtonBox: {
        position: 'absolute',
        backgroundColor: baseColors.white,
        bottom: 0,
        right: 0,
        height: 80,
        borderTopLeftRadius: spacing.small,
        paddingVertical: spacing.xSmall,
    },
});
