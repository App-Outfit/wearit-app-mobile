// src/store/selectors/clothingSelectors.ts
import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';
import { ClothingItem, ClothingDetailResponse } from './clothingTypes';

const selectClothingState = (state: RootState) => state.clothing;
const selectTryonState = (state: RootState) => state.tryon;

export const selectAllClothes = createSelector(
    selectClothingState,
    (cs) => cs.clothes,
);

export const selectCategories = createSelector(
    selectClothingState,
    (cs) => cs.categories,
);

export const selectSelectedClothing = createSelector(
    selectClothingState,
    (cs) => cs.selectedClothing,
);

/** détail d’un vêtement par ID */
export const makeSelectClothingById = (id: string) =>
    createSelector(
        selectAllClothes,
        (clothes) => clothes.find((c) => c.id === id) || null,
    );

export const selectClothingLoading = createSelector(
    selectClothingState,
    (cs) => cs.loading,
);

export const selectClothingError = createSelector(
    selectClothingState,
    (cs) => cs.error,
);

export const selectClothTypeByTryonID = (tryonId: string | undefined) =>
    createSelector(selectClothingState, (state) => {
        if (!tryonId) return null;
        const cloth =
            state.clothes.find((cloth) => cloth.id === tryonId) || null;
        return cloth ? cloth.cloth_type : null;
    });
