// src/store/selectors/favoriteSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

const selectFavoriteState = (state: RootState) => state.favorite;

/** Liste complète */
export const selectAllFavorites = createSelector(
    selectFavoriteState,
    (fs) => fs.favorites,
);

/** Favori sélectionné */
export const selectSelectedFavorite = createSelector(
    selectFavoriteState,
    (fs) => fs.selectedFavorite,
);

/** Loading */
export const selectFavoriteLoading = createSelector(
    selectFavoriteState,
    (fs) => fs.loading,
);

/** Error */
export const selectFavoriteError = createSelector(
    selectFavoriteState,
    (fs) => fs.error,
);

/** Finder paramétré */
export const makeSelectFavoriteById = (id: string) =>
    createSelector(
        selectAllFavorites,
        (favs) => favs.find((f) => f.id === id) ?? null,
    );
