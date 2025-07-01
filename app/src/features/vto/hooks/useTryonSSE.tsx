// src/hooks/useTryonSSE.ts
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EventSource from 'react-native-event-source';
import { updateTryon } from '../tryonSlice';

import { BASE_URL } from '../../../api';
import { useAppSelector } from '../../../utils/hooks';
import { TryonItem } from '../tryonTypes';

export function useTryonSSE() {
    const dispatch = useDispatch();
    const jwtToken = useAppSelector((state) => state.auth.token);

    const wsRef = React.useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!jwtToken) return;

        const isHttps = BASE_URL.startsWith('https');
        const proto = isHttps ? 'wss' : 'ws';
        const withoutSchema = BASE_URL.replace(/^https?:\/\//, '');
        const wsUrl = `${proto}://${withoutSchema}/tryon/ws?token=${encodeURIComponent(jwtToken)}`;

        const ws = new WebSocket(wsUrl);
        ws.onopen = () => console.log('[WS] connected');
        ws.onerror = (e) => console.warn('[WS] error', e);
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'tryon_update') {
                const tryonItem: TryonItem = {
                    id: data.tryon_id,
                    output_url: data.output_url,
                    status: data.status,
                    body_id: data.body_id,
                    clothing_id: data.clothing_id,
                    created_at: data.created_at,
                    version: data.version,
                };
                dispatch(updateTryon(tryonItem));
            }
        };
        ws.onclose = () => console.log('[WS] closed');
        wsRef.current = ws;
        return () => {
            ws.close();
        };
    }, [jwtToken, dispatch]);
}
