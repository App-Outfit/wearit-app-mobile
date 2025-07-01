// src/store/slices/favoriteSlice.ts
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
    addFavorite,
    fetchFavorites,
    fetchFavoriteById,
    deleteFavorite,
} from './favoriteThunks';
import { FavoriteItem, FavoriteResponse } from './favoriteTypes';

export interface FavoriteState {
    favorites: FavoriteItem[];
    selectedFavorite: FavoriteResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: FavoriteState = {
    favorites: [],
    selectedFavorite: null,
    loading: false,
    error: null,
};

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // liste
        builder.addCase(fetchFavorites.fulfilled, (state, { payload }) => {
            state.favorites = payload.favorites;
        });
        // créer
        builder.addCase(addFavorite.fulfilled, (state, { payload }) => {
            state.favorites.unshift(payload);
        });
        // détail
        builder.addCase(fetchFavoriteById.fulfilled, (state, { payload }) => {
            state.selectedFavorite = payload;
            // si besoin : l'ajouter à la liste
            if (!state.favorites.find((f) => f.id === payload.id)) {
                state.favorites.push(payload);
            }
        });
        // suppression
        builder.addCase(deleteFavorite.fulfilled, (state, { meta }) => {
            state.favorites = state.favorites.filter((f) => f.id !== meta.arg);
            if (state.selectedFavorite?.id === meta.arg) {
                state.selectedFavorite = null;
            }
        });

        // pending
        builder.addMatcher(
            isAnyOf(
                addFavorite.pending,
                fetchFavorites.pending,
                fetchFavoriteById.pending,
                deleteFavorite.pending,
            ),
            (state) => {
                state.loading = true;
                state.error = null;
            },
        );
        // rejected
        builder.addMatcher(
            isAnyOf(
                addFavorite.rejected,
                fetchFavorites.rejected,
                fetchFavoriteById.rejected,
                deleteFavorite.rejected,
            ),
            (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || action.error.message || null;
            },
        );
        // fulfilled clear loading
        builder.addMatcher(
            isAnyOf(
                addFavorite.fulfilled,
                fetchFavorites.fulfilled,
                fetchFavoriteById.fulfilled,
                deleteFavorite.fulfilled,
            ),
            (state) => {
                state.loading = false;
            },
        );
    },
});

export default favoriteSlice.reducer;
