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
import MainTabNavigator from '../../navigation/NavigationComponents/MainTabNavigator';
import { Searchbar, Menu, Button, IconButton } from 'react-native-paper';

import { DressingBoxCategory } from '../../components/dressing/DressingBoxCategory';
import Entypo from 'react-native-vector-icons/Entypo';
import { lightTheme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../../components/dressing/DropDownMenu';

type TypeDataPersonalCategory = {
    id: string;
    name: string;
    nb_clothes: number;
    cloths: ImageSourcePropType[];
};

const img1 = require('../../assets/images/exemples/clothing.jpg');
const img2 = require('../../assets/images/exemples/clothing2.jpg');

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
    const [searchQuery, setSearchQuery] = React.useState('');

    const navigateToClothGalery = () => {
        navigation.push('DressingClothGalery', {
            param: 'value',
        });
    };
    // const dressing_box_categories = data_personal_category.map((items, index) => {
    //     return <DressingBoxCategory key={index}/>
    // })

    return (
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
                data={data_personal_category}
                keyExtractor={(itm) => itm.id}
                numColumns={2}
                contentContainerStyle={{ padding: 8, paddingBottom: 200 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item, index }) => {
                    if (index === 0) {
                        return (
                            <View style={styles.addCategoryButtonBox}>
                                <IconButton
                                    style={styles.addCategoryButton}
                                    icon="plus"
                                    iconColor="white"
                                    size={28}
                                    onPress={() => console.log('Pressed')}
                                />
                                <Text style={styles.titleAddButton}>
                                    Ajouter une nouvelle catégorie
                                </Text>
                            </View>
                        );
                    }

                    const realItem = data_personal_category[index - 1];
                    return (
                        <TouchableOpacity
                            style={{ paddingTop: 5 }}
                            onPress={navigateToClothGalery}
                        >
                            <DressingBoxCategory
                                name_category={realItem.name}
                                nb_clothes={realItem.nb_clothes}
                                imgs={realItem.cloths}
                            />
                        </TouchableOpacity>
                    );
                }}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                indicatorStyle="black"
            />
        </View>
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
});
