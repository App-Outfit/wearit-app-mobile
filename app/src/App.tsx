import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';

export default function App() {
    return (
        <StoreProvider store={store}>
            <PaperProvider>
                <AppNavigator />
            </PaperProvider>
        </StoreProvider>
    );
}
