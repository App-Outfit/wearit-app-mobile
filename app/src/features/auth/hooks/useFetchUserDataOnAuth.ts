import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { isTokenExpired, loadToken } from '../slices/authSlice';
import { fetchProfile, fetchReferralCode, fetchCredits } from '../../profil/thunks/userThunks';
import { fetchCurrentBody } from '../../body/bodyThunks';
import { fetchClothes } from '../../clothing/clothingThunks';

/**
 * Ce hook vérifie le token et fetch les données utilisateur si connecté.
 * Il ne fait aucune redirection.
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
        await dispatch(fetchCurrentBody());
        await dispatch(fetchCredits());
        await dispatch(fetchClothes());
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dispatch]);
} 