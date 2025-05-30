// src/store/selectors/bodySelectors.ts

import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';

const selectBodyState = (state: RootState) => state.body;

export const selectAllBodies = createSelector(
    selectBodyState,
    (bodyState) => bodyState.bodies,
);

export const selectCurrentBody = createSelector(
    selectBodyState,
    (bodyState) => bodyState.currentBody,
);

export const selectBodyMasks = createSelector(
    selectBodyState,
    (bodyState) => bodyState.masks,
);

/** masks for a given body_id */
export const makeSelectMasksForBody = (body_id: string) =>
    createSelector(selectBodyMasks, (masks) => masks[body_id]);

export const selectBodyLoading = createSelector(
    selectBodyState,
    (bodyState) => bodyState.loading,
);

export const selectBodyError = createSelector(
    selectBodyState,
    (bodyState) => bodyState.error,
);
