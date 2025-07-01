// src/types/tryon.types.ts

import { paths } from '../../types/api';

// 1️⃣ Create Tryon
export type TryonCreatePayload =
    paths['/api/v1/tryon']['post']['requestBody']['content']['application/json'];
export type TryonCreateResponse =
    paths['/api/v1/tryon']['post']['responses']['200']['content']['application/json'];

// 2️⃣ List Tryons
export type TryonListResponse =
    paths['/api/v1/tryon']['get']['responses']['200']['content']['application/json'];
export type TryonItem = TryonListResponse['tryons'][number];

// 3️⃣ Get Tryon Detail
export type TryonDetailResponse =
    paths['/api/v1/tryon/{tryon_id}']['get']['responses']['200']['content']['application/json'];

// 4️⃣ Delete Tryon
export type TryonDeleteResponse =
    paths['/api/v1/tryon/{tryon_id}']['delete']['responses']['200']['content']['application/json'];

export interface InpaintPayload {
    currentBody: string;
    tryonId: string;
    outputUrl: string;
    maskBase64: string;
    type: string;
}
