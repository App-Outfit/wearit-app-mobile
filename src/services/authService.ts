// src/services/authService.ts
import api from './api';

export interface AuthResponse {
    token: string;
    message: string;
}
export interface VerifyResponse {
    valid: boolean;
}
export interface SignupData {
    name: string;
    email: string;
    password: string;
    answers: Record<string, string>;
}

export const authService = {
    signup: (data: SignupData) =>
        api.post<AuthResponse>('/auth/signup', data).then((r) => r.data),

    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

    logout: () =>
        api.post<{ message: string }>('/auth/logout').then((r) => r.data),

    getGoogleUrl: () =>
        api
            .get<{ auth_url: string }>('/auth/google')
            .then((r) => r.data.auth_url),

    deleteAccount: () =>
        api.delete<{ message: string }>('/auth/account').then((r) => r.data),

    forgotPassword: (email: string) =>
        api
            .post<{ message: string }>('/auth/forgot-password', { email })
            .then((r) => r.data),

    verifyResetCode: (payload: { email: string; code: string }) =>
        api
            .post<VerifyResponse>('/auth/forgot-password/verify', payload)
            .then((r) => r.data),

    resetPassword: (payload: {
        email: string;
        code: string;
        new_password: string;
    }) =>
        api
            .post<{ message: string }>('/auth/reset-password', payload)
            .then((r) => r.data),
};
