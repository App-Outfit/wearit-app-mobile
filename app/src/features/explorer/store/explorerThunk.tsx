import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductsPage, SearchClothingPayload } from './explorerTypes';
import { explorerService } from './explorerService';

/** Search a bunch of clothes */
export const searchClothes = createAsyncThunk<
    ProductsPage,
    SearchClothingPayload
>('explorer/search-clothes', async (payload, { rejectWithValue }) => {
    try {
        return await explorerService.searchClothing(payload);
    } catch (err: any) {
        return rejectWithValue(
            err.response?.data?.message || 'Search clothing failed',
        );
    }
});
