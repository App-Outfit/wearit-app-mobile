// src/types/explorerTypes.tsx

/**
 * Payload envoyé pour rechercher des vêtements / produits Pinterest.
 */
export interface SearchClothingPayload {
    query: string;
    bookmark?: string;
    csrf_token?: string;
    gender?: string;
}

/**
 * Représente un produit retourné par Pinterest.
 */
export interface PinterestProduct {
    product_url?: string;
    description?: string;
    image_url: string;
    query: string;
    pinterest_url?: string;
}

/**
 * Page de résultats d’images / produits Pinterest.
 */
export interface ProductsPage {
    products: PinterestProduct[];
    bookmark?: string;
    csrf_token?: string;
    language: string;
    query: string;
}
