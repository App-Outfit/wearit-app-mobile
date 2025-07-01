// src/features/auth/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import api from '../../../api'; // votre axios instance
import { parseApiError } from '../../../utils/apiError';

import * as jwtDecodeModule from 'jwt-decode';
import { JwtPayload } from 'jwt-decode';

import type {
    SinginData,
    SignupData,
    ForgotPasswordRequest,
    VerifyResetCodeRequest,
    ResetPasswordRequest,
    AuthResponse,
    AuthSignupResponse,
    ForgotPasswordResponse,
    VerifyResetCodeResponse,
    ResetPasswordResponse,
} from '../types/authTypes';

interface AuthState {
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    message: string | null;
    resetValid: boolean | null;
}

const initialState: AuthState = {
    token: null,
    status: 'idle',
    error: null,
    message: null,
    resetValid: null,
};

export const loadToken = createAsyncThunk<string | null>(
    'auth/loadToken',
    async () => {
        return AsyncStorage.getItem('token');
    },
);

export function isTokenExpired(token: string | null): boolean {
    if (token == null) return true;

    try {
        // On déstructure exp à partir du payload
        //   const { exp } = jwtDecode(token);
        const { exp } = jwtDecodeModule.jwtDecode<JwtPayload>(token);

        if (!exp) {
            console.log('Token sans date d’expiration, considéré comme expiré');
            return true;
        }

        const isExpired = Date.now() >= exp * 1000;
        console.log('exp:', exp, '→ expired ?', isExpired);
        return isExpired;
    } catch (e) {
        console.error('Erreur lors du décodage du token', e);
        return true;
    }
}

export const signupUser = createAsyncThunk<
    AuthSignupResponse,
    SignupData,
    { rejectValue: string }
>('auth/signup', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post<AuthSignupResponse>(
            '/auth/signup',
            payload,
        );
        await AsyncStorage.setItem('token', data.token);
        return data;
    } catch (err: unknown) {
        return rejectWithValue(parseApiError(err));
    }
});

export const loginUser = createAsyncThunk<
    AuthResponse,
    SinginData,
    { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post<AuthResponse>(
            '/auth/login',
            credentials,
        );
        await AsyncStorage.setItem('token', data.token);
        return data;
    } catch (err: unknown) {
        if (
            axios.isAxiosError(err) &&
            (err.response?.status === 400 || err.response?.status === 401)
        ) {
            return rejectWithValue('E-mail ou mot de passe incorrect');
        }
        return rejectWithValue(parseApiError(err));
    }
});

export const forgotPassword = createAsyncThunk<
    ForgotPasswordResponse,
    ForgotPasswordRequest,
    { rejectValue: string }
>('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
    try {
        const { data } = await api.post<ForgotPasswordResponse>(
            '/auth/forgot-password',
            { email },
        );
        return data;
    } catch (err: unknown) {
        return rejectWithValue(parseApiError(err));
    }
});

export const verifyReset = createAsyncThunk<
    VerifyResetCodeResponse,
    VerifyResetCodeRequest,
    { rejectValue: string }
>('auth/verifyReset', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post<VerifyResetCodeResponse>(
            '/auth/forgot-password/verify',
            payload,
        );
        if (!data.valid) return rejectWithValue('Code invalide');
        return data;
    } catch (err: unknown) {
        return rejectWithValue(parseApiError(err));
    }
});

export const resetPassword = createAsyncThunk<
    ResetPasswordResponse,
    ResetPasswordRequest,
    { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post<ResetPasswordResponse>(
            '/auth/reset-password',
            payload,
        );
        return data;
    } catch (err: unknown) {
        return rejectWithValue(parseApiError(err));
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // reset local state
        logout(state) {
            state.token = null;
            state.status = 'idle';
            state.error = null;
            state.message = null;
            state.resetValid = null;
        },
        // permet de clear erreur/message
        clearStatus(state) {
            state.status = 'idle';
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        // loadToken
        builder
            .addCase(loadToken.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loadToken.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.token = payload;
            })
            .addCase(loadToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            });

        // signup & login partagent la même logique
        [signupUser, loginUser].forEach((thunk) =>
            builder
                .addCase(thunk.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(
                    thunk.fulfilled,
                    (state, { payload }: PayloadAction<AuthResponse>) => {
                        state.status = 'succeeded';
                        state.token = payload.token;
                        state.message = payload.message;
                    },
                )
                .addCase(thunk.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload ?? 'Erreur inconnue';
                }),
        );

        // forgotPassword
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.message = payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload!;
            });

        // verifyReset
        builder
            .addCase(verifyReset.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(verifyReset.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.resetValid = payload.valid;
            })
            .addCase(verifyReset.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload!;
            });

        // resetPassword
        builder
            .addCase(resetPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.message = payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload!;
            });
    },
});

export const { logout, clearStatus } = authSlice.actions;
export default authSlice.reducer;
