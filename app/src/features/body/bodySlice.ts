// src/store/slices/bodySlice.ts

import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import {
    uploadBody,
    fetchBodies,
    fetchCurrentBody,
    fetchBodyMasks,
    deleteBody,
} from './bodyThunks';
import { BodyItem, BodyCurrentResponse, BodyMasksResponse } from './bodyTypes';

interface BodyState {
    bodies: BodyItem[];
    currentBody: BodyItem | null;
    masks: Record<string, BodyMasksResponse>;
    loading: boolean;
    error: string | null;
}

const initialState: BodyState = {
    bodies: [],
    currentBody: null,
    masks: {},
    loading: false,
    error: null,
};

const bodySlice = createSlice({
    name: 'body',
    initialState,
    reducers: {
        setCurrentBody(state, action: PayloadAction<BodyItem>) {
            state.currentBody = action.payload;
        },
    },
    extraReducers: (builder) => {
        // fulfilled
        builder
            .addCase(fetchBodies.fulfilled, (state, { payload }) => {
                state.bodies = payload.bodies;
            })
            .addCase(fetchCurrentBody.fulfilled, (state, { payload }) => {
                state.currentBody = payload;
            })
            .addCase(fetchBodyMasks.fulfilled, (state, { meta, payload }) => {
                state.masks[meta.arg] = payload;
            })
            .addCase(deleteBody.fulfilled, (state, { meta }) => {
                state.bodies = state.bodies.filter((b) => b.id !== meta.arg);
                delete state.masks[meta.arg];
                if (state.currentBody?.id === meta.arg) {
                    state.currentBody = null;
                }
            });

        // generic pending
        builder.addMatcher(
            isAnyOf(
                uploadBody.pending,
                fetchBodies.pending,
                fetchCurrentBody.pending,
                fetchBodyMasks.pending,
                deleteBody.pending,
            ),
            (state) => {
                state.loading = true;
                state.error = null;
            },
        );

        // generic rejected
        builder.addMatcher(
            isAnyOf(
                uploadBody.rejected,
                fetchBodies.rejected,
                fetchCurrentBody.rejected,
                fetchBodyMasks.rejected,
                deleteBody.rejected,
            ),
            (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || action.error.message || null;
            },
        );

        // clear loading on any fulfilled
        builder.addMatcher(
            isAnyOf(
                uploadBody.fulfilled,
                fetchBodies.fulfilled,
                fetchCurrentBody.fulfilled,
                fetchBodyMasks.fulfilled,
                deleteBody.fulfilled,
            ),
            (state) => {
                state.loading = false;
            },
        );
    },
});

export default bodySlice.reducer;
export const { setCurrentBody } = bodySlice.actions;
