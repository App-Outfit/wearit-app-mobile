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
import {
    loadTryonsSuccess,
    setUpper,
    setLower,
    setDress,
} from '../slice/TryonSlice';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';
import {
    fetchBodies,
    fetchBodyMasks,
    fetchCurrentBody,
} from '../../body/bodyThunks';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectBodyMasks, selectCurrentBody } from '../../body/bodySelectors';
import { AddButtonText } from '../../../components/core/Buttons';
import { baseColors, spacing } from '../../../styles/theme';
import { getActionFromState } from '@react-navigation/native';
import { TryonItem } from '../tryonTypes';
import { selectSelectedTryon } from '../tryonSelectors';
import { current } from '@reduxjs/toolkit';
import { ClothingItem } from '../../clothing/clothingTypes';
import { selectAllClothes } from '../../clothing/clothingSelectors';

const mannequin_user_base = require('../../../assets/images/exemples/vto/original.png');
const uppermask_user_base = require('../../../assets/images/exemples/vto/upper_mask.png');
const lowermask_user_base = require('../../../assets/images/exemples/vto/lower_mask.png');
const dressmask_user_base = require('../../../assets/images/exemples/vto/dress_mask.png');

export default function VTODisplay({ onNavigate }) {
    const dispatch = useAppDispatch();
    const [originalBase64, setOriginalBase64] = React.useState<string | null>();
    const [upperMaskBase64, setUpperMaskBase64] = React.useState<string>();
    const [lowerMaskBase64, setLowerMaskBase64] = React.useState<string>();
    const [dressMaskBase64, setDressMaskBase64] = React.useState<string>();
    const [loadingMasks, setLoadingMasks] = React.useState(true);

    const current_body = useAppSelector(selectCurrentBody);

    React.useEffect(() => {
        dispatch(loadTryonsSuccess(sampleTryons));
        if (!current_body) dispatch(fetchCurrentBody());
    }, [dispatch]);

    React.useEffect(() => {
        (async () => {
            try {
                console.log('test cbody', current_body);

                const sources =
                    current_body !== null
                        ? {
                              original: current_body.image_url,
                              upperMask: current_body.mask_upper,
                              lowerMask: current_body.mask_lower,
                              dressMask: current_body.mask_dress,
                          }
                        : {
                              original: mannequin_user_base,
                              upperMask: uppermask_user_base,
                              lowerMask: lowermask_user_base,
                              dressMask: dressmask_user_base,
                          };

                const [
                    oriBase64,
                    upperMaskBase64,
                    lowerMaskBase64,
                    dressMaskBase64,
                ] = await Promise.all([
                    loadAssetBase64(sources.original),
                    loadAssetBase64(sources.upperMask),
                    loadAssetBase64(sources.lowerMask),
                    loadAssetBase64(sources.dressMask),
                ]);

                setOriginalBase64(oriBase64);
                setUpperMaskBase64(upperMaskBase64);
                setLowerMaskBase64(lowerMaskBase64);
                setDressMaskBase64(dressMaskBase64);
            } catch (e) {
                console.error('Erreur chargement assets:', e);
            } finally {
                setLoadingMasks(false);
            }
        })();
    }, [current_body]);

    const selected = useAppSelector(selectSelectedTryon);
    const selectedTryon: TryonItem | null =
        selected.dress || selected.upper || selected.lower || null;

    const userCloth = useAppSelector(selectAllClothes);

    const currentType = React.useMemo<string | null | undefined>(() => {
        console.log('1');
        if (!selectedTryon) return null;
        const cloths = userCloth.find(
            (c: ClothingItem) => c.id === selectedTryon.clothing_id,
        );
        console.log('cloths ', cloths);
        return cloths?.cloth_type;
    }, [selectedTryon, loadingMasks]);

    React.useEffect(() => {
        if (
            !selectedTryon ||
            !originalBase64 ||
            loadingMasks ||
            (currentType === 'upper' && !upperMaskBase64) ||
            (currentType === 'lower' && !lowerMaskBase64) ||
            (currentType === 'dress' && !dressMaskBase64)
        ) {
            return;
        }

        (async () => {
            let newDisplay: string | undefined;
            const tryon64 = await loadAssetBase64(selectedTryon.output_url);

            if (currentType === 'upper') {
                newDisplay = await inpaintUpper(
                    originalBase64,
                    tryon64,
                    upperMaskBase64 || '',
                );
            } else if (currentType === 'lower') {
                newDisplay = await inpaintLower(
                    originalBase64,
                    tryon64,
                    lowerMaskBase64 || '',
                );
            } else {
                newDisplay = await inpaintDress(
                    originalBase64,
                    tryon64,
                    dressMaskBase64 || '',
                );
            }

            if (newDisplay) {
                setOriginalBase64(newDisplay);
            }
        })();
    }, [selectedTryon, originalBase64, loadingMasks, currentType]);

    return (
        <View style={styles.boxImg}>
            {current_body !== null ? (
                <Image
                    style={styles.image}
                    source={{ uri: `data:image/png;base64,${originalBase64}` }}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.boxOri}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: `data:image/png;base64,${originalBase64}`,
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
