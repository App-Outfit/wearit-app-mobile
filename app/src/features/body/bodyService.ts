// src/services/bodyService.ts

import api from '../../api';
import {
    BodyUploadPayload,
    BodyUploadResponse,
    BodyListResponse,
    BodyCurrentResponse,
    BodyMasksResponse,
    DeleteBodyResponse,
} from './bodyTypes';

export const bodyService = {
    /** POST /body/upload */
    uploadBody: (formData: BodyUploadPayload): Promise<BodyUploadResponse> => {
        return api
            .post('/body/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((r) => {
                return r.data;
            });
    },

    /** GET /body/list */
    getAllBodies: (): Promise<BodyListResponse> =>
        api.get('/body/list').then((r) => r.data),

    /** GET /body/current */
    getCurrentBody: (): Promise<BodyCurrentResponse> =>
        api.get('/body/current').then((r) => r.data),

    /** GET /body/{body_id}/masks */
    getBodyMasks: (body_id: string): Promise<BodyMasksResponse> =>
        api.get(`/body/${body_id}/masks`).then((r) => r.data),

    /** DELETE /body/{body_id} */
    deleteBody: (body_id: string): Promise<DeleteBodyResponse> =>
        api.delete(`/body/${body_id}`).then((r) => r.data),
};
