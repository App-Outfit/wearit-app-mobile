// src/types/favorite.types.ts
import { paths } from '../../types/api.ts';

// 1️⃣ Payload pour créer un favori
export type FavoriteCreatePayload =
    paths['/api/v1/favorites']['post']['requestBody']['content']['application/json'];

// 2️⃣ Réponse à la création & récupération d’un favori
export type FavoriteResponse =
    paths['/api/v1/favorites']['post']['responses']['200']['content']['application/json'];

// 3️⃣ Liste de favoris
export type FavoriteListResponse =
    paths['/api/v1/favorites']['get']['responses']['200']['content']['application/json'];
export type FavoriteItem = FavoriteListResponse['favorites'][number];

// 4️⃣ Réponse à la suppression
export type FavoriteDeleteResponse =
    paths['/api/v1/favorites/{favorite_id}']['delete']['responses']['200']['content']['application/json'];
