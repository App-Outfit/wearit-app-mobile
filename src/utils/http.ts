// src/utils/http.ts
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from '../services/api';
import { parseApiError } from './apiError';

/**
 * GET request wrapper
 */
export async function httpGet<T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> {
    try {
        const resp: AxiosResponse<T> = await api.get(url, config);
        return resp.data;
    } catch (err: unknown) {
        throw new Error(parseApiError(err));
    }
}

/**
 * POST request wrapper
 */
export async function httpPost<T, B = any>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
): Promise<T> {
    try {
        const resp: AxiosResponse<T> = await api.post(url, body, config);
        return resp.data;
    } catch (err: unknown) {
        throw new Error(parseApiError(err));
    }
}

/**
 * PUT request wrapper
 */
export async function httpPut<T, B = any>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
): Promise<T> {
    try {
        const resp: AxiosResponse<T> = await api.put(url, body, config);
        return resp.data;
    } catch (err: unknown) {
        throw new Error(parseApiError(err));
    }
}

/**
 * DELETE request wrapper
 */
export async function httpDelete<T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> {
    try {
        const resp: AxiosResponse<T> = await api.delete(url, config);
        return resp.data;
    } catch (err: unknown) {
        throw new Error(parseApiError(err));
    }
}
