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
import { fetchBodies } from '../../body/bodyThunks';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectCurrentBody } from '../../body/bodySelectors';
import { AddButtonText } from '../../../components/core/Buttons';
import { baseColors, spacing } from '../../../styles/theme';

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
        dispatch(fetchBodies());
    }, [dispatch]);

    React.useEffect(() => {
        (async () => {
            try {
                let ori = await loadAssetBase64(mannequin_user_base);
                if (current_body != null)
                    ori = await loadAssetBase64(current_body);

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
        'upper' | 'lower' | 'dress' | null | undefined
    >(() => {
        if (!selectedTryon) return null;
        return sampleCloths.find((c) => c.cloth_id === selectedTryon.cloth_id)
            ?.cloth_type;
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
            {current_body != null ? (
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
