// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {
    authService,
    AuthResponse,
    VerifyResponse,
    SignupData,
} from '../services/authService';
import { parseApiError } from '../utils/apiError';

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

/**
 * Charge le token depuis AsyncStorage au démarrage de l'app
 */
export const loadToken = createAsyncThunk<string | null>(
    'auth/loadToken',
    async () => AsyncStorage.getItem('token'),
);

/**
 * Inscription
 */
export const signupUser = createAsyncThunk<
    AuthResponse,
    SignupData,
    { rejectValue: string }
>('auth/signup', async (data, { rejectWithValue }) => {
    try {
        const resp = await authService.signup(data);
        await AsyncStorage.setItem('token', resp.token);
        return resp;
    } catch (e: unknown) {
        return rejectWithValue(parseApiError(e));
    }
});

/**
 * Connexion
 */
export const loginUser = createAsyncThunk<
    AuthResponse,
    { email: string; password: string },
    { rejectValue: string }
>('auth/login', async (creds, { rejectWithValue }) => {
    try {
        const resp = await authService.login(creds);
        await AsyncStorage.setItem('token', resp.token);
        return resp;
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            const status = e.response?.status;
            if (status === 400 || status === 401) {
                return rejectWithValue('E-mail ou mot de passe incorrect');
            }
            return rejectWithValue(parseApiError(e));
        }
        return rejectWithValue('Une erreur est survenue');
    }
});

/**
 * Déconnexion
 */
export const logoutUser = createAsyncThunk<void>(
    'auth/logout',
    async (_, { dispatch }) => {
        await authService.logout();
        await AsyncStorage.removeItem('token');
        dispatch(logout());
    },
);

/**
 * Suppression de compte
 */
export const deleteAccount = createAsyncThunk<
    { message: string },
    void,
    { rejectValue: string }
>('auth/deleteAccount', async (_, { rejectWithValue }) => {
    try {
        return await authService.deleteAccount();
    } catch (e: unknown) {
        return rejectWithValue(parseApiError(e));
    }
});

/**
 * Mot de passe oublié (envoi du code)
 */
export const forgotPassword = createAsyncThunk<
    { message: string },
    string,
    { rejectValue: string }
>('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        return await authService.forgotPassword(email);
    } catch (e: unknown) {
        return rejectWithValue(parseApiError(e));
    }
});

/**
 * Vérification du code de reset
 */
export const verifyReset = createAsyncThunk<
    VerifyResponse,
    { email: string; code: string },
    { rejectValue: string }
>('auth/verifyReset', async (payload, { rejectWithValue }) => {
    try {
        const resp = await authService.verifyResetCode(payload);
        if (!resp.valid) {
            return rejectWithValue('Code de réinitialisation invalide');
        }
        return resp;
    } catch (e: unknown) {
        return rejectWithValue(parseApiError(e));
    }
});

/**
 * Réinitialisation du mot de passe
 */
export const resetPassword = createAsyncThunk<
    { message: string },
    { email: string; code: string; new_password: string },
    { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
    try {
        return await authService.resetPassword(payload);
    } catch (e: unknown) {
        return rejectWithValue(parseApiError(e));
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.status = 'idle';
            state.message = null;
            state.error = null;
            state.resetValid = null;
        },
        clearStatus(state) {
            state.status = 'idle';
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        // signup & login partagent la même logique de transition d'états
        [signupUser, loginUser].forEach((thunk) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(
                    thunk.fulfilled,
                    (state, action: PayloadAction<AuthResponse>) => {
                        state.status = 'succeeded';
                        state.token = action.payload.token;
                        state.message = action.payload.message;
                    },
                )
                .addCase(thunk.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload || 'Erreur inconnue';
                });
        });

        builder.addCase(logoutUser.fulfilled, (state) => {
            state.status = 'idle';
        });

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
                state.error = action.payload as string;
            });

        // deleteAccount
        builder
            .addCase(deleteAccount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.message = payload.message;
                state.token = null;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

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
                state.error = action.payload as string;
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
                state.error = action.payload as string;
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
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearStatus } = authSlice.actions;
export default authSlice.reducer;
