// src/services/api.ts
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { parseApiError } from '../utils/apiError';

function getHost(): string {
    // if (Platform.OS === 'android') return '10.41.167.187';
    if (Platform.OS === 'android') return '192.168.1.162';
    // if (Platform.OS === 'android') return '127.0.0.1';
    // if (Platform.OS === 'ios')
    // return '192.168.1.26'; // votre IP LAN
    else return 'localhost'; // pour le web
    // return 'ec2-52-47-47-191.eu-west-3.compute.amazonaws.com';
}

// export const BASE_URL = `http://${getHost()}/api/v1`;
export const BASE_URL = `http://${getHost()}:8000/api/v1`;
// console.log(`🌐 API baseURL = ${BASE_URL}`);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

// — Request interceptor : logs + injection token
api.interceptors.request.use(
    async (config) => {
        console.log('→ HTTP', config.method?.toUpperCase(), config.url);
        const token = await AsyncStorage.getItem('token');
        if (token) {
            if (typeof config.headers?.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                (config.headers as Record<string, string>)['Authorization'] =
                    `Bearer ${token}`;
            }
        }

        // if (config) {
        //     console.log(
        //         '→ REQUEST →',
        //         config.method?.toUpperCase(),
        //         config.baseURL + config.url,
        //     );
        //     console.log('   headers =', config.headers);
        //     console.log('   data =', config.data);
        // }
        return config;
    },
    (error) => Promise.reject(error),
);

// — Response interceptor : logs + normalisation d’erreur
api.interceptors.response.use(
    (resp) => {
        // console.log('← HTTP RESPONSE', resp.status, resp.config.url);
        return resp;
    },
    (error: AxiosError) => {
        // console.log('← HTTP ERROR', error.message, '→', error.config?.url);
        // Transforme tout AxiosError en Error avec message friendly
        const message = parseApiError(error);
        return Promise.reject(new Error(message));
    },
);

export default api;
