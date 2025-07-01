// src/store/selectors/tryonSelectors.ts

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { selectAllClothes } from '../clothing/clothingSelectors';

// 1️⃣ Sélecteur racine du slice tryon
const selectTryonState = (state: RootState) => state.tryon;
const selectClothState = (state: RootState) => state.clothing;

// 2️⃣ Liste complète des Tryons
export const selectAllTryons = createSelector(
    selectTryonState,
    (ts) => ts.tryons, // reconstruit un array depuis ids + entities
);

// // 3️⃣ Tryon sélectionné (détail)
// export const selectSelectedTryon = createSelector(
//   selectTryonState,
//   ts => ts.selected ? ts.entities[ts.selected]! : null
// );

// 4️⃣ État de chargement
export const selectTryonStatus = createSelector(
    selectTryonState,
    (ts) => ts.loading,
);

// 5️⃣ Erreur éventuelle
export const selectTryonError = createSelector(
    selectTryonState,
    (ts) => ts.error,
);

// 6️⃣ Finder pour un tryon par ID
export const makeSelectTryonById = (id: string) =>
    createSelector(selectTryonState, (ts) => ts.tryons[id] ?? null);

export const selectSelectedTryon = createSelector(
    selectTryonState,
    (state) => state.selectedTryon,
);

export const selectTryonByClothID = (clothId: string) =>
    createSelector(selectTryonState, (state) => {
        return (
            state.tryons.find((tryon) => tryon.clothing_id === clothId) || null
        );
    });

export const selectResultTryon = createSelector(selectTryonState, (state) => {
    const result = state.currentResult;
    return result || null;
});

const selectClothTypeById = createSelector(selectAllClothes, (clothes) =>
    clothes.reduce<Record<string, string>>((acc, cloth) => {
        acc[cloth.id] = cloth.cloth_type;
        return acc;
    }, {}),
);

export const selectReadyTryonsWithType = createSelector(
    [selectAllTryons, selectClothTypeById],
    (tryons, clothTypeById) =>
        tryons
            .filter((t) => t.status === 'ready')
            .map((t) => ({
                ...t,
                cloth_type: clothTypeById[t.clothing_id] ?? 'unknown',
            })),
);

export const selectReadyTryonsUpper = createSelector(
    selectReadyTryonsWithType,
    (tryons) => tryons.filter((t) => t.cloth_type === 'upper'),
);

export const selectReadyTryonsLower = createSelector(
    selectReadyTryonsWithType,
    (tryons) => tryons.filter((t) => t.cloth_type === 'lower'),
);
