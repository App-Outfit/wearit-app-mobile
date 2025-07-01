// src/store/thunks/bodyThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { bodyService } from './bodyService';
import {
    BodyUploadPayload,
    BodyUploadResponse,
    BodyListResponse,
    BodyCurrentResponse,
    BodyMasksResponse,
    DeleteBodyResponse,
} from './bodyTypes';

/** Upload + start preprocessing */
export const uploadBody = createAsyncThunk<
    BodyUploadResponse,
    BodyUploadPayload
>('body/upload', async (formData, { rejectWithValue }) => {
    try {
        return await bodyService.uploadBody(formData);
    } catch (err: any) {
        console.log('error');
        return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
});

/** Fetch all bodies */
export const fetchBodies = createAsyncThunk<BodyListResponse>(
    'body/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await bodyService.getAllBodies();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch bodies failed',
            );
        }
    },
);

/** Fetch current (latest) body */
export const fetchCurrentBody = createAsyncThunk<BodyCurrentResponse>(
    'body/fetchCurrent',
    async (_, { rejectWithValue }) => {
        try {
            return await bodyService.getCurrentBody();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch current body failed',
            );
        }
    },
);

/** Fetch masks for a given body */
export const fetchBodyMasks = createAsyncThunk<BodyMasksResponse, string>(
    'body/fetchMasks',
    async (body_id, { rejectWithValue }) => {
        try {
            return await bodyService.getBodyMasks(body_id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Fetch masks failed',
            );
        }
    },
);

/** Delete a body */
export const deleteBody = createAsyncThunk<DeleteBodyResponse, string>(
    'body/delete',
    async (body_id, { rejectWithValue }) => {
        try {
            return await bodyService.deleteBody(body_id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Delete body failed',
            );
        }
    },
);
