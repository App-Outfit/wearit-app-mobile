import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '@rneui/themed';

export default function App() {
    return (
        <StoreProvider store={store}>
            <ThemeProvider>
                <AppNavigator />
            </ThemeProvider>
        </StoreProvider>
    );
}
