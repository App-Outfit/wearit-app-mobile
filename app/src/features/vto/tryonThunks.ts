// src/store/thunks/tryonThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { tryonService } from './tryonService';
import {
    TryonCreatePayload,
    TryonCreateResponse,
    TryonListResponse,
    TryonDetailResponse,
    TryonDeleteResponse,
    InpaintPayload,
} from './tryonTypes';

import {
    loadAssetBase64,
    inpaintRegion,
    inpaintUpper,
    inpaintLower,
    inpaintDress,
} from './service/InpaintingService';

/** Create a new tryon */
export const createTryon = createAsyncThunk<
    TryonCreateResponse,
    TryonCreatePayload
>('tryon/create', async (payload, { rejectWithValue }) => {
    try {
        return await tryonService.createTryon(payload);
    } catch (err: any) {
        return rejectWithValue(
            err.response?.data?.message || 'Create try-on failed',
        );
    }
});

/** Fetch all tryons */
export const fetchTryons = createAsyncThunk<TryonListResponse>(
    'tryon/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await tryonService.getAllTryons();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch try-ons failed',
            );
        }
    },
);

/** Fetch one tryon by ID */
export const fetchTryonById = createAsyncThunk<TryonDetailResponse, string>(
    'tryon/fetchById',
    async (tryon_id, { rejectWithValue }) => {
        try {
            return await tryonService.getTryonById(tryon_id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch try-on detail failed',
            );
        }
    },
);

/** Delete a tryon */
export const deleteTryon = createAsyncThunk<TryonDeleteResponse, string>(
    'tryon/delete',
    async (tryon_id, { rejectWithValue }) => {
        try {
            return await tryonService.deleteTryon(tryon_id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Delete try-on failed',
            );
        }
    },
);

export const inpaintTryon = createAsyncThunk<
    { tryonId: string; resultBase64: string },
    InpaintPayload
>(
    'tryon/inpaint',
    async (
        { currentBody, tryonId, outputUrl, maskBase64, type },
        { rejectWithValue },
    ) => {
        try {
            const tryon64 = await loadAssetBase64(outputUrl);
            // const body64 = await loadAssetBase64(currentBody);

            let result: string;
            switch (type) {
                case 'upper':
                    result = await inpaintUpper(
                        currentBody,
                        tryon64,
                        maskBase64,
                    );
                    break;
                case 'lower':
                    result = await inpaintLower(
                        currentBody,
                        tryon64,
                        maskBase64,
                    );
                    break;
                case 'dress':
                    result = await inpaintDress(
                        currentBody,
                        tryon64,
                        maskBase64,
                    );
                    break;
                default:
                    throw new Error(`Unknown inpaint type: ${type}`);
            }

            return { tryonId, resultBase64: result };
        } catch (err: any) {
            return rejectWithValue(err.message || 'Inpainting failed');
        }
    },
);
