import * as React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { TryonData, ClothData } from '../slice/sampleTryons';
import {
    loadAssetBase64,
    inpaintRegion,
    inpaintUpper,
    inpaintLower,
} from '../service/InpaintingService';
import {
    loadTryonsSuccess,
    setUpper,
    setLower,
    setDress,
} from '../slice/TryonSlice';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';

const mannequin_user_base = require('../../../assets/images/exemples/vto/original.png');
const uppermask_user_base = require('../../../assets/images/exemples/vto/upper_mask.png');
const lowermask_user_base = require('../../../assets/images/exemples/vto/lower_mask.png');
const dressmask_user_base = require('../../../assets/images/exemples/vto/dress_mask.png');

export default function VTODisplay() {
    const dispatch = useDispatch();
    const [originalBase64, setOriginalBase64] = React.useState<string>();
    const [upperMaskBase64, setUpperMaskBase64] = React.useState<string>();
    const [lowerMaskBase64, setLowerMaskBase64] = React.useState<string>();
    const [dressMaskBase64, setDressMaskBase64] = React.useState<string>();
    const [loadingMasks, setLoadingMasks] = React.useState(true);

    React.useEffect(() => {
        dispatch(loadTryonsSuccess(sampleTryons));
    }, [dispatch]);

    React.useEffect(() => {
        (async () => {
            try {
                const ori = await loadAssetBase64(mannequin_user_base);
                const upperMask = await loadAssetBase64(uppermask_user_base);
                const lowerMask = await loadAssetBase64(lowermask_user_base);
                const dressMask = await loadAssetBase64(dressmask_user_base);

                setOriginalBase64(ori);
                setUpperMaskBase64(upperMask);
                setLowerMaskBase64(lowerMask);
                setDressMaskBase64(dressMask);
            } catch (e) {
                console.error('Erreur chargement assets:', e);
            } finally {
                setLoadingMasks(false);
            }
        })();
    }, []);

    const selected = useSelector((state: any) => state.tryon.selected);
    const selectedTryon: TryonData | null =
        selected.dress || selected.upper || selected.lower || null;

    const currentType = React.useMemo<
        'upper' | 'lower' | 'dress' | null
    >(() => {
        if (!selectedTryon) return null;
        console.log('current_type');
        const cloth = sampleCloths.find(
            (c) => c.cloth_id === selectedTryon.cloth_id,
        );
        console.log(cloth);
        return cloth?.cloth_type;
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
            const tryon64 = await loadAssetBase64(selectedTryon.tryon_url);
            console.log(currentType);

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
                newDisplay = await inpaintLower(
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
            {originalBase64 && (
                <Image
                    style={styles.image}
                    source={{ uri: `data:image/png;base64,${originalBase64}` }}
                    resizeMode="cover"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    boxImg: {
        flex: 1,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        // objectFit: 'cover',
    },
});
