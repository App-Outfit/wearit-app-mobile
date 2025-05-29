// src/store/selectors/userSelectors.ts
import { RootState } from '../../../store';
import { createSelector } from '@reduxjs/toolkit';

const selectUserState = (state: RootState) => state.user;

/** Profil complet (ou null) */
export const selectUserProfile = createSelector(
    selectUserState,
    (userState) => userState.user,
);

/** Nombre de credits (0 si pas encore chargé) */
export const selectUserCredits = createSelector(
    selectUserProfile,
    (profile) => profile?.credits ?? 0,
);

/** Date de dernière mise à jour des crédits */
export const selectCreditsUpdatedAt = createSelector(
    selectUserState,
    (userState) => userState.creditsHistory?.updated_at,
);

/** Code de parrainage */
export const selectUserReferralCode = createSelector(
    selectUserState,
    (userState) => userState.referral?.referral_code,
);

/** État de chargement global du slice */
export const selectUserLoading = createSelector(
    selectUserState,
    (userState) => userState.loading,
);

/** Erreur stockée dans le slice */
export const selectUserError = createSelector(
    selectUserState,
    (userState) => userState.error,
);

/**
 * Regroupe profil, crédits et code de parrainage
 * Utile si un composant a besoin de tout en même temps
 */
export const selectUserSummary = createSelector(
    [selectUserProfile, selectUserCredits, selectUserReferralCode],
    (profile, credits, referralCode) => ({
        user_id: profile?.user_id,
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        gender: profile?.gender,
        credits,
        referral_code: referralCode,
        answers: profile?.answers,
    }),
);
