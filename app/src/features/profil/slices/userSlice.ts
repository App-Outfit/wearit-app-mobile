// src/store/slices/userSlice.ts
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
    fetchProfile,
    updateProfile,
    fetchCredits,
    fetchReferralCode,
} from '../thunks/userThunks';
import {
    GetProfileResponse,
    GetCreditsResponse,
    GetReferralCodeResponse,
} from '../types/userTypes';

interface UserState {
    user: GetProfileResponse | null;
    creditsHistory: { updated_at: string } | null;
    referral: { referral_code?: string } | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    creditsHistory: null,
    referral: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // --- fulfilled cases ---
        builder
            .addCase(
                fetchProfile.fulfilled,
                (state, { payload }: { payload: GetProfileResponse }) => {
                    state.user = payload;
                },
            )
            .addCase(
                updateProfile.fulfilled,
                (state, { payload }: { payload: GetProfileResponse }) => {
                    state.user = payload;
                },
            )
            .addCase(
                fetchCredits.fulfilled,
                (state, { payload }: { payload: GetCreditsResponse }) => {
                    if (state.user) {
                        state.user.credits = payload.credits;
                    }
                    state.creditsHistory = { updated_at: payload.updated_at };
                },
            )
            .addCase(
                fetchReferralCode.fulfilled,
                (state, { payload }: { payload: GetReferralCodeResponse }) => {
                    state.referral = { referral_code: payload.referral_code };
                    if (state.user) {
                        state.user.referral_code = payload.referral_code;
                    }
                },
            );

        // --- generic pending matcher ---
        builder.addMatcher(
            isAnyOf(
                fetchProfile.pending,
                updateProfile.pending,
                fetchCredits.pending,
                fetchReferralCode.pending,
            ),
            (state) => {
                state.loading = true;
                state.error = null;
            },
        );

        // --- generic rejected matcher ---
        builder.addMatcher(
            isAnyOf(
                fetchProfile.rejected,
                updateProfile.rejected,
                fetchCredits.rejected,
                fetchReferralCode.rejected,
            ),
            (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    action.error.message ||
                    'Unexpected error';
            },
        );

        // --- clear loading on any fulfilled ---
        builder.addMatcher(
            isAnyOf(
                fetchProfile.fulfilled,
                updateProfile.fulfilled,
                fetchCredits.fulfilled,
                fetchReferralCode.fulfilled,
            ),
            (state) => {
                state.loading = false;
            },
        );
    },
});

export default userSlice.reducer;
