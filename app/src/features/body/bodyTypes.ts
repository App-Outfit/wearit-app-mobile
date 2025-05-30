// src/types/body.types.ts

import { paths } from '../../types/api';

// 1️⃣ Upload Body
export type BodyUploadPayload =
    paths['/api/v1/body/upload']['post']['requestBody']['content']['multipart/form-data'];
export type BodyUploadResponse =
    paths['/api/v1/body/upload']['post']['responses']['200']['content']['application/json'];

// 2️⃣ List Bodies
export type BodyListResponse =
    paths['/api/v1/body/list']['get']['responses']['200']['content']['application/json'];
export type BodyItem = BodyListResponse['bodies'][number];

// 3️⃣ Get Current Body
export type BodyCurrentResponse =
    paths['/api/v1/body/current']['get']['responses']['200']['content']['application/json'];

// 4️⃣ Get Masks
export type BodyMasksResponse =
    paths['/api/v1/body/{body_id}/masks']['get']['responses']['200']['content']['application/json'];

// 5️⃣ Delete Body
export type DeleteBodyResponse =
    paths['/api/v1/body/{body_id}']['delete']['responses']['200']['content']['application/json'];
