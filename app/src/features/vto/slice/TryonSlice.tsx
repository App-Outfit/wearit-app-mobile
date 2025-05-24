// src/features/tryon/slices/tryonSlice.ts
import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    EntityState,
} from '@reduxjs/toolkit';

export type TryonData = {
    id: string;
    body_id: string;
    cloth_id: string;
    tryon_url: string;
};

const tryonAdapter = createEntityAdapter<TryonData, string>({
    selectId: (item) => item.id,
});

interface TryonState extends EntityState<TryonData, string> {
    selected: {
        upper: TryonData | null;
        lower: TryonData | null;
        dress: TryonData | null;
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TryonState = tryonAdapter.getInitialState({
    selected: { upper: null, lower: null, dress: null },
    status: 'idle',
    error: null,
});

const tryonSlice = createSlice({
    name: 'tryon',
    initialState,
    reducers: {
        loadTryons(state) {
            state.status = 'loading';
            state.error = null;
        },
        loadTryonsSuccess(state, action: PayloadAction<TryonData[]>) {
            state.status = 'succeeded';
            tryonAdapter.setAll(state, action.payload);
        },
        loadTryonsFailure(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },

        setUpper(state, action: PayloadAction<TryonData>) {
            state.selected.upper = action.payload;
            state.selected.dress = null;
        },
        setLower(state, action: PayloadAction<TryonData>) {
            state.selected.lower = action.payload;
            state.selected.dress = null;
        },
        setDress(state, action: PayloadAction<TryonData>) {
            state.selected.dress = action.payload;
            state.selected.upper = null;
            state.selected.lower = null;
        },
    },
});

export const {
    loadTryons,
    loadTryonsSuccess,
    loadTryonsFailure,
    setUpper,
    setLower,
    setDress,
} = tryonSlice.actions;

export default tryonSlice.reducer;

export const {
    selectAll: selectAllTryons,
    selectById: selectTryonById,
    selectIds: selectTryonIds,
} = tryonAdapter.getSelectors<{
    tryon: TryonState;
}>((state) => state.tryon);
