// src/services/clothingService.ts
import api from '../../api';
import {
    ClothingUploadPayload,
    ClothingUploadResponse,
    ClothingListResponse,
    CategoryListResponse,
    ClothingDetailResponse,
    ClothingUpdatePayload,
    ClothingUpdateResponse,
    ClothingDeleteResponse,
} from './clothingTypes';

export const clothingService = {
    /** POST /clothing/upload */
    uploadClothing: (
        formData: ClothingUploadPayload,
    ): Promise<ClothingUploadResponse> =>
        api.post('/clothing/upload', formData).then((r) => r.data),

    /** GET /clothing */
    getClothes: (): Promise<ClothingListResponse> =>
        api.get('/clothing').then((r) => r.data),

    /** GET /clothing/categories */
    getCategories: (): Promise<CategoryListResponse> =>
        api.get('/clothing/categories').then((r) => r.data),

    /** GET /clothing/{clothing_id} */
    getClothingById: (clothing_id: string): Promise<ClothingDetailResponse> =>
        api.get(`/clothing/${clothing_id}`).then((r) => r.data),

    /** PATCH /clothing/{clothing_id} */
    updateClothing: (
        clothing_id: string,
        payload: ClothingUpdatePayload,
    ): Promise<ClothingUpdateResponse> =>
        api.patch(`/clothing/${clothing_id}`, payload).then((r) => r.data),

    /** DELETE /clothing/{clothing_id} */
    deleteClothing: (clothing_id: string): Promise<ClothingDeleteResponse> =>
        api.delete(`/clothing/${clothing_id}`).then((r) => r.data),
};
