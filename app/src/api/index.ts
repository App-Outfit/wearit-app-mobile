// src/api/index.ts
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { parseApiError } from '../utils/apiError';
import Constants from 'expo-constants';

// 🔧 CONFIGURATION DE DÉVELOPPEMENT
const FORCE_DEVICE_TYPE: 'auto' | 'emulator' | 'physical' = 'physical'; // Changez ici : 'emulator', 'physical', ou 'auto'
const LOCAL_IP = '192.168.1.122'; // 🔧 CHANGEZ CETTE IP SELON VOTRE RÉSEAU WiFi

/**
 * Detects if the app is running on an emulator/simulator or physical device
 */
function isEmulator(): boolean {
    // Option manuelle forcée
    if (FORCE_DEVICE_TYPE === 'emulator') return true;
    if (FORCE_DEVICE_TYPE === 'physical') return false;

    // Détection automatique si 'auto'
    if (Platform.OS === 'android') {
        return (
            Constants.isDevice === false ||
            Platform.constants?.Brand === 'google' ||
            Platform.constants?.Model?.includes('sdk') ||
            Platform.constants?.Model?.includes('Emulator') ||
            Platform.constants?.Model?.includes('Android SDK')
        );
    } else if (Platform.OS === 'ios') {
        return (
            Constants.isDevice === false ||
            (Platform.constants?.systemName === 'iOS' &&
                (Platform.constants?.model?.includes('Simulator') ||
                    Platform.constants?.model?.includes('x86_64')))
        );
    }

    return true;
}

/**
 * Determines the base URL based on environment and device type
 * Production: Uses production API
 * Development: Automatically detects emulator vs physical device
 */
function getBaseURL(): string {
    const isDevelopment = __DEV__;

    if (isDevelopment) {
        const isEmulatorDevice = isEmulator();

        if (Platform.OS === 'android') {
            if (isEmulatorDevice) {
                // Émulateur Android: IP spéciale qui redirige vers localhost
                return 'http://10.0.2.2:8000/api/v1';
            } else {
                // Appareil Android physique: IP locale de votre machine
                return `http://${LOCAL_IP}:8000/api/v1`;
            }
        } else if (Platform.OS === 'ios') {
            if (isEmulatorDevice) {
                // Simulateur iOS: localhost fonctionne directement
                return 'http://localhost:8000/api/v1';
            } else {
                // iPhone physique: IP locale de votre machine
                return `http://${LOCAL_IP}:8000/api/v1`;
            }
        } else {
            // Web development
            return 'http://localhost:8000/api/v1';
        }
    } else {
        // Production environment
        return 'https://api-backend.wearit-paris.com/api/v1';
    }
}

export const BASE_URL = getBaseURL();

// Enhanced logging for debugging
if (__DEV__) {
    const isEmulatorDevice = isEmulator();
    console.log(`🌐 API Environment: Development`);
    console.log(`📱 Platform: ${Platform.OS}`);
    console.log(
        `⚙️ Device Detection: ${FORCE_DEVICE_TYPE} ${FORCE_DEVICE_TYPE === 'auto' ? '(automatic)' : '(manual)'}`,
    );
    console.log(
        `🖥️ Device Type: ${isEmulatorDevice ? 'Emulator/Simulator' : 'Physical Device'}`,
    );
    console.log(`🔗 API Base URL: ${BASE_URL}`);

    if (!isEmulatorDevice) {
        console.log(`💡 Using LOCAL_IP: ${LOCAL_IP} (update if needed)`);
    }
} else {
    console.log(`🌐 API Environment: Production`);
    console.log(`🔗 API Base URL: ${BASE_URL}`);
}

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

// Request interceptor: Add authentication token to all requests
api.interceptors.request.use(
    async (config) => {
        // Log requests in development mode
        if (__DEV__) {
            console.log('→ HTTP', config.method?.toUpperCase(), config.url);
        }

        // Add authorization token if available
        const token = await AsyncStorage.getItem('token');
        if (token) {
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

// Response interceptor: Handle responses and errors
api.interceptors.response.use(
    (response) => {
        // Log successful responses in development mode
        if (__DEV__) {
            console.log(
                '← HTTP RESPONSE',
                response.status,
                response.config.url,
            );
        }
        return response;
    },
    (error: AxiosError) => {
        // Log errors in development mode
        if (__DEV__) {
            console.log('← HTTP ERROR', error.message, '→', error.config?.url);
        }

        // Transform AxiosError to user-friendly Error message
        const message = parseApiError(error);
        return Promise.reject(new Error(message));
    },
);

export default api;
