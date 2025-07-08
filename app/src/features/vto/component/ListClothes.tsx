import * as React from 'react';
import { StyleSheet, FlatList, Dimensions, View, TouchableOpacity } from 'react-native';

import { ImportChoice } from '../../../components/choice_component/ImportChoice';
import { ModalAddClothInfo } from '../component/ModalAddClothInfo';
import { baseColors } from '../../../styles/theme';

import { AddButtonText } from '../../../components/core/Buttons';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectAllClothes } from '../../clothing/clothingSelectors';
import { fetchClothes } from '../../clothing/clothingThunks';
import { ClothingItem } from '../../clothing/clothingTypes';
import { fetchTryonsByBodyId } from '../tryonThunks';
import { selectAllTryons, selectTryonByClothID } from '../tryonSelectors';
import { ClothItem } from '../../clothing/components/ClothItem';
import { useTryonSSE } from '../hooks/useTryonSSE';
import { DrawerToggleButton } from '../../../components/core/DrawerToggleButton';
import { useNavigation } from '@react-navigation/native';
import { selectCurrentBody } from '../../body/bodySelectors';
import { fetchCurrentBody } from '../../body/bodyThunks';
import { useUploadClothing } from '../../clothing/hooks/useUploadClothing';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { clothingIcons } from '../../../assets/icons/clothingIcons';
import { Image } from 'react-native';

export function MiniDressing({ setDrawerCloth, drawerCloth }) {
    // Navigation
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [newPictureUri, setNewPictureUri] = React.useState<string | null>(
        null,
    );
    const [importModalOpen, setImportModalOpen] = React.useState(false);
    const [infoModalOpen, setInfoModalOpen] = React.useState(false);
    const openModalAddCloth = () => {
        setImportModalOpen(true);
    };
    const {
        saveClothing,
        loading: uploading,
        error: uploadError,
    } = useUploadClothing();

    const current_body = useAppSelector(selectCurrentBody);
    const userCloth = useAppSelector(selectAllClothes);
    const allTryons = useAppSelector(selectAllTryons);
    const allCloths = userCloth;
    const [lastFetchedBodyId, setLastFetchedBodyId] = React.useState<string | null>(null);
    const [activeFilter, setActiveFilter] = React.useState<'all' | 'upper' | 'lower' | 'dress'>('all');

    const screenWidth = Dimensions.get('window').width;

    useTryonSSE();

    React.useEffect(() => {
        dispatch(fetchClothes());
    }, [dispatch]);

    React.useEffect(() => {
        // Éviter les appels répétés pour le même body_id
        if (current_body && current_body.id !== lastFetchedBodyId) {
            dispatch(fetchTryonsByBodyId(current_body.id));
            setLastFetchedBodyId(current_body.id);
        }
    }, [current_body, dispatch, lastFetchedBodyId]);

    const handleImagePicked = async (uri) => {
        setImportModalOpen(false);
        if (uri) {
            setNewPictureUri(uri);
            setInfoModalOpen(true);
        }
    };

    const handleSaveNewCloth = async ({ cloth_type, category, cloth_id }) => {
        if (!newPictureUri) return;
        await saveClothing({
            uri: newPictureUri,
            category,
            cloth_type,
            name: cloth_id,
        });
        // on ferme la modale et reset l'URI seulement si pas d'erreur
        if (!uploadError) {
            setNewPictureUri(null);
            setInfoModalOpen(false);
            dispatch(fetchClothes());
        }
    };

    // Filtrer les vêtements selon le filtre actif
    const filteredCloths = React.useMemo(() => {
        if (activeFilter === 'all') return allCloths;
        return allCloths.filter(cloth => cloth.cloth_type === activeFilter);
    }, [allCloths, activeFilter]);

    const renderItem = React.useCallback(
        ({ item }: { item: ClothingItem }) => {
            const associatedTryon =
                allTryons.find((t) => t.clothing_id === item.id) ?? null;
            return (
                <ClothItem
                    navigation={navigation}
                    cloth={item}
                    associatedTryon={associatedTryon}
                />
            );
        },
        [allTryons],
    );

    return (
        <>
            {drawerCloth && (
                <FlatList
                    data={filteredCloths}
                    style={styleDressing.scrollView}
                    contentContainerStyle={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingBottom: 90, // Espace pour que la liste s'arrête avant le bouton
                    }}
                    keyExtractor={(c) => c.id}
                    renderItem={renderItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    removeClippedSubviews={true}
                />
            )}

            {/* Bouton d'ajout persistant en bas */}
            {drawerCloth && (
                <View style={styleDressing.addButtonContainer}>
                    <AddButtonText
                        onPress={openModalAddCloth}
                        text=""
                    />
                </View>
            )}

            {/* Boutons de filtrage */}
            <View style={styleDressing.filterButtonsContainer}>
                <TouchableOpacity
                    style={[
                        styleDressing.filterButton,
                        activeFilter === 'all' && styleDressing.filterButtonActive
                    ]}
                    onPress={() => setActiveFilter('all')}
                    activeOpacity={0.7}
                >
                    <Feather name="grid" size={25} color={activeFilter === 'all' ? '#FFFFFF' : '#666666'} />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styleDressing.filterButton,
                        activeFilter === 'upper' && styleDressing.filterButtonActive
                    ]}
                    onPress={() => setActiveFilter('upper')}
                    activeOpacity={0.7}
                >
                    <Image 
                        source={clothingIcons.upper} 
                        style={{ 
                            width: 25, 
                            height: 25,
                            tintColor: activeFilter === 'upper' ? '#FFFFFF' : '#666666'
                        }} 
                    />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styleDressing.filterButton,
                        activeFilter === 'lower' && styleDressing.filterButtonActive
                    ]}
                    onPress={() => setActiveFilter('lower')}
                    activeOpacity={0.7}
                >
                    <Image 
                        source={clothingIcons.lower} 
                        style={{ 
                            width: 25, 
                            height: 25,
                            tintColor: activeFilter === 'lower' ? '#FFFFFF' : '#666666'
                        }} 
                    />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styleDressing.filterButton,
                        activeFilter === 'dress' && styleDressing.filterButtonActive
                    ]}
                    onPress={() => setActiveFilter('dress')}
                    activeOpacity={0.7}
                >
                    <Image 
                        source={clothingIcons.dress} 
                        style={{ 
                            width: 25, 
                            height: 25,
                            tintColor: activeFilter === 'dress' ? '#FFFFFF' : '#666666'
                        }} 
                    />
                </TouchableOpacity>
            </View>

            <DrawerToggleButton
                active={true}
                onPress={() => {
                    setDrawerCloth(!drawerCloth);
                }}
                size={40}
                iconColor={baseColors.black}
                backgroundColor={baseColors.white}
                style={{
                    position: 'absolute',
                    top: screenWidth / 1.5,
                    right: '90%',
                }}
            />

            <ImportChoice
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onPicked={handleImagePicked}
            />
            <ModalAddClothInfo
                open={infoModalOpen}
                onCancel={() => setInfoModalOpen(false)}
                onSave={handleSaveNewCloth}
                imageUri={newPictureUri}
                // loading={uploading}
                // error={uploadError}
            />
        </>
    );
}

const styleDressing = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: '100%',
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 0, // Aligné avec la toolbar en bas
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,1)', // Fond semi-transparent pour couvrir la liste
        alignItems: 'center',
        paddingVertical: 0,
        zIndex: 0, // Pour être au-dessus de la liste
    },
    filterButtonsContainer: {
        position: 'absolute',
        top: Dimensions.get('window').width / 1 + 50, // Plus bas
        right: '92%', // Plus à gauche
        flexDirection: 'column',
        gap: 8,
    },
    filterButton: {
        width: 38,
        height: 38,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    filterButtonActive: {
        backgroundColor: '#6F5BFF',
    },
});
