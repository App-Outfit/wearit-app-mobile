// src/store/slices/tryonSlice.ts

import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
    createTryon,
    fetchTryons,
    fetchTryonById,
    deleteTryon,
} from './tryonThunks';
import { TryonItem, TryonDetailResponse } from './tryonTypes';

export interface TryonState {
    tryons: TryonItem[];
    selectedTryon: TryonDetailResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: TryonState = {
    tryons: [],
    selectedTryon: null,
    loading: false,
    error: null,
};

const tryonSlice = createSlice({
    name: 'tryon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // on recharge la liste après fetchTryons
        builder.addCase(fetchTryons.fulfilled, (state, { payload }) => {
            state.tryons = payload.tryons;
        });

        // on stocke le détail via fetchTryonById
        builder.addCase(fetchTryonById.fulfilled, (state, { payload }) => {
            state.selectedTryon = payload;
        });

        // quand on supprime un tryon
        builder.addCase(deleteTryon.fulfilled, (state, { meta }) => {
            state.tryons = state.tryons.filter((t) => t.id !== meta.arg);
            if (state.selectedTryon?.id === meta.arg) {
                state.selectedTryon = null;
            }
        });

        // pending → tous les thunks
        builder.addMatcher(
            isAnyOf(
                createTryon.pending,
                fetchTryons.pending,
                fetchTryonById.pending,
                deleteTryon.pending,
            ),
            (state) => {
                state.loading = true;
                state.error = null;
            },
        );

        // rejected → tous les thunks
        builder.addMatcher(
            isAnyOf(
                createTryon.rejected,
                fetchTryons.rejected,
                fetchTryonById.rejected,
                deleteTryon.rejected,
            ),
            (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || action.error.message || null;
            },
        );

        // fulfilled → clear loading
        builder.addMatcher(
            isAnyOf(
                createTryon.fulfilled,
                fetchTryons.fulfilled,
                fetchTryonById.fulfilled,
                deleteTryon.fulfilled,
            ),
            (state) => {
                state.loading = false;
            },
        );
    },
});

export default tryonSlice.reducer;
