// src/hooks/useTryonSSE.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EventSource from 'react-native-event-source';
import { updateTryon } from '../tryonSlice';

import { BASE_URL } from '../../../api';

export function useTryonSSE(jwtToken: string | null) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!jwtToken) return;
        const es = new EventSource(`${BASE_URL}/tryon/events`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
        });

        es.onopen = () => console.log('[SSE] connected');
        es.onerror = (e) => console.warn('[SSE] error', e);
        es.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'tryon_update') {
                    console.log('[SSE] tryon update', data);
                    dispatch(
                        updateTryon({
                            id: data.tryon_id,
                            output_url: data.output_url,
                            status: data.status,
                        }),
                    );
                }
            } catch {
                console.warn('[SSE] invalid JSON', e.data);
            }
        };

        return () => es.close();
    }, [jwtToken, dispatch]);
}
