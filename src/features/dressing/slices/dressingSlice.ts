// src/features/dressing/slices/wardrobeSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dressingService } from '../services/dressingService';
import {
    NewClothPayload,
    ClothItem,
    ClothCreateResponse,
    CategoryResponse,
    CategoryListResponse,
    NewCategoryPayload,
} from '../types/dressingTypes';

interface WardrobeState {
    categories: CategoryResponse[];
    items: ClothItem[];
    loading: boolean;
    error: string | null;
}

const initialState: WardrobeState = {
    categories: [],
    items: [],
    loading: false,
    error: null,
};

/** 1) Charger la liste des catégories */
export const loadCategories = createAsyncThunk<
    CategoryResponse[],
    void,
    { rejectValue: string }
>('wardrobe/loadCategories', async (_, { rejectWithValue }) => {
    try {
        const resp: CategoryListResponse =
            await dressingService.listCategories();
        return resp.categories;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

/** 1b) Créer une nouvelle catégorie */
export const createCategory = createAsyncThunk<
    CategoryResponse,
    NewCategoryPayload,
    { rejectValue: string }
>('wardrobe/createCategory', async (payload, { rejectWithValue }) => {
    try {
        const resp = await dressingService.createCategory(payload);
        return resp;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

/** 2) Charger tous les vêtements d’une catégorie */
export const loadClothesByType = createAsyncThunk<
    ClothItem[],
    string,
    { rejectValue: string }
>('wardrobe/loadClothesByType', async (type, { rejectWithValue }) => {
    try {
        return await dressingService.listClothes(type);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

/** 3) Ajouter un vêtement */
export const addCloth = createAsyncThunk<
    ClothItem,
    NewClothPayload,
    { rejectValue: string }
>('wardrobe/addCloth', async (payload, { rejectWithValue }) => {
    try {
        const resp: ClothCreateResponse =
            await dressingService.createCloth(payload);
        return {
            id: resp.id,
            name: payload.name,
            type: payload.type,
            image_url: resp.image_url,
            tags: resp.tags,
        };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

/** 4) Supprimer un vêtement */
export const removeCloth = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('wardrobe/removeCloth', async (id, { rejectWithValue }) => {
    try {
        await dressingService.deleteCloth(id);
        return id;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

const wardrobeSlice = createSlice({
    name: 'wardrobe',
    initialState,
    reducers: {
        clearWardrobeError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // loadCategories
        builder
            .addCase(loadCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                loadCategories.fulfilled,
                (state, action: PayloadAction<CategoryResponse[]>) => {
                    state.loading = false;
                    state.categories = action.payload;
                },
            )
            .addCase(loadCategories.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Erreur chargement catégories';
            });

        // createCategory
        builder
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                createCategory.fulfilled,
                (state, action: PayloadAction<CategoryResponse>) => {
                    state.loading = false;
                    state.categories.push(action.payload);
                },
            )
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Erreur création catégorie';
            });

        // loadClothesByType
        builder
            .addCase(loadClothesByType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                loadClothesByType.fulfilled,
                (state, action: PayloadAction<ClothItem[]>) => {
                    state.loading = false;
                    state.items = action.payload;
                },
            )
            .addCase(loadClothesByType.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Erreur chargement vêtements';
            });

        // addCloth
        builder
            .addCase(addCloth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                addCloth.fulfilled,
                (state, action: PayloadAction<ClothItem>) => {
                    state.loading = false;
                    state.items.push(action.payload);
                },
            )
            .addCase(addCloth.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Erreur ajout vêtement';
            });

        // removeCloth
        builder
            .addCase(removeCloth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                removeCloth.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    state.items = state.items.filter(
                        (c) => c.id !== action.payload,
                    );
                },
            )
            .addCase(removeCloth.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Erreur suppression vêtement';
            });
    },
});

export const { clearWardrobeError } = wardrobeSlice.actions;
export default wardrobeSlice.reducer;
