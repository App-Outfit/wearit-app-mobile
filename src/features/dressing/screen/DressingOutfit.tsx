import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ImageSourcePropType,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Searchbar, Menu, Button, IconButton } from 'react-native-paper';

import { DressingBoxCategory } from '../component/DressingBoxCategory';
import DropdownMenu from '../component/DropDownMenu';
import { AddButton } from '../../../components/core/Buttons';
import { OutfitItem } from '../component/OutfitDetail';

type TypeDataOutfit = {
    name: string;
    nb_clothes: number;
    image_outfit: ImageSourcePropType;
    cloths: ImageSourcePropType[];
};

const img1 = require('../../../assets/images/exemples/clothing.jpg');
const img2 = require('../../../assets/images/exemples/clothing2.jpg');
const outfit1 = require('../../../assets/images/exemples/outfit1.jpg');
const outfit2 = require('../../../assets/images/exemples/outfit2.jpg');
const outfit3 = require('../../../assets/images/exemples/outfit3.jpg');

const data_outfit: TypeDataOutfit[] = [
    {
        name: 'Outfit basique',
        nb_clothes: 9,
        image_outfit: outfit1,
        cloths: [img1, img1, img1, img1, img1],
    },
    {
        name: 'Outfit ténébreux',
        image_outfit: outfit2,
        nb_clothes: 5,
        cloths: [img2, img2, img2, img2, img2],
    },
    {
        name: 'Outfit stylé',
        nb_clothes: 5,
        image_outfit: outfit3,
        cloths: [img1, img2, img1, img2, img1],
    },
    {
        name: 'Outfit basique',
        nb_clothes: 9,
        image_outfit: outfit2,
        cloths: [img1, img1, img1, img1, img1],
    },
    {
        name: 'Outfit basique',
        nb_clothes: 9,
        image_outfit: outfit3,
        cloths: [img1, img1, img1, img1, img1],
    },
];

export function DressingOutfitScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const addOutfit = () => console.log('add outfit');

    const navigToDetail = (outfit_image: ImageSourcePropType) => {
        navigation.push('DressingOutfitDetail', {
            outfit_image: outfit_image,
        });
    };

    return (
        <View>
            {/* SearchBar Box */}
            <View style={styles.searchBarBox}>
                <Searchbar
                    placeholder="Rechercher..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{
                        color: 'black',
                        fontSize: 16,
                    }}
                    iconColor="#B3B3B3"
                    placeholderTextColor="#808080"
                />

                <AddButton onPressFunction={addOutfit} />
            </View>

            {/* Tools Box */}
            <View style={styles.toolBox}>
                <View style={styles.filterBox}>
                    <DropdownMenu />
                </View>
            </View>

            {/* Outfit Box */}
            <FlatList
                data={data_outfit}
                keyExtractor={(_, idx) => idx.toString()}
                numColumns={2}
                contentContainerStyle={{ padding: 8, paddingBottom: 200 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            style={{ paddingTop: 5 }}
                            onPress={() => navigToDetail(item.image_outfit)}
                        >
                            <OutfitItem
                                source={item.image_outfit}
                                title={item.name}
                                subtitle={`${item.nb_clothes} vetements`}
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
        flexDirection: 'row',
    },
    searchBar: {
        backgroundColor: 'white',
        borderColor: '#E6E6E6',
        borderWidth: 1.5,
        borderRadius: 8,
        marginVertical: 'auto',
        marginRight: 10,
        flex: 0.95,
    },
    toolBox: {
        marginBottom: 0,
    },
    filterBox: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
});
