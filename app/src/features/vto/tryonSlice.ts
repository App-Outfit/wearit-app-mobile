// src/store/slices/tryonSlice.ts

import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
    isAnyOf,
} from '@reduxjs/toolkit';
import {
    createTryon,
    fetchTryons,
    fetchTryonById,
    deleteTryon,
    inpaintTryon,
} from './tryonThunks';
import { TryonItem, TryonDetailResponse } from './tryonTypes';
// import { loadAssetBase64 } from './service/InpaintingService';

// const mannequin_user_base = require('../../../assets/images/exemples/vto/original.png');
// const uppermask_user_base = require('../../../assets/images/exemples/vto/upper_mask.png');
// const lowermask_user_base = require('../../../assets/images/exemples/vto/lower_mask.png');
// const dressmask_user_base = require('../../../assets/images/exemples/vto/dress_mask.png');

export type UpperLowerTryon = {
    upper: TryonItem | null;
    lower: TryonItem | null;
};

export interface TryonState {
    tryons: TryonItem[];
    selectedTryon: {
        upper: TryonItem | null;
        lower: TryonItem | null;
        dress: TryonItem | null;
    };
    currentResult: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: TryonState = {
    tryons: [],
    selectedTryon: { upper: null, lower: null, dress: null },
    currentResult: null,
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
        setCurrentResult(state, action: PayloadAction<string | null>) {
            if (action.payload === null) {
                state.currentResult = null;
                return;
            }
            state.currentResult = action.payload;
        },
        setUpperLower(state, action: PayloadAction<UpperLowerTryon>) {
            const { upper, lower } = action.payload;
            state.selectedTryon.upper = upper;
            state.selectedTryon.lower = lower;
            state.selectedTryon.dress = null;
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

        builder
            .addCase(inpaintTryon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(inpaintTryon.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.currentResult = payload.resultBase64;
                // on pourrait ici también setSelectedTryon via payload.tryonId
            })
            .addCase(inpaintTryon.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || action.error.message || null;
            });

        // pending → tous les thunks
        builder.addMatcher(
            isAnyOf(
                createTryon.pending,
                fetchTryons.pending,
                fetchTryonById.pending,
                deleteTryon.pending,
                inpaintTryon.pending,
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
                inpaintTryon.rejected,
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
                inpaintTryon.fulfilled,
            ),
            (state) => {
                state.loading = false;
            },
        );
    },
});

export default tryonSlice.reducer;
export const {
    setUpper,
    setLower,
    setDress,
    setUpperLower,
    updateTryon,
    setCurrentResult,
} = tryonSlice.actions;
