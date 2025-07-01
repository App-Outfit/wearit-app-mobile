// src/store/thunks/userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';
import { UpdateProfileInput } from '../types/userTypes';

/** GET  /user/profile */
export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getProfile();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to fetch profile',
            );
        }
    },
);

/** PATCH /user/profile */
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (data: UpdateProfileInput, { rejectWithValue }) => {
        try {
            return await userService.updateProfile(data);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to update profile',
            );
        }
    },
);

/** GET  /user/credits */
export const fetchCredits = createAsyncThunk(
    'user/fetchCredits',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getCredits();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to fetch credits',
            );
        }
    },
);

/** GET  /user/referral/code */
export const fetchReferralCode = createAsyncThunk(
    'user/fetchReferralCode',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getReferralCode();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to fetch referral code',
            );
        }
    },
);
