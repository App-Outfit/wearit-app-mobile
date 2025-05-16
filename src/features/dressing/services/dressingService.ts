import api from '../../../api';
import {
    NewClothPayload,
    ClothItem,
    ClothList,
    ClothCreateResponse,
    ClothDeleteResponse,
    CategoryListResponse,
    CategoryResponse,
    NewCategoryPayload,
    CategoryList,
} from '../types/dressingTypes';

const BASE = '/wardrobe';

export const dressingService = {
    listClothes: (type: string): Promise<ClothList> =>
        api
            .get<{ clothes: ClothItem[] }>(`${BASE}/clothes/${type}`)
            .then((r) => r.data.clothes),

    getCloth: (id: string): Promise<ClothItem> =>
        api.get<ClothItem>(`${BASE}/cloth/${id}`).then((r) => r.data),

    createCloth: (payload: NewClothPayload): Promise<ClothCreateResponse> => {
        const form = new FormData();
        form.append('name', payload.name);
        form.append('type', payload.type);
        payload.tags.forEach((t) => form.append('tags', t));
        form.append('file', payload.file);

        return api
            .post<ClothCreateResponse>(BASE + '/', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((r) => r.data);
    },

    deleteCloth: (id: string): Promise<ClothDeleteResponse> =>
        api.delete<ClothDeleteResponse>(`${BASE}/${id}`).then((r) => r.data),

    createCategory: (
        payload: NewCategoryPayload,
    ): Promise<CategoryResponse> => {
        const form = new FormData();
        form.append('name', payload.name);

        return api
            .post<CategoryResponse>(`${BASE}/category`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((r) => r.data);
    },

    listCategories: (): Promise<CategoryListResponse> =>
        api.get<CategoryListResponse>(`${BASE}/categories`).then((r) => r.data),
};
