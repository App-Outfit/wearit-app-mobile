// src/services/authService.ts
import api from '../../../api';
import {
    SinginData,
    AuthResponse,
    SignupData,
    AuthSignupResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    VerifyResetCodeRequest,
    VerifyResetCodeResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from '../types/authTypes';

export const authService = {
    /** POST /auth/login */
    login: (creds: SinginData): Promise<AuthResponse> =>
        api.post('/auth/login', creds).then((r) => r.data),

    /** POST /auth/signup */
    signup: (data: SignupData): Promise<AuthSignupResponse> =>
        api.post('/auth/signup', data).then((r) => r.data),

    /** POST /auth/forgot-password */
    forgotPassword: (
        body: ForgotPasswordRequest,
    ): Promise<ForgotPasswordResponse> =>
        api.post('/auth/forgot-password', body).then((r) => r.data),

    /** POST /auth/forgot-password/verify */
    verifyResetCode: (
        body: VerifyResetCodeRequest,
    ): Promise<VerifyResetCodeResponse> =>
        api.post('/auth/forgot-password/verify', body).then((r) => r.data),

    /** POST /auth/reset-password */
    resetPassword: (
        body: ResetPasswordRequest,
    ): Promise<ResetPasswordResponse> =>
        api.post('/auth/reset-password', body).then((r) => r.data),
};
