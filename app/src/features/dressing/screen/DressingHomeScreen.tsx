import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ImageSourcePropType,
    TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MainTabNavigator from '../../../navigation/NavigationComponents/MainTabNavigator';
import {
    Searchbar,
    Menu,
    Button,
    IconButton,
    Portal,
    Modal,
} from 'react-native-paper';

import { DressingBoxCategory } from '../component/DressingBoxCategory';
import Entypo from 'react-native-vector-icons/Entypo';
import { lightTheme } from '../../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../component/DropDownMenu';
import { InputField } from '../../../components/core/PlaceHolders';
import { CButton } from '../../../components/core/Buttons';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { selectAllClothes } from '../../clothing/clothingSelectors';
import { fetchClothes } from '../../clothing/clothingThunks';

type TypeDataPersonalCategory = {
    id: string;
    name: string;
    nb_clothes: number;
    cloths: ImageSourcePropType[];
};

const img1 = require('../../../assets/images/exemples/clothing.jpg');
const img2 = require('../../../assets/images/exemples/clothing2.jpg');

const data_personal_category: TypeDataPersonalCategory[] = [
    {
        id: '1',
        name: 'Mes T-shirts favoris',
        nb_clothes: 9,
        cloths: [img1, img1, img1, img1, img1],
    },
    {
        id: '2',
        name: 'Mes jeans préférés',
        nb_clothes: 4,
        cloths: [img2, img2, img2, img2, img2],
    },
    {
        id: '3',
        name: 'Mes jeans préférés',
        nb_clothes: 4,
        cloths: [img1, img2, img1, img2, img1],
    },
    {
        id: '4',
        name: 'Mes jeans préférés',
        nb_clothes: 4,
        cloths: [],
    },
    {
        id: '5',
        name: 'Mes jeans préférés',
        nb_clothes: 4,
        cloths: [img1, img2],
    },
];

export function DressingHomeScreen({ navigation }: any) {
    const dispatch = useAppDispatch();
    const allClothes = useAppSelector(selectAllClothes);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [visibleModal, setModalVisible] = React.useState(false);

    // Fetch clothes on mount
    React.useEffect(() => {
        dispatch(fetchClothes());
    }, [dispatch]);

    // Grouper par catégorie (upper, lower, dress)
    const categorizedClothes = React.useMemo(() => {
        const categories = {
            upper: { name: 'Hauts', clothes: [] as any[] },
            lower: { name: 'Bas', clothes: [] as any[] },
            dress: { name: 'Robes', clothes: [] as any[] },
        };
        
        allClothes.forEach(cloth => {
            if (categories[cloth.cloth_type]) {
                categories[cloth.cloth_type].clothes.push(cloth);
            }
        });
        
        return Object.entries(categories).map(([type, data]) => ({
            id: type,
            name: data.name,
            nb_clothes: data.clothes.length,
            cloths: data.clothes.map(c => ({ uri: c.resized_url || c.image_url })),
            cloth_type: type as 'upper' | 'lower' | 'dress',
        }));
    }, [allClothes]);

    const navigateToClothGalery = (
        title: string,
        subtitle: string,
        cloth_type: 'upper' | 'lower' | 'dress',
    ) => {
        navigation.push('DressingClothGalery', {
            title: title,
            subtitle: subtitle,
            cloth_type: cloth_type,
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
                    <InputField placeholder="Nom de la catégorie" />
                    <CButton size="xlarge" onPress={() => {}}>
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
                    data={categorizedClothes}
                    keyExtractor={(itm) => itm.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8, paddingBottom: 200 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                style={{ paddingTop: 5 }}
                                onPress={() =>
                                    navigateToClothGalery(
                                        item.name,
                                        `${item.nb_clothes} vêtement${item.nb_clothes > 1 ? 's' : ''}`,
                                        item.cloth_type,
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
