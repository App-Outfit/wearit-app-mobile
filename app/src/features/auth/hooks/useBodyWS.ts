// src/hooks/useBodyWS.ts
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BASE_URL } from '../../../api';
import { fetchCurrentBody } from '../../body/bodyThunks';
import Toast from 'react-native-toast-message';

// Définition du type d'événement "body_preprocessing"
interface BodyProcessingEvent {
    type: 'body_preprocessing';
    body_id: string;
    status: 'pending' | 'ready' | 'failed';
    original?: string;
    masks?: Record<string, string>;
    error?: string;
    created_at?: string;
}

export function useBodyWS() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!token) return;

        // Construction de l'URL WebSocket
        const isHttps = BASE_URL.startsWith('https');
        const proto = isHttps ? 'wss' : 'ws';
        const host = BASE_URL.replace(/^https?:\/\//, '');
        const wsUrl = `${proto}://${host}/body/ws?token=${encodeURIComponent(token)}`;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => console.log('[Body WS] connected');
        ws.onerror = (e) => console.warn('[Body WS] error', e);

        ws.onmessage = (e) => {
            try {
                const data: BodyProcessingEvent = JSON.parse(e.data);
                if (data.status === 'ready') {
                    dispatch(fetchCurrentBody());
                } else if (data.status === 'failed') {
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur de création du mannequin',
                        text2:
                            data.error ||
                            'Une erreur est survenue lors de la création du mannequin.',
                    });
                }
            } catch (err) {
                console.error('[Body WS] invalid message', err);
            }
        };

        ws.onclose = () => console.log('[Body WS] closed');

        wsRef.current = ws;
        return () => {
            ws.close();
        };
    }, [token, dispatch]);
}
