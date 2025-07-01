// src/features/clothing/hooks/useUploadClothing.ts
import { useState, useCallback } from 'react';
import { useAppDispatch } from '../../../utils/hooks';
import Toast from 'react-native-toast-message';
import { uploadClothing } from '../clothingThunks';
import type { ClothingUploadPayload } from '../clothingTypes';

export function useUploadClothing() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createFormData = useCallback((uri: string) => {
        const uriParts = uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop() ?? 'jpeg';

        const formData = new FormData();
        formData.append('file', {
            uri,
            name: fileName,
            type: `image/${fileType}`,
        } as any);
        return formData;
    }, []);

    const saveClothing = useCallback(
        async ({
            uri,
            category,
            cloth_type,
            name,
        }: {
            uri: string;
            category: ClothingUploadPayload['category'];
            cloth_type: ClothingUploadPayload['cloth_type'];
            name: string;
        }) => {
            setLoading(true);
            setError(null);

            const formData = createFormData(uri);
            const payload: ClothingUploadPayload = {
                category,
                cloth_type,
                name,
                file: formData,
            };

            try {
                const resultAction = await dispatch(uploadClothing(payload));
                if (uploadClothing.fulfilled.match(resultAction)) {
                    Toast.show({
                        type: 'success',
                        text1: 'Vêtement ajouté avec succès !',
                        position: 'bottom',
                    });
                } else {
                    const message =
                        (resultAction.payload as string) ||
                        resultAction.error.message ||
                        "Erreur lors de l'ajout du vêtement.";
                    Toast.show({
                        type: 'error',
                        text1: message,
                        position: 'bottom',
                    });
                    setError(message);
                }
            } catch (e: any) {
                const msg = e.message ?? 'Erreur inattendue';
                Toast.show({ type: 'error', text1: msg, position: 'bottom' });
                setError(msg);
            } finally {
                setLoading(false);
            }
        },
        [dispatch, createFormData],
    );

    return { saveClothing, loading, error };
}
