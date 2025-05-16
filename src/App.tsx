// App.tsx

import * as React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';

import AppNavigator from './navigation/AppNavigator';
import { store, persistor } from './store';

export default function App() {
    return (
        <StoreProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <PaperProvider>
                    <AppNavigator />
                </PaperProvider>
            </PersistGate>
        </StoreProvider>
    );
}
