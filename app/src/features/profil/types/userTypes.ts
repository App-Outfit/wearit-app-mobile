// src/types/user.types.ts
import { paths } from '../../../types/api.ts';

// 1. GET /user/profile
export type GetProfileResponse =
    paths['/api/v1/user/profile']['get']['responses']['200']['content']['application/json'];

// 2. PATCH /user/profile
export type UpdateProfileInput =
    paths['/api/v1/user/profile']['patch']['requestBody']['content']['application/json'];
export type UpdateProfileResponse =
    paths['/api/v1/user/profile']['patch']['responses']['200']['content']['application/json'];

// 3. GET /user/credits
export type GetCreditsResponse =
    paths['/api/v1/user/credits']['get']['responses']['200']['content']['application/json'];

// 4. GET /user/referral/code
export type GetReferralCodeResponse =
    paths['/api/v1/user/referral/code']['get']['responses']['200']['content']['application/json'];
