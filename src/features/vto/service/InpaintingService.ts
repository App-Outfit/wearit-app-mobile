// services/inpaintingService.ts
import {
    OpenCV,
    ObjectType,
    ColorConversionCodes,
    ThresholdTypes,
    InterpolationFlags,
} from 'react-native-fast-opencv';
import type { Mat } from 'react-native-fast-opencv';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Helper to load a static asset as Base64
export async function loadAssetBase64(assetModule: any): Promise<string> {
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();
    if (!asset.localUri) throw new Error('Asset localUri not found');
    return await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
    });
}

/* Input type for inpainting: either a Base64 string or an already created Mat.*/
export type InputMat = string | Mat;

/* Convert a Base64 string or Mat to a Mat.*/
async function convertToMat(input: InputMat): Promise<Mat> {
    if (typeof input === 'string') {
        return OpenCV.base64ToMat(input);
    } else if (typeof input === 'number') {
        return OpenCV.base64ToMat(await loadAssetBase64(input));
    }

    return input;
}

export async function loadAssetToMat(img_asset: any) {
    const img_base64: InputMat = await loadAssetBase64(img_asset);
    return convertToMat(img_base64);
}

/**
 * Ensure a Mat is binary (0 or 255 values). If not, convert it.
 */
export function binarizeMask(maskMat: Mat): Mat {
    const gray = OpenCV.invoke('clone', maskMat);
    OpenCV.invoke(
        'cvtColor',
        maskMat,
        gray,
        ColorConversionCodes.COLOR_RGBA2GRAY,
    );
    const bin = OpenCV.invoke('clone', gray);
    OpenCV.invoke('threshold', gray, bin, 1, 255, ThresholdTypes.THRESH_BINARY);

    OpenCV.clearBuffers();
    return bin;
}

/**
 * Resize a Mat to given width & height using nearest-neighbor interpolation.
 */
export function resizeMat(mat: Mat, width: number, height: number): Mat {
    const sizeObj = OpenCV.createObject(ObjectType.Size, width, height);
    const resized = OpenCV.invoke('clone', mat);
    OpenCV.invoke(
        'resize',
        mat,
        resized,
        sizeObj,
        0,
        0,
        InterpolationFlags.INTER_NEAREST,
    );
    return resized;
}

/**
 * Generic inpainting placeholder function.
 * Copies the masked area from cloth to source.
 */
export async function inpaintRegion(
    source: InputMat,
    cloth: InputMat,
    mask: InputMat,
): Promise<string> {
    console.log('convertToMat');

    let srcMat = await convertToMat(source);
    let clothMat = await convertToMat(cloth);
    let maskMat = await convertToMat(mask);

    console.log(srcMat);
    console.log(clothMat);
    console.log(maskMat);

    console.log('resize');
    const { cols, rows } = OpenCV.toJSValue(srcMat);
    console.log(rows, cols);

    srcMat = resizeMat(srcMat, cols, rows);
    clothMat = resizeMat(clothMat, cols, rows);
    maskMat = resizeMat(maskMat, cols, rows);
    console.log(rows, cols);

    // maskMat = binarizeMask(maskMat);
    const dstMat = OpenCV.invoke('clone', srcMat);
    OpenCV.invoke('copyTo', clothMat, dstMat, maskMat);

    const { base64 } = OpenCV.toJSValue(dstMat, 'png');
    OpenCV.clearBuffers();

    return base64;
}

/*Specialized function for upper garments.*/
export async function inpaintUpper(
    source: InputMat,
    upperCloth: InputMat,
    upperMask: InputMat,
): Promise<string> {
    return inpaintRegion(source, upperCloth, upperMask);
}

/*Specialized function for lower garments */
export async function inpaintLower(
    source: InputMat,
    lowerCloth: InputMat,
    lowerMask: InputMat,
): Promise<string> {
    return inpaintRegion(source, lowerCloth, lowerMask);
}

/**
 * Specialized function for full-body dresses (overall).
 * Replaces entire region, can ignore upper/lower masks.
 */
export async function inpaintDress(
    source: InputMat,
    dressCloth: InputMat,
    dressMask: InputMat,
): Promise<string> {
    return inpaintRegion(source, dressCloth, dressMask);
}
