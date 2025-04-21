// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Renvoie l’hôte où tourne votre backend FastAPI.
 * - Sur Android Emulator      → 10.0.2.2
 * - Sur iOS Simulator         → localhost
 * - Sur Expo Go (device réel) → <votre IP LAN>
 */
function getHost(): string {
    if (Platform.OS === 'android') return '10.0.2.2';
    if (Platform.OS === 'ios') {
        // 👉 Remplacez '192.168.1.42' par l’IP de votre Mac/PC sur le réseau local
        return '192.168.1.123';
    }
    // par défaut (web, etc.)
    return 'localhost';
}

const host = getHost();
export const BASE_URL = `http://${host}:8000/api/v1`;

console.log(`🌐 API baseURL = ${BASE_URL}`);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

// ——— Interceptor pour automatiser l’ajout du token + logs ———
api.interceptors.request.use(
    async (config) => {
        console.log(
            '→ HTTP',
            config.method?.toUpperCase(),
            config.baseURL,
            config.url,
        );
        const token = await AsyncStorage.getItem('token');
        if (token) {
            // Dans Axios v1, headers est un AxiosHeaders
            if (typeof config.headers?.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                (config.headers as Record<string, string>)['Authorization'] =
                    `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (resp) => {
        console.log('← HTTP RESPONSE', resp.status);
        return resp;
    },
    (err) => {
        console.log(
            '← HTTP ERROR',
            err.message,
            '→',
            err.config?.baseURL,
            err.config?.url,
        );
        return Promise.reject(err);
    },
);

export default api;
