import * as React from 'react';
import {
    View,
    Image,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {
    OpenCV,
    ObjectType,
    InterpolationFlags,
    ThresholdTypes,
} from 'react-native-fast-opencv';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Assets imports
const originalAsset = require('../../../assets/images/exemples/vto/original.png');
const dressAsset = require('../../../assets/images/exemples/vto/001_dress3_output.png');
const maskAsset = require('../../../assets/images/exemples/vto/upper_mask.png');

// Helper to load a static asset as Base64
async function loadAssetBase64(assetModule: any): Promise<string> {
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();
    if (!asset.localUri) throw new Error('Asset localUri not found');
    return await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
    });
}

export function VTODressingScreen() {
    return (
        <View style={{ flex: 1 }}>
            <DisplayVTO />
        </View>
    );
}

export function DisplayVTO() {
    const [originalBase64, setVTOImg] = React.useState<string>();
    const [dressBase64, setDressBase64] = React.useState<string>();
    const [maskBase64, setMaskBase64] = React.useState<string>();
    const [inpainting, setInpainting] = React.useState(false);

    // Charger les assets au montage
    React.useEffect(() => {
        (async () => {
            try {
                const ori = await loadAssetBase64(originalAsset);
                const drs = await loadAssetBase64(dressAsset);
                const msk = await loadAssetBase64(maskAsset);
                setVTOImg(ori);
                setDressBase64(drs);
                setMaskBase64(msk);
            } catch (e) {
                console.error('Erreur chargement assets:', e);
            }
        })();
    }, []);

    // Inpainting function on JS thread
    const handleInpaint = async () => {
        if (!originalBase64 || !dressBase64 || !maskBase64) return;
        setInpainting(true);
        try {
            // Load mats
            const src = OpenCV.base64ToMat(originalBase64);
            const dress = OpenCV.base64ToMat(dressBase64);
            let mask = OpenCV.base64ToMat(maskBase64);

            // Resize mask to match source size
            const { cols, rows } = OpenCV.toJSValue(src);
            const sizeObj = OpenCV.createObject(ObjectType.Size, cols, rows);
            console.log('cols, rows ', cols, rows);
            OpenCV.invoke(
                'resize',
                mask,
                mask,
                sizeObj,
                0,
                0,
                InterpolationFlags.INTER_NEAREST,
            );
            OpenCV.invoke(
                'resize',
                src,
                src,
                sizeObj,
                0,
                0,
                InterpolationFlags.INTER_NEAREST,
            );
            OpenCV.invoke(
                'resize',
                dress,
                dress,
                sizeObj,
                0,
                0,
                InterpolationFlags.INTER_NEAREST,
            );

            // Binarize mask directly
            const maskBin = OpenCV.invoke('clone', mask);
            OpenCV.invoke(
                'threshold',
                mask,
                maskBin,
                1,
                255,
                ThresholdTypes.THRESH_BINARY,
            );

            // Perform copyTo with binary mask
            const dst = OpenCV.invoke('clone', src);
            OpenCV.invoke('copyTo', dress, dst, maskBin);

            // Get result as base64
            const { base64 } = OpenCV.toJSValue(dst, 'png');
            setVTOImg(base64);

            // Clear buffers
            OpenCV.clearBuffers();
        } catch (e) {
            console.error('Erreur inpainting:', e);
        } finally {
            setInpainting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Virtual Try-On</Text>
            {originalBase64 && (
                <Image
                    style={styles.image}
                    source={{ uri: `data:image/png;base64,${originalBase64}` }}
                />
            )}
            <Button
                title="Appliquer le fitting"
                onPress={handleInpaint}
                disabled={inpainting}
            />
            {inpainting && (
                <ActivityIndicator size="large" style={{ marginTop: 10 }} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    image: {
        width: 250,
        height: 350,
        marginVertical: 10,
        resizeMode: 'contain',
    },
});
