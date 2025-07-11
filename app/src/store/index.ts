import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from '../features/auth/slices/authSlice';
import onboardingReducer from '../features/auth/slices/onboardingSlice';
import tryonReducer from '../features/vto/tryonSlice';
import useReducer from '../features/profil/slices/userSlice';
import bodyReducer from '../features/body/bodySlice';
import clothinReducer from '../features/clothing/clothingSlice';
import favoriteReducer from '../features/favorite/favoriteSlice';
import explorerReducer from '../features/explorer/store/explorerSlice';

const persistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: ['token'], // on ne persiste que le token
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        onboarding: onboardingReducer,
        user: useReducer,
        tryon: tryonReducer,
        body: bodyReducer,
        clothing: clothinReducer,
        favorite: favoriteReducer,
        explorer: explorerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
