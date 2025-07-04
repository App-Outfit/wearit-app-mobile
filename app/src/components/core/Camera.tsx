import * as ImagePicker from 'expo-image-picker';

// Ouvre la caméra et renvoie l’URI de la photo prise (ou null si annulé)
export async function pickFromCamera(): Promise<string | null> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission caméra refusée !');
        return null;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
    });

    if (result.canceled) {
        return null;
    }
    return result.assets[0].uri;
}

// Ouvre la galerie et renvoie l’URI de l’image sélectionnée (ou null si annulé)
export async function pickFromGallery(): Promise<string | null> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission galerie refusée !');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
    });

    if (result.canceled) {
        return null;
    }

    return result.assets[0].uri;
}

export const handleCamera = async (setImageUri: any) => {
    const uri = await pickFromCamera();
    if (uri) {
        setImageUri(uri);
    }
};

export const handleGallery = async (setImageUri: any, options?: { aspect?: [number, number] }) => {
    const uri = await pickFromGallery(options);
    if (uri) {
        setImageUri(uri);
    }
};
