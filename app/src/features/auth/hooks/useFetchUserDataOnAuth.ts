import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { isTokenExpired, loadToken } from '../slices/authSlice';
import {
    fetchProfile,
    fetchReferralCode,
    fetchCredits,
} from '../../profil/thunks/userThunks';
import { fetchCurrentBody } from '../../body/bodyThunks';
import { fetchClothes } from '../../clothing/clothingThunks';
import {
    saveBody,
    loadBody,
    saveMask,
    loadMaskUri,
} from '../../../utils/storage';
import { setCurrentBody } from '../../body/bodySlice';

/**
 * Ce hook vérifie le token et fetch les données utilisateur si connecté.
 * Il tente d'abord de charger le body et le mask depuis le stockage local.
 */
export function useFetchUserDataOnAuth() {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            let currentToken = token;
            if (!currentToken) {
                currentToken = await dispatch(loadToken()).unwrap();
            }
            if (currentToken && !isTokenExpired(currentToken)) {
                await dispatch(fetchProfile());
                await dispatch(fetchReferralCode());
                await dispatch(fetchCredits());
                await dispatch(fetchClothes());

                // --- BODY ---
                // 1. Essayer de charger le body local en premier
                try {
                    const localBody = await loadBody();
                    if (localBody) {
                        // Charger immédiatement depuis le cache
                        dispatch(setCurrentBody(localBody));

                        // Fetch en arrière-plan pour synchroniser avec le serveur
                        dispatch(fetchCurrentBody())
                            .then(async (result) => {
                                if (
                                    result.payload &&
                                    JSON.stringify(result.payload) !==
                                        JSON.stringify(localBody)
                                ) {
                                    // Mettre à jour si le body distant est différent
                                    await saveBody(result.payload);
                                    dispatch(setCurrentBody(result.payload));
                                }
                            })
                            .catch((error) => {
                                console.warn('Sync body failed:', error);
                            });
                    } else {
                        // 2. Pas de cache local, fetch immédiatement
                        const res = await dispatch(fetchCurrentBody()).unwrap();
                        if (res) {
                            await saveBody(res);
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement du body:', error);
                    // En cas d'erreur de cache, essayer le fetch distant
                    try {
                        const res = await dispatch(fetchCurrentBody()).unwrap();
                        if (res) {
                            await saveBody(res);
                        }
                    } catch (fetchError) {
                        console.error(
                            'Erreur lors du fetch du body:',
                            fetchError,
                        );
                    }
                }
                // --- MASK (optionnel, à adapter selon ton flux) ---
                // Tu peux faire pareil pour le mask si tu veux
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, dispatch]);
}
