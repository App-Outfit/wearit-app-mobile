import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

/**
 * Enregistre une image Base64 ou HTTP dans la galerie Android/iOS
 * @param uri string : soit "data:image/png;base64,AAA..." soit URL http(s)
 * @param fileName string : nom de fichier, ex: "wearit-123.jpg"
 */
export async function saveImageToGalleryAsync(
    uri: string,
    fileName: string,
): Promise<void> {
    // 1) Préparer le chemin local
    const localUri = FileSystem.documentDirectory + fileName;

    // 2) Si c'est du Base64 (data URI ou chaîne brute), on écrit en Base64
    if (!uri.startsWith('http')) {
        // extraire la partie Base64 (si data URI) ou prendre tout
        const base64 = uri.includes(',') ? uri.split(',')[1] : uri;
        await FileSystem.writeAsStringAsync(localUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
        });
    } else {
        // 3) Sinon, télécharger depuis le web
        await FileSystem.downloadAsync(uri, localUri);
    }

    // 4) Demander la permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        throw new Error('Permission non accordée pour la galerie');
    }

    // 5) Créer un asset et l’ajouter à l’album "WearIt"
    const asset = await MediaLibrary.createAssetAsync(localUri);
    await MediaLibrary.createAlbumAsync('WearIt', asset, false);
}
