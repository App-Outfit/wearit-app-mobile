// src/store/slices/tryonSlice.ts

import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
    createTryon,
    fetchTryons,
    fetchTryonById,
    deleteTryon,
} from './tryonThunks';
import { TryonItem, TryonDetailResponse } from './tryonTypes';

export interface TryonState {
    tryons: TryonItem[];
    selectedTryon: {
        upper: TryonItem | null;
        lower: TryonItem | null;
        dress: TryonItem | null;
    };
    loading: boolean;
    error: string | null;
}

const initialState: TryonState = {
    tryons: [],
    selectedTryon: { upper: null, lower: null, dress: null },
    loading: false,
    error: null,
};

const tryonSlice = createSlice({
    name: 'tryon',
    initialState,
    reducers: {
        setUpper(state, action: PayloadAction<TryonItem>) {
            state.selectedTryon.upper = action.payload;
            state.selectedTryon.dress = null;
            state.selectedTryon.lower = null;
        },
        setLower(state, action: PayloadAction<TryonItem>) {
            state.selectedTryon.lower = action.payload;
            state.selectedTryon.upper = null;

            state.selectedTryon.dress = null;
        },
        setDress(state, action: PayloadAction<TryonItem>) {
            state.selectedTryon.dress = action.payload;
            state.selectedTryon.upper = null;
            state.selectedTryon.lower = null;
        },
        updateTryon(
            state,
            action: PayloadAction<Partial<TryonItem> & { id: string }>,
        ) {
            const idx = state.tryons.findIndex(
                (t) => t.id === action.payload.id,
            );

            if (idx >= 0) {
                state.tryons[idx] = { ...state.tryons[idx], ...action.payload };
            } else {
                state.tryons.push(action.payload as TryonItem);
            }
        },
    },
    extraReducers: (builder) => {
        // on recharge la liste après fetchTryons
        builder.addCase(fetchTryons.fulfilled, (state, { payload }) => {
            state.tryons = payload.tryons;
        });

        // on stocke le détail via fetchTryonById
        builder.addCase(fetchTryonById.fulfilled, (state, { payload }) => {
            // state.selectedTryon = payload;
        });

        // quand on supprime un tryon
        builder.addCase(deleteTryon.fulfilled, (state, { meta }) => {
            // state.tryons = state.tryons.filter((t) => t.id !== meta.arg);
            // if (state.selectedTryon?.id === meta.arg) {
            //     // state.selectedTryon = null;
            // }
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
export const { setUpper, setLower, setDress, updateTryon } = tryonSlice.actions;
