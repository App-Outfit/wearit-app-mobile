import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { isTokenExpired, loadToken } from '../slices/authSlice';
import { fetchProfile, fetchReferralCode, fetchCredits } from '../../profil/thunks/userThunks';
import { fetchCurrentBody } from '../../body/bodyThunks';
import { fetchClothes } from '../../clothing/clothingThunks';
import { saveBody, loadBody, saveMask, loadMaskUri } from '../../../utils/storage';
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
        // 1. Essayer de charger le body local
        const localBody = await loadBody();
        if (localBody) {
          dispatch(setCurrentBody(localBody));
        } else {
          // 2. Sinon, fetch distant puis sauvegarde
          const res = await dispatch(fetchCurrentBody()).unwrap();
          if (res) {
            await saveBody(res);
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