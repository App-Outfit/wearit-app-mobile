import * as React from 'react';
import { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ImageSourcePropType,
    TouchableOpacity,
} from 'react-native';

import { Searchbar, IconButton, Portal, Modal } from 'react-native-paper';

import { DressingBoxCategory } from '../component/DressingBoxCategory';
import { lightTheme } from '../../../styles/theme';
import DropdownMenu from '../component/DropDownMenu';
import { InputField } from '../../../components/core/PlaceHolders';
import { CButton } from '../../../components/core/Buttons';

import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import {
    createCategory,
    loadCategories,
    loadClothesByType,
} from '../slices/dressingSlice';

type TypeDataPersonalCategory = {
    id: string;
    name: string;
    nb_clothes: number;
    cloths: ImageSourcePropType[];
};

const img1 = require('../../../assets/images/exemples/clothing.jpg');
const img2 = require('../../../assets/images/exemples/clothing2.jpg');

// const data_personal_category: TypeDataPersonalCategory[] = [
//     {
//         id: '1',
//         name: 'Mes T-shirts favoris',
//         nb_clothes: 9,
//         cloths: [img1, img1, img1, img1, img1],
//     },
//     {
//         id: '2',
//         name: 'Mes jeans préférés',
//         nb_clothes: 4,
//         cloths: [img2, img2, img2, img2, img2],
//     },
//     {
//         id: '3',
//         name: 'Mes jeans préférés',
//         nb_clothes: 4,
//         cloths: [img1, img2, img1, img2, img1],
//     },
//     {
//         id: '4',
//         name: 'Mes jeans préférés',
//         nb_clothes: 4,
//         cloths: [],
//     },
//     {
//         id: '5',
//         name: 'Mes jeans préférés',
//         nb_clothes: 4,
//         cloths: [img1, img2],
//     },
// ];

export function DressingHomeScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [visibleModal, setModalVisible] = React.useState(false);

    const dispatch = useAppDispatch();
    // categories est un CategoryResponse[] : {id, user_id, name, created_at}[]
    const categories = useAppSelector((state) => state.dressing.categories);

    const [newCategory, setNewCategory] = React.useState('');

    // état local enrichi pour la FlatList
    const [categoriesData, setCategoriesData] = React.useState<
        TypeDataPersonalCategory[]
    >([]);

    useEffect(() => {
        dispatch(loadCategories())
            .unwrap()
            .then(async (cats) /* cats: CategoryResponse[] */ => {
                const data = await Promise.all(
                    cats.map(async (cat) => {
                        const items = await dispatch(
                            loadClothesByType(cat.name),
                        ).unwrap();
                        return {
                            id: cat.id,
                            name: cat.name,
                            nb_clothes: items.length,
                            cloths: items
                                .slice(0, 5)
                                .map(
                                    (i) =>
                                        ({
                                            uri: i.image_url,
                                        }) as ImageSourcePropType,
                                ),
                        } as TypeDataPersonalCategory;
                    }),
                );
                setCategoriesData([
                    { id: 'add', name: '', nb_clothes: 0, cloths: [] },
                    ...data,
                ]);
            })
            .catch((err) => {
                console.error('Erreur catégories :', err);
            });
    }, [dispatch]);

    const handleCreateCategory = () => {
        if (!newCategory.trim()) return;
        dispatch(createCategory({ name: newCategory }))
            .unwrap()
            .then((newCat) => {
                setModalVisible(false);
                setNewCategory('');
                // 1) on crée l'objet TypeDataPersonalCategory vide pour ce newCat
                setCategoriesData((prev) => [
                    prev[0], // conserve le bouton "add"
                    {
                        id: newCat.id,
                        name: newCat.name,
                        nb_clothes: 0,
                        cloths: [],
                    },
                    ...prev.slice(1),
                ]);
            })
            .catch((err) => console.error('Erreur création catégorie', err));
    };

    const navigateToClothGalery = (
        title: string,
        subtitle: string,
        clothes: ImageSourcePropType[],
    ) => {
        navigation.push('DressingClothGalery', {
            title: title,
            subtitle: subtitle,
            clothes: clothes,
        });
    };

    return (
        <>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContentContainer}
                    theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
                >
                    <Text
                        style={{
                            fontWeight: 700,
                            marginBottom: 20,
                            fontSize: 20,
                        }}
                    >
                        Nommez votre catégorie
                    </Text>
                    <InputField
                        placeholder="Nom de la catégorie"
                        value={newCategory}
                        onChangeText={setNewCategory}
                    />
                    <CButton size="xlarge" onPress={handleCreateCategory}>
                        Créer
                    </CButton>
                </Modal>
            </Portal>
            <View>
                {/* SearchBar Box */}
                <View style={styles.searchBarBox}>
                    <Searchbar
                        placeholder="Rechercher..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={{
                            backgroundColor: 'white',
                            borderColor: '#E6E6E6',
                            borderWidth: 1.5,
                            borderRadius: 8,
                            marginVertical: 'auto',
                        }}
                        inputStyle={{
                            color: 'black',
                            fontSize: 16,
                        }}
                        iconColor="#B3B3B3"
                        placeholderTextColor="#808080"
                    />
                </View>

                {/* Tools Box */}
                <View style={styles.toolBox}>
                    <View style={styles.filterBox}>
                        <DropdownMenu />
                    </View>
                </View>

                {/* Categories Box */}
                <FlatList
                    data={categoriesData}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8, paddingBottom: 200 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => {
                        // bouton "Ajouter une nouvelle catégorie"
                        if (item.id === 'add') {
                            return (
                                <View style={styles.addCategoryButtonBox}>
                                    <IconButton
                                        style={styles.addCategoryButton}
                                        icon="plus"
                                        iconColor="white"
                                        size={28}
                                        onPress={() => setModalVisible(true)}
                                    />
                                    <Text style={styles.titleAddButton}>
                                        Ajouter une nouvelle catégorie
                                    </Text>
                                </View>
                            );
                        }

                        // une vraie catégorie
                        return (
                            <TouchableOpacity
                                style={{ paddingTop: 5 }}
                                onPress={() =>
                                    navigateToClothGalery(
                                        item.name,
                                        `${item.nb_clothes} vêtements`,
                                        item.cloths,
                                    )
                                }
                            >
                                <DressingBoxCategory
                                    name_category={item.name}
                                    nb_clothes={item.nb_clothes}
                                    imgs={item.cloths}
                                />
                            </TouchableOpacity>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    indicatorStyle="black"
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    searchBarBox: {
        marginVertical: 15,
    },
    toolBox: {
        marginBottom: 20,
    },
    filterBox: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    addCategoryButtonBox: {
        width: 165,
        height: 225,
        marginBottom: 30,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 12,
        position: 'relative',
        // borderColor: "black",
        // borderWidth: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },
    titleAddButton: {
        position: 'absolute',
        bottom: 11,
        left: 12,
        right: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
        textAlign: 'center',
    },
    addCategoryButton: {
        backgroundColor: lightTheme.colors.primary,
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    modalContentContainer: {
        width: '85%',
        alignSelf: 'center',
        borderRadius: 15,
        padding: 20,
        backgroundColor: '#fff',
    },
});
