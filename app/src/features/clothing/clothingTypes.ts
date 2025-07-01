// src/types/body.types.ts

import { paths } from '../../types/api';

// 1️⃣ Upload Clothing (multipart/form-data)
export type ClothingUploadPayload = {
    category: string; // e.g., 'tops', 'bottoms', etc.
    cloth_type: string; // e.g., 'shirt', 'pants', etc.
    name?: string; // Optional clothing name
    file: FormData;
};

export type ClothingUploadResponse =
    paths['/api/v1/clothing/upload']['post']['responses']['200']['content']['application/json'];

// 2️⃣ List Clothes
export type ClothingListResponse =
    paths['/api/v1/clothing']['get']['responses']['200']['content']['application/json'];
export type ClothingItem = ClothingListResponse['clothes'][number];

// 3️⃣ List Categories
export type CategoryListResponse =
    paths['/api/v1/clothing/categories']['get']['responses']['200']['content']['application/json'];

// 4️⃣ Get Clothing Detail
export type ClothingDetailResponse =
    paths['/api/v1/clothing/{clothing_id}']['get']['responses']['200']['content']['application/json'];

// 5️⃣ Update Clothing
export type ClothingUpdatePayload =
    paths['/api/v1/clothing/{clothing_id}']['patch']['requestBody']['content']['application/json'];
export type ClothingUpdateResponse =
    paths['/api/v1/clothing/{clothing_id}']['patch']['responses']['200']['content']['application/json'];

// 6️⃣ Delete Clothing
export type ClothingDeleteResponse =
    paths['/api/v1/clothing/{clothing_id}']['delete']['responses']['200']['content']['application/json'];
