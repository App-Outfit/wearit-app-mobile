// src/features/vto/hooks/useTryonInpainting.ts
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import {
    loadAssetBase64,
    inpaintUpper,
    inpaintLower,
    inpaintDress,
} from '../service/InpaintingService';
import type { TryonItem } from '../tryonTypes';

type State = { resultUri: string | null; loading: boolean };
type Action =
    | { type: 'init'; resultUri: string }
    | { type: 'start' }
    | { type: 'success'; resultUri: string }
    | { type: 'error' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'init':
            return { resultUri: action.resultUri, loading: false };
        case 'start':
            return { resultUri: state.resultUri, loading: true };
        case 'success':
            return { resultUri: action.resultUri, loading: false };
        default:
            return state;
    }
}

export function useTryonInpainting({
    baseImageUri,
    selectedTryon,
    masks,
    type,
}) {
    const [{ resultUri, loading }, dispatchState] = React.useReducer(reducer, {
        resultUri: baseImageUri,
        loading: false,
    });
    const isMounted = React.useRef(true);

    // 1️⃣ Initialisation resultUri = baseImageUri
    React.useEffect(() => {
        if (baseImageUri)
            dispatchState({ type: 'init', resultUri: baseImageUri });
    }, [baseImageUri]);

    // 2️⃣ Inpainting
    React.useEffect(() => {
        if (!baseImageUri || !selectedTryon || !type) return;
        const mask = masks[type];
        if (!mask) return;

        let cancelled = false;
        dispatchState({ type: 'start' });

        (async () => {
            try {
                const tryon64 = await loadAssetBase64(selectedTryon.output_url);
                let next = await (type === 'upper'
                    ? inpaintUpper(baseImageUri, tryon64, mask)
                    : type === 'lower'
                      ? inpaintLower(baseImageUri, tryon64, mask)
                      : inpaintDress(baseImageUri, tryon64, mask));

                InteractionManager.runAfterInteractions(() => {
                    if (!cancelled && isMounted.current) {
                        dispatchState({ type: 'success', resultUri: next });
                    }
                });
            } catch {
                if (!cancelled && isMounted.current) {
                    dispatchState({ type: 'error' });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [
        baseImageUri,
        selectedTryon?.id,
        selectedTryon?.output_url,
        type,
        masks.upper,
        masks.lower,
        masks.dress,
    ]);

    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return { resultUri, loading };
}
