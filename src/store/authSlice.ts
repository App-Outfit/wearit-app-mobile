import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    authService,
    AuthResponse,
    VerifyResponse,
    SignupData,
} from '../services/authService';

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
        return await AsyncStorage.getItem('token');
    },
);

export const signupUser = createAsyncThunk<
    AuthResponse,
    SignupData,
    { rejectValue: string }
>('auth/signup', async (data, { rejectWithValue }) => {
    try {
        const resp = await authService.signup(data);
        await AsyncStorage.setItem('token', resp.token);
        return resp;
    } catch (e: any) {
        return rejectWithValue(e.response?.data?.detail || e.message);
    }
});

export const loginUser = createAsyncThunk<
    AuthResponse,
    { email: string; password: string },
    { rejectValue: string }
>('auth/login', async (creds, { rejectWithValue }) => {
    try {
        const resp = await authService.login(creds);
        await AsyncStorage.setItem('token', resp.token);
        return resp;
    } catch (e: any) {
        return rejectWithValue(e.response?.data?.detail || e.message);
    }
});

export const logoutUser = createAsyncThunk<void>(
    'auth/logout',
    async (_, { dispatch }) => {
        await authService.logout();
        await AsyncStorage.removeItem('token');
        dispatch(logout());
    },
);

export const deleteAccount = createAsyncThunk<
    { message: string },
    void,
    { rejectValue: string }
>('auth/deleteAccount', async (_, { rejectWithValue }) => {
    try {
        return await authService.deleteAccount();
    } catch (e: any) {
        return rejectWithValue(e.response?.data?.detail || e.message);
    }
});

export const forgotPassword = createAsyncThunk<
    { message: string },
    string,
    { rejectValue: string }
>('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        return await authService.forgotPassword(email);
    } catch (e: any) {
        return rejectWithValue(e.response?.data?.detail || e.message);
    }
});

export const verifyReset = createAsyncThunk<
    VerifyResponse,
    { email: string; code: string },
    { rejectValue: string }
>('auth/verifyReset', async (payload, { rejectWithValue }) => {
    try {
        return await authService.verifyResetCode(payload);
    } catch (e: any) {
        return rejectWithValue(e.response?.data?.detail || e.message);
    }
});

export const resetPassword = createAsyncThunk<
    { message: string },
    { email: string; code: string; new_password: string },
    { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
    try {
        return await authService.resetPassword(payload);
    } catch (e: any) {
        return rejectWithValue(e.response?.data?.detail || e.message);
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
    },
    extraReducers: (builder) => {
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
                    state.error = action.payload as string;
                });
        });

        builder.addCase(logoutUser.fulfilled, (state) => {
            state.status = 'idle';
        });

        builder
            .addCase(loadToken.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loadToken.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
            })
            .addCase(loadToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(deleteAccount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
                state.token = null;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(forgotPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(verifyReset.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(verifyReset.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.resetValid = action.payload.valid;
            })
            .addCase(verifyReset.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(resetPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
