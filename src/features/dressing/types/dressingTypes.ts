// src/features/dressing/types/dressingTypes.ts
import { components } from '../../../types/api';

/** ————— 1) Réponses (sont bien présentes dans components.schemas) ————— */
export type ClothCreateResponse = components['schemas']['ClothCreateResponse'];
export type ClothResponseSchema = components['schemas']['ClothResponse'];
export type ClothListResponse = components['schemas']['ClothListResponse'];
export type ClothDeleteResponse = components['schemas']['ClothDeleteResponse'];

export type CategoryResponse = components['schemas']['CategoryResponse'];
export type CategoryListResponse =
    components['schemas']['CategoryListResponse'];

/** ————— 2) Types front-friendly ————— */
export interface ClothItem {
    id: string;
    name: string;
    type: string;
    image_url: string;
    tags: string[];
}

/** simplification pour la liste */
export type ClothList = ClothItem[];
export type CategoryItem = CategoryResponse;
export type CategoryList = CategoryItem[];

/** ————— 3) Payload pour l’upload (FormData) ————— */
export interface NewClothPayload {
    name: string;
    type: string;
    tags: string[];
    file: File;
}

export interface NewCategoryPayload {
    name: string;
}
