// src/services/explorerService.ts

import api from '../../../api';
import { SearchClothingPayload, ProductsPage } from './explorerTypes';

export const explorerService = {
    /**
     * POST /api/v1/search-clothing
     * Envoie la query + bookmark + csrf_token + gender en body
     * et récupère une page de produits Pinterest.
     */
    searchClothing: (payload: SearchClothingPayload): Promise<ProductsPage> =>
        api
            .post<ProductsPage>('explorer/search-clothes', payload)
            .then((res) => res.data),
};
