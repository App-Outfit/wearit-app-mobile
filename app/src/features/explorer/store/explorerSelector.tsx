import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

const selectExplorerState = (state: RootState) => state.explorer;
const selectUserState = (state: RootState) => state.user;

export const selectExplorerProducts = (state: RootState) =>
    state.explorer.products ?? [];

export const selectExplorerQuery = createSelector(
    selectExplorerState,
    (explorer) => explorer.query,
);

export const selectExplorerBookmark = createSelector(
    selectExplorerState,
    (explorer) => explorer.bookmark,
);

export const selectExplorerCsrfToken = createSelector(
    selectExplorerState,
    (explorer) => explorer.csrf_token,
);

export const selectExplorerLoading = createSelector(
    selectExplorerState,
    (explorer) => explorer.loading,
);

export const selectExplorerError = createSelector(
    selectExplorerState,
    (explorer) => explorer.error,
);

export const selectUserGender = createSelector(selectUserState, (state) => {
    if (state.user?.answers === undefined || state.user?.answers === null) {
        return null;
    }

    return state.user?.answers.gender;
});
