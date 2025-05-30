// src/store/thunks/favoriteThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { favoriteService } from './favoriteService';
import {
    FavoriteCreatePayload,
    FavoriteResponse,
    FavoriteListResponse,
    FavoriteDeleteResponse,
} from './favoriteTypes';

/** Ajoute un favori */
export const addFavorite = createAsyncThunk<
    FavoriteResponse,
    FavoriteCreatePayload
>('favorites/add', async (payload, { rejectWithValue }) => {
    try {
        return await favoriteService.addFavorite(payload);
    } catch (err: any) {
        return rejectWithValue(
            err.response?.data?.message || 'Add favorite failed',
        );
    }
});

/** Récupère tous les favoris */
export const fetchFavorites = createAsyncThunk<FavoriteListResponse>(
    'favorites/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await favoriteService.getFavorites();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch favorites failed',
            );
        }
    },
);

/** Récupère un favori par ID */
export const fetchFavoriteById = createAsyncThunk<FavoriteResponse, string>(
    'favorites/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await favoriteService.getFavoriteById(id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch favorite failed',
            );
        }
    },
);

/** Supprime un favori */
export const deleteFavorite = createAsyncThunk<FavoriteDeleteResponse, string>(
    'favorites/delete',
    async (id, { rejectWithValue }) => {
        try {
            return await favoriteService.deleteFavorite(id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Delete favorite failed',
            );
        }
    },
);
