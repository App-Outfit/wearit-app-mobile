import { components, paths } from '../../../types/api';

/** 1) Requêtes (payloads) */
export type SinginData = components['schemas']['AuthLogin'];
export type SignupData = components['schemas']['AuthSignup'];
export type ForgotPasswordRequest =
    components['schemas']['ForgotPasswordRequest'];
export type VerifyResetCodeRequest =
    components['schemas']['VerifyResetCodeRequest'];
export type ResetPasswordRequest =
    components['schemas']['ResetPasswordRequest'];

/** 2) Réponses */
export type AuthResponse = components['schemas']['AuthLoginResponse'];
export type AuthSignupResponse = components['schemas']['AuthSignupResponse'];
export type ForgotPasswordResponse =
    components['schemas']['ForgotPasswordResponse'];
export type VerifyResetCodeResponse =
    components['schemas']['VerifyResetCodeResponse'];
export type ResetPasswordResponse =
    components['schemas']['ResetPasswordResponse'];
