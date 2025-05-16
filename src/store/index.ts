import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../features/auth/slices/authSlice';
import onboardingReducer from '../features/auth/slices/onboardingSlice';
import dressingReducer from '../features/dressing/slices/dressingSlice';

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
        dressing: dressingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
