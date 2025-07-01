import api from '../../../api';
import {
    GetProfileResponse,
    UpdateProfileInput,
    UpdateProfileResponse,
    GetCreditsResponse,
    GetReferralCodeResponse,
} from '../types/userTypes';

export const userService = {
    /** GET /user/profile */
    getProfile: (): Promise<GetProfileResponse> =>
        api.get('/user/profile').then((r) => r.data),

    /** PATCH /user/profile */
    updateProfile: (data: UpdateProfileInput): Promise<UpdateProfileResponse> =>
        api.patch('/user/profile', data).then((r) => r.data),

    /** GET /user/credits */
    getCredits: (): Promise<GetCreditsResponse> =>
        api.get('/user/credits').then((r) => r.data),

    /** GET /user/referral/code */
    getReferralCode: (): Promise<GetReferralCodeResponse> =>
        api.get('/user/referral/code').then((r) => r.data),
};
