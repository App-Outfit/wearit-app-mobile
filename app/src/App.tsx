import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <StoreProvider store={store}>
            <PaperProvider>
                <SafeAreaProvider>
                    <AppNavigator />
                </SafeAreaProvider>
            </PaperProvider>
        </StoreProvider>
    );
}
