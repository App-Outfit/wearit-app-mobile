import * as React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { TryonData, ClothData } from '../slice/sampleTryons';
import { loadAssetBase64, inpaintRegion } from '../service/InpaintingService';
import {
    loadTryonsSuccess,
    setUpper,
    setLower,
    setDress,
} from '../slice/TryonSlice';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';

const mannequin_user_base = require('../../../assets/images/exemples/vto/original.png');
const upper_mask = require('../../../assets/images/exemples/vto/original.png');

export default function VTODisplay() {
    const dispatch = useDispatch();
    const [originalBase64, setOriginalBase64] = React.useState<string>();
    const [maskBase64, setMaskBase64] = React.useState<string>();
    const [loadingAssets, setLoadingAssets] = React.useState(true);

    // Redux state
    const selected = useSelector((state: any) => state.tryon.selected);
    const selectedTryon: TryonData | null =
        selected.dress || selected.upper || selected.lower || null;

    React.useEffect(() => {
        dispatch(loadTryonsSuccess(sampleTryons));
    }, [dispatch]);

    React.useEffect(() => {
        (async () => {
            try {
                const ori = await loadAssetBase64(mannequin_user_base);
                const msk = await loadAssetBase64(upper_mask);
                setOriginalBase64(ori);
                setMaskBase64(msk);
            } catch (e) {
                console.error('Erreur chargement assets:', e);
            } finally {
                setLoadingAssets(false);
            }
        })();
    }, []);

    return (
        <View style={styles.boxImg}>
            {selectedTryon ? (
                <Image source={selectedTryon.tryon_url} style={styles.image} />
            ) : (
                originalBase64 && (
                    <Image
                        style={styles.image}
                        source={{
                            uri: `data:image/png;base64,${originalBase64}`,
                        }}
                    />
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    boxImg: {
        width: '100%',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
});
