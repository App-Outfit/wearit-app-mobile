import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// Fonction utilitaire pour vérifier la taille du fichier
async function getFileInfo(uri: string) {
    try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log('📊 File Info:', {
            uri,
            size: 'size' in fileInfo ? fileInfo.size : 'Unknown',
            exists: fileInfo.exists,
            isDirectory: fileInfo.isDirectory,
        });
        return fileInfo;
    } catch (error) {
        console.error('📊 File Info Error:', error);
        return null;
    }
}

// Ouvre la caméra et renvoie l'URI de la photo prise (ou null si annulé)
export async function pickFromCamera(): Promise<string | null> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission caméra refusée !');
        return null;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5, // Compression plus agressive pour iPhone
    });

    if (result.canceled) {
        return null;
    }

    const uri = result.assets[0].uri;
    console.log('📸 Camera - Original URI:', uri);
    console.log('📸 Camera - File size:', result.assets[0].fileSize);
    console.log('📸 Camera - Type:', result.assets[0].type);
    console.log('📸 Camera - Dimensions:', result.assets[0].width, 'x', result.assets[0].height);

    // Vérifier les infos du fichier
    await getFileInfo(uri);

    // Compresser et redimensionner l'image en préservant le ratio
    try {
        const originalWidth = result.assets[0].width;
        const originalHeight = result.assets[0].height;
        
        // Calculer les nouvelles dimensions en préservant le ratio
        let newWidth = 1024;
        let newHeight = 1024;
        
        if (originalWidth > originalHeight) {
            // Image paysage
            newWidth = 1024;
            newHeight = Math.round((originalHeight * 1024) / originalWidth);
        } else {
            // Image portrait
            newHeight = 1024;
            newWidth = Math.round((originalWidth * 1024) / originalHeight);
        }
        
        console.log('📸 Camera - Resizing to:', newWidth, 'x', newHeight);

        const processedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: newWidth, height: newHeight } }], // Redimensionner en préservant le ratio
            {
                compress: 0.7, // Compression supplémentaire
                format: ImageManipulator.SaveFormat.JPEG, // Forcer JPEG
            }
        );
        
        console.log('📸 Camera - Processed URI:', processedImage.uri);
        console.log('📸 Camera - Processed size:', processedImage.width, 'x', processedImage.height);
        
        // Vérifier les infos du fichier traité
        await getFileInfo(processedImage.uri);
        
        return processedImage.uri;
    } catch (error) {
        console.error('📸 Camera - Processing error:', error);
        return uri; // Retourner l'original si le traitement échoue
    }
}

// Ouvre la galerie et renvoie l'URI de l'image sélectionnée (ou null si annulé)
export async function pickFromGallery(): Promise<string | null> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission galerie refusée !');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5, // Compression plus agressive pour iPhone
    });

    if (result.canceled) {
        return null;
    }

    const uri = result.assets[0].uri;
    console.log('🖼️ Gallery - Original URI:', uri);
    console.log('🖼️ Gallery - File size:', result.assets[0].fileSize);
    console.log('🖼️ Gallery - Type:', result.assets[0].type);
    console.log('🖼️ Gallery - Dimensions:', result.assets[0].width, 'x', result.assets[0].height);

    // Vérifier les infos du fichier
    await getFileInfo(uri);

    // Compresser et redimensionner l'image en préservant le ratio
    try {
        const originalWidth = result.assets[0].width;
        const originalHeight = result.assets[0].height;
        
        // Calculer les nouvelles dimensions en préservant le ratio
        let newWidth = 1024;
        let newHeight = 1024;
        
        if (originalWidth > originalHeight) {
            // Image paysage
            newWidth = 1024;
            newHeight = Math.round((originalHeight * 1024) / originalWidth);
        } else {
            // Image portrait
            newHeight = 1024;
            newWidth = Math.round((originalWidth * 1024) / originalHeight);
        }
        
        console.log('🖼️ Gallery - Resizing to:', newWidth, 'x', newHeight);

        const processedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: newWidth, height: newHeight } }], // Redimensionner en préservant le ratio
            {
                compress: 0.7, // Compression supplémentaire
                format: ImageManipulator.SaveFormat.JPEG, // Forcer JPEG
            }
        );
        
        console.log('🖼️ Gallery - Processed URI:', processedImage.uri);
        console.log('🖼️ Gallery - Processed size:', processedImage.width, 'x', processedImage.height);
        
        // Vérifier les infos du fichier traité
        await getFileInfo(processedImage.uri);
        
        return processedImage.uri;
    } catch (error) {
        console.error('🖼️ Gallery - Processing error:', error);
        return uri; // Retourner l'original si le traitement échoue
    }
}

export const handleCamera = async (setImageUri: any) => {
    try {
    const uri = await pickFromCamera();
    if (uri) {
            console.log('📸 Camera - Setting URI:', uri);
        setImageUri(uri);
        }
    } catch (error) {
        console.error('📸 Camera - Error:', error);
        alert('Erreur lors de la prise de photo');
    }
};

export const handleGallery = async (setImageUri: any, options?: { aspect?: [number, number] }) => {
    try {
        const uri = await pickFromGallery();
    if (uri) {
            console.log('🖼️ Gallery - Setting URI:', uri);
        setImageUri(uri);
        }
    } catch (error) {
        console.error('🖼️ Gallery - Error:', error);
        alert('Erreur lors de la sélection de photo');
    }
};
