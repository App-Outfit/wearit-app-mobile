// src/services/tryonService.ts

import api from '../../api';
import {
    TryonCreatePayload,
    TryonCreateResponse,
    TryonListResponse,
    TryonDetailResponse,
    TryonDeleteResponse,
} from './tryonTypes';

export const tryonService = {
    /** POST /api/v1/tryon */
    createTryon: (payload: TryonCreatePayload): Promise<TryonCreateResponse> =>
        api.post('/api/v1/tryon', payload).then((r) => r.data),

    /** GET /api/v1/tryon */
    getAllTryons: (): Promise<TryonListResponse> =>
        api.get('/api/v1/tryon').then((r) => r.data),

    /** GET /api/v1/tryon/{tryon_id} */
    getTryonById: (tryon_id: string): Promise<TryonDetailResponse> =>
        api.get(`/api/v1/tryon/${tryon_id}`).then((r) => r.data),

    /** DELETE /api/v1/tryon/{tryon_id} */
    deleteTryon: (tryon_id: string): Promise<TryonDeleteResponse> =>
        api.delete(`/api/v1/tryon/${tryon_id}`).then((r) => r.data),
};
