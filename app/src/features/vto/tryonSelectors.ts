// src/store/selectors/tryonSelectors.ts

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

// 1️⃣ Sélecteur racine du slice tryon
const selectTryonState = (state: RootState) => state.tryon;

// 2️⃣ Liste complète des Tryons
export const selectAllTryons = createSelector(
    selectTryonState,
    (ts) => ts.ids.map((id) => ts.entities[id]!), // reconstruit un array depuis ids + entities
);

// // 3️⃣ Tryon sélectionné (détail)
// export const selectSelectedTryon = createSelector(
//   selectTryonState,
//   ts => ts.selected ? ts.entities[ts.selected]! : null
// );

// 4️⃣ État de chargement
export const selectTryonStatus = createSelector(
    selectTryonState,
    (ts) => ts.status,
);

// 5️⃣ Erreur éventuelle
export const selectTryonError = createSelector(
    selectTryonState,
    (ts) => ts.error,
);

// 6️⃣ Finder pour un tryon par ID
export const makeSelectTryonById = (id: string) =>
    createSelector(selectTryonState, (ts) => ts.entities[id] ?? null);
