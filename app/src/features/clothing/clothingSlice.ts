// src/store/slices/clothingSlice.ts
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
    uploadClothing,
    fetchClothes,
    fetchCategories,
    fetchClothingDetail,
    updateClothing,
    deleteClothing,
} from './clothingThunks';
import {
    ClothingItem,
    CategoryListResponse,
    ClothingDetailResponse,
} from './clothingTypes';

interface ClothingState {
    clothes: ClothingItem[];
    categories: string[];
    selectedClothing: ClothingDetailResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClothingState = {
    clothes: [],
    categories: [],
    selectedClothing: null,
    loading: false,
    error: null,
};

const clothingSlice = createSlice({
    name: 'clothing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // fulfilled
        builder
            .addCase(fetchClothes.fulfilled, (state, { payload }) => {
                state.clothes = payload.clothes;
            })
            .addCase(
                fetchCategories.fulfilled,
                (state, { payload }: { payload: CategoryListResponse }) => {
                    state.categories = payload.categories;
                },
            )
            .addCase(fetchClothingDetail.fulfilled, (state, { payload }) => {
                state.selectedClothing = payload;
            })
            .addCase(uploadClothing.fulfilled, (state, { payload }) => {
                // Optionnel : ajouter au début de la liste
                state.clothes.unshift({
                    id: payload.clothing_id,
                    image_url: payload.image_url,
                    resized_url: payload.resized_url
                        ? payload.resized_url
                        : null,
                    category: payload.category,
                    name: payload.name,
                    created_at: payload.created_at,
                });
            })
            .addCase(updateClothing.fulfilled, (state, { payload }) => {
                // Mettre à jour dans la liste et dans selectedClothing
                const idx = state.clothes.findIndex((c) => c.id === payload.id);
                if (idx !== -1) state.clothes[idx] = payload;
                if (state.selectedClothing?.id === payload.id) {
                    state.selectedClothing = payload;
                }
            })
            .addCase(deleteClothing.fulfilled, (state, { meta }) => {
                state.clothes = state.clothes.filter((c) => c.id !== meta.arg);
                if (state.selectedClothing?.id === meta.arg) {
                    state.selectedClothing = null;
                }
            });

        // pending matcher
        builder.addMatcher(
            isAnyOf(
                uploadClothing.pending,
                fetchClothes.pending,
                fetchCategories.pending,
                fetchClothingDetail.pending,
                updateClothing.pending,
                deleteClothing.pending,
            ),
            (state) => {
                state.loading = true;
                state.error = null;
            },
        );

        // rejected matcher
        builder.addMatcher(
            isAnyOf(
                uploadClothing.rejected,
                fetchClothes.rejected,
                fetchCategories.rejected,
                fetchClothingDetail.rejected,
                updateClothing.rejected,
                deleteClothing.rejected,
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
                uploadClothing.fulfilled,
                fetchClothes.fulfilled,
                fetchCategories.fulfilled,
                fetchClothingDetail.fulfilled,
                updateClothing.fulfilled,
                deleteClothing.fulfilled,
            ),
            (state) => {
                state.loading = false;
            },
        );
    },
});

export default clothingSlice.reducer;
