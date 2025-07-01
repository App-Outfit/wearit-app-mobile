// src/services/favoriteService.ts
import api from '../../api';
import {
    FavoriteCreatePayload,
    FavoriteResponse,
    FavoriteListResponse,
    FavoriteDeleteResponse,
} from './favoriteTypes';

export const favoriteService = {
    /** POST /api/v1/favorites */
    addFavorite: (payload: FavoriteCreatePayload): Promise<FavoriteResponse> =>
        api.post('/api/v1/favorites', payload).then((r) => r.data),

    /** GET /api/v1/favorites */
    getFavorites: (): Promise<FavoriteListResponse> =>
        api.get('/api/v1/favorites').then((r) => r.data),

    /** GET /api/v1/favorites/{favorite_id} */
    getFavoriteById: (id: string): Promise<FavoriteResponse> =>
        api.get(`/api/v1/favorites/${id}`).then((r) => r.data),

    /** DELETE /api/v1/favorites/{favorite_id} */
    deleteFavorite: (id: string): Promise<FavoriteDeleteResponse> =>
        api.delete(`/api/v1/favorites/${id}`).then((r) => r.data),
};
