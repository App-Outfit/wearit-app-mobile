import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
    token: localStorage.getItem('token'),
    status: 'idle',
    error: null,
    message: null,
    resetValid: null,
};

export const signupUser = createAsyncThunk<
    AuthResponse,
    SignupData,
    { rejectValue: string }
>('auth/signup', async (data, { rejectWithValue }) => {
    try {
        return await authService.signup(data);
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
        return await authService.login(creds);
    } catch (e: any) {
        return rejectWithValue(e.response?.data?.detail || e.message);
    }
});

export const logoutUser = createAsyncThunk<void>(
    'auth/logout',
    async (_, { dispatch }) => {
        await authService.logout();
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
            localStorage.removeItem('token');
            state.status = 'idle';
            state.message = null;
            state.error = null;
            state.resetValid = null;
        },
    },
    extraReducers: (builder) => {
        // signup & login share logic
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
                        localStorage.setItem('token', action.payload.token);
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
            .addCase(deleteAccount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
                state.token = null;
                localStorage.removeItem('token');
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // forgot
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

        // verify
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

        // reset
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
