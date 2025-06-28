import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchClothes } from './explorerThunk';
// import type { RootState } from './store';

export type ExplorerState = {
    loading: boolean;
    error: string | null;
    products: any[];
    query: string;
    bookmark: string;
    csrf_token?: string;
};

const initialState: ExplorerState = {
    loading: false,
    error: null,
    products: [],
    query: '',
    bookmark: '',
    csrf_token: undefined,
};

const explorerSlice = createSlice({
    name: 'explorer',
    initialState,
    reducers: {
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        resetExplorerState(state) {
            state.loading = false;
            state.error = null;
            state.products = [];
            state.query = '';
            state.bookmark = '';
            state.csrf_token = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchClothes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchClothes.fulfilled, (state, action) => {
                state.loading = false;
                // Si action.meta.arg.bookmark existe, on est en "load more" → on concatène
                if (action.meta.arg.bookmark) {
                    state.products = [
                        ...state.products,
                        ...action.payload.products,
                    ];
                } else {
                    // Sinon (requête initiale) on remplace
                    state.products = action.payload.products;
                }
                state.bookmark = action.payload.bookmark || '';
                state.csrf_token = action.payload.csrf_token;
                state.query = action.meta.arg.query || '';
            })
            .addCase(searchClothes.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    action.error.message ||
                    'Failed to load products';
            });
    },
});

export const { setQuery, resetExplorerState } = explorerSlice.actions;
export default explorerSlice.reducer;
