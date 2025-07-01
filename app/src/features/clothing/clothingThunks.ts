// src/store/thunks/clothingThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { clothingService } from './clothingService';
import {
    ClothingUploadPayload,
    ClothingUploadResponse,
    ClothingListResponse,
    CategoryListResponse,
    ClothingDetailResponse,
    ClothingUpdatePayload,
    ClothingUpdateResponse,
    ClothingDeleteResponse,
} from './clothingTypes';

export const uploadClothing = createAsyncThunk<
    ClothingUploadResponse,
    ClothingUploadPayload,
    { rejectValue: string }
>('clothing/upload', async (payload, { rejectWithValue }) => {
    try {
        return await clothingService.uploadClothing(payload);
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message ?? 'Upload failed');
    }
});

export const fetchClothes = createAsyncThunk<ClothingListResponse>(
    'clothing/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await clothingService.getClothes();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch clothes failed',
            );
        }
    },
);

export const fetchCategories = createAsyncThunk<CategoryListResponse>(
    'clothing/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            return await clothingService.getCategories();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch categories failed',
            );
        }
    },
);

export const fetchClothingDetail = createAsyncThunk<
    ClothingDetailResponse,
    string
>('clothing/fetchDetail', async (clothing_id, { rejectWithValue }) => {
    try {
        return await clothingService.getClothingById(clothing_id);
    } catch (err: any) {
        return rejectWithValue(
            err.response?.data?.message || 'Fetch detail failed',
        );
    }
});

export const updateClothing = createAsyncThunk<
    ClothingUpdateResponse,
    { clothing_id: string; payload: ClothingUpdatePayload }
>('clothing/update', async ({ clothing_id, payload }, { rejectWithValue }) => {
    try {
        return await clothingService.updateClothing(clothing_id, payload);
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
});

export const deleteClothing = createAsyncThunk<ClothingDeleteResponse, string>(
    'clothing/delete',
    async (clothing_id, { rejectWithValue }) => {
        try {
            return await clothingService.deleteClothing(clothing_id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Delete failed',
            );
        }
    },
);
