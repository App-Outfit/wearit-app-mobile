// src/screens/ExplorerScreen.tsx

import React, {
    useCallback,
    useRef,
    useMemo,
    useEffect,
    useState,
} from 'react';
import {
    View,
    TextInput,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import {
    RecyclerListView,
    DataProvider,
    LayoutProvider,
} from 'recyclerlistview';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { setQuery, resetExplorerState } from '../store/explorerSlice';
import { searchClothes } from '../store/explorerThunk';
import {
    selectExplorerBookmark,
    selectExplorerCsrfToken,
    selectExplorerError,
    selectExplorerLoading,
    selectExplorerProducts,
    selectExplorerQuery,
    selectUserGender,
} from '../store/explorerSelector';
import { baseColors, spacing, typography } from '../../../styles/theme';

import FastImage from '@d11/react-native-fast-image';
import { ExplorerCard } from '../components/ExplorerCard';

export function ExplorerScreen() {
    const dispatch = useAppDispatch();

    // Redux state
    const products = useAppSelector(selectExplorerProducts);
    const query = useAppSelector(selectExplorerQuery);
    const bookmark = useAppSelector(selectExplorerBookmark);
    const csrf_token = useAppSelector(selectExplorerCsrfToken);
    const loading = useAppSelector(selectExplorerLoading);
    const error = useAppSelector(selectExplorerError);
    const gender = useAppSelector(selectUserGender);

    // Recherche / pagination
    const handleSearch = useCallback(() => {
        dispatch(resetExplorerState());
        dispatch(
            searchClothes({
                query: query,
                gender: gender || '',
            }),
        );
    }, [dispatch, query]);

    const handleLoadMore = useCallback(() => {
        if (!loading && bookmark) {
            dispatch(
                searchClothes({
                    query,
                    bookmark,
                    csrf_token,
                    gender: gender || '',
                }),
            );
        }
    }, [dispatch, loading, query, bookmark, csrf_token]);

    // Calcul des dimensions pour 2 colonnes
    const { width } = Dimensions.get('window');
    const columnWidth = width / 2; // padding 12px de chaque côté

    // 1️⃣ DataProvider (cloneWithRows à chaque produit change)
    const dataProviderRef = useRef(new DataProvider((r1, r2) => r1 !== r2));
    const [dataProvider, setDataProvider] = useState(
        dataProviderRef.current.cloneWithRows(products),
    );
    useEffect(() => {
        setDataProvider(dataProviderRef.current.cloneWithRows(products));
    }, [products]);

    // 2️⃣ LayoutProvider (taille fixe pour chaque cellule)
    const layoutProvider = useMemo(
        () =>
            new LayoutProvider(
                () => 0, // un seul type de vue
                (_type, dim) => {
                    dim.width = columnWidth;
                    dim.height = 200;
                },
            ),
        [columnWidth],
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Barre de recherche */}
            <TextInput
                style={styles.searchBar}
                placeholder="Rechercher des vêtements…"
                placeholderTextColor={baseColors.gray_4}
                value={query}
                onChangeText={(text) => dispatch(setQuery(text))}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
            />

            {/* Message d’erreur */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Liste RecyclerListView */}
            <RecyclerListView
                style={styles.listView}
                layoutProvider={layoutProvider}
                dataProvider={dataProvider}
                rowRenderer={(_type, item) => (
                    <ExplorerCard item={item} columnWidth={columnWidth} />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={200}
                renderAheadOffset={width}
                scrollViewProps={{ scrollEventThrottle: 16 }}
            />

            {/* Loader en bas */}
            {loading && (
                <ActivityIndicator style={styles.loader} size="large" />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    searchBar: {
        height: 50,
        // marginHorizontal: 12,
        marginTop: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#f0f0f0',
        fontSize: 16,
        color: baseColors.black,
        fontFamily: typography.poppins.semiBold,
    },
    listView: {
        flex: 1,
        paddingTop: spacing.small,
    },
    loader: {
        marginVertical: 16,
        alignSelf: 'center',
    },
    errorContainer: {
        padding: 12,
    },
    errorText: {
        color: baseColors.error,
        textAlign: 'center',
    },
});
