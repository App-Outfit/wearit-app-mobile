import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Touchable,
    TouchableOpacity,
    FlatList,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import { AddButton } from '../../../components/core/Buttons';
import DropdownMenu from '../component/DropDownMenu';
import { lightTheme } from '../../../styles/theme';
import { DressingNavigatorParamList } from '../navigation/DressingNavigator';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { handleCamera, handleGallery } from './Camera';
import { Modal, PaperProvider, Portal } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { ClothItem } from '../component/ClothItem';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectAllClothes } from '../../clothing/clothingSelectors';
import { fetchClothes } from '../../clothing/clothingThunks';
import { useUploadClothing } from '../../clothing/hooks/useUploadClothing';
import { ImportChoice } from '../../../components/choice_component/ImportChoice';
import { ModalAddClothInfo } from '../../vto/component/ModalAddClothInfo';
import { fetchTryonsByBodyId } from '../../vto/tryonThunks';
import { selectCurrentBody } from '../../body/bodySelectors';
import { fetchCurrentBody } from '../../body/bodyThunks';

export type DressingClothGaleryScreenProps = NativeStackScreenProps<
    DressingNavigatorParamList,
    'DressingClothGalery'
>;
export function DressingClothGaleryScreen({
    route,
}: DressingClothGaleryScreenProps) {
    const dispatch = useAppDispatch();
    const allClothes = useAppSelector(selectAllClothes);
    const currentBody = useAppSelector(selectCurrentBody);
    const { title, subtitle, cloth_type } = route.params;
    const [newImageUri, setNewImageUri] = React.useState<string | null>(null);

    const [importModalOpen, setImportModalOpen] = React.useState(false);
    const [infoModalOpen, setInfoModalOpen] = React.useState(false);

    const { saveClothing, loading, error } = useUploadClothing();

    // Fetch clothes and body on mount
    React.useEffect(() => {
        dispatch(fetchClothes());
        dispatch(fetchCurrentBody());
    }, [dispatch]);

    // Fetch tryons when body is available
    React.useEffect(() => {
        if (currentBody) {
            dispatch(fetchTryonsByBodyId(currentBody.id));
        }
    }, [currentBody, dispatch]);

    // Filtrer par type de vêtement
    const clothes = React.useMemo(() => {
        if (!cloth_type) return allClothes;
        return allClothes.filter(c => c.cloth_type === cloth_type);
    }, [allClothes, cloth_type]);

    const addCloths = () => {
        setImportModalOpen(true);
    };

    const handleImagePicked = async (uri: string) => {
        setImportModalOpen(false);
        if (uri) {
            setNewImageUri(uri);
            setInfoModalOpen(true);
        }
    };

    const handleSaveNewCloth = async ({ cloth_type, category }: any) => {
        if (!newImageUri) return;
        
        console.log('📦 Saving cloth:', { cloth_type, category, uri: newImageUri });
        
        await saveClothing({
            uri: newImageUri,
            cloth_type: cloth_type,
            category: category,
            name: `${category}_${Date.now()}`, // Générer un nom automatique
        });
        
        setInfoModalOpen(false);
        setNewImageUri(null);
        // Refresh la liste
        dispatch(fetchClothes());
    };

    return (
        <>
            <ImportChoice
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onPicked={handleImagePicked}
            />
            <ModalAddClothInfo
                open={infoModalOpen}
                onCancel={() => setInfoModalOpen(false)}
                onSave={handleSaveNewCloth}
                imageUri={newImageUri}
            />
            <View style={styles.dressingScreen}>
                <View style={styles.titleBox}>
                    <View style={styles.titleTextBox}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>
                    <TouchableOpacity onPress={addCloths}>
                        <AddButton />
                    </TouchableOpacity>
                </View>

                {/* Tools Box */}
                <View style={styles.toolBox}>
                    <View style={styles.filterBox}>
                        <DropdownMenu />
                    </View>
                </View>

                {/*Cloths Galery*/}
                {!clothes || clothes.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <TouchableOpacity onPress={addCloths}>
                            <Text style={styles.emptyBoxText}>
                                Ajouter des Vêtements
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={clothes}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={{
                            padding: 8,
                            paddingBottom: 180,
                        }}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={({ item }) => {
                            return <ClothItem source={{ uri: item.resized_url || item.image_url }} clothingItem={item} />;
                        }}
                        showsVerticalScrollIndicator={false}
                        overScrollMode="never"
                        indicatorStyle="black"
                    />
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    dressingScreen: {
        paddingHorizontal: 10,
    },
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleTextBox: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    subtitle: {
        fontSize: 14,
        color: '#7A7A7A',
    },

    toolBox: {
        marginVertical: 10,
    },
    filterBox: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    emptyBox: {
        height: '80%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyBoxText: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 600,
        color: lightTheme.colors.primary,
    },
    modalContentContainer: {
        width: '70%',
        height: 150,
        alignSelf: 'center',
        borderRadius: 15,
    },
});
