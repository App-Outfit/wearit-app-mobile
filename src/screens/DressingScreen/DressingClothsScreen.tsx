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
import { AddButton } from '../../components/core/Buttons';
import DropdownMenu from '../../components/dressing/DropDownMenu';
import { lightTheme } from '../../styles/theme';
import { DressingNavigatorParamList } from '../../navigation/DressingNavigation/DressingNavigator';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const img1 = require('../../assets/images/exemples/clothing.jpg');
const img2 = require('../../assets/images/exemples/clothing2.jpg');

const data = [
    {
        id: '1',
        img: img1,
    },
    {
        id: '2',
        img: img2,
    },
    {
        id: '3',
        img: img1,
    },
    {
        id: '4',
        img: img1,
    },
    {
        id: '5',
        img: img1,
    },
    {
        id: '6',
        img: img1,
    },
    {
        id: '7',
        img: img1,
    },
    {
        id: '9',
        img: img1,
    },
];

export type DressingClothGaleryScreenProps = NativeStackScreenProps<
    DressingNavigatorParamList,
    'DressingClothGalery'
>;
export function DressingClothGaleryScreen({
    route,
}: DressingClothGaleryScreenProps) {
    const { title, subtitle, clothes } = route.params;

    const addCloths = () => console.log('add clothes');

    return (
        <View style={styles.dressingScreen}>
            <View style={styles.titleBox}>
                <View style={styles.titleTextBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                <TouchableOpacity>
                    <AddButton onPress={addCloths} />
                </TouchableOpacity>
            </View>

            {/* Tools Box */}
            <View style={styles.toolBox}>
                <View style={styles.filterBox}>
                    <DropdownMenu />
                </View>
            </View>

            {/*Cloths Galery*/}
            {clothes.length === 0 ? (
                <View style={styles.emptyBox}>
                    <TouchableOpacity>
                        <Text style={styles.emptyBoxText} onPress={addCloths}>
                            Ajouter des Vêtements
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={clothes}
                    keyExtractor={(_, idx) => idx.toString()}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8, paddingBottom: 180 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item, index }) => {
                        return <ClothItem source={item} />;
                    }}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    indicatorStyle="black"
                />
            )}
        </View>
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
        // borderColor: "black",
        // borderWidth: 1
    },
    emptyBoxText: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 600,
        color: lightTheme.colors.primary,
    },
});

const ClothItem = ({ source }: any) => {
    const tryCloth = () => console.log('try cloth');
    const removeCloth = () => console.log('remove cloth');

    return (
        <View style={styleImage.boxImage}>
            <Image source={source} style={styleImage.img} />
            <TouchableOpacity onPress={tryCloth} style={styleImage.textBox}>
                <Text style={styleImage.text}>Essayer</Text>
            </TouchableOpacity>

            {/*Remove btn */}
            <TouchableOpacity
                onPress={removeCloth}
                style={styleImage.removeBtnBox}
            >
                <FontAwesome name="trash-o" size={20} color={'black'} />
            </TouchableOpacity>
        </View>
    );
};

const styleImage = StyleSheet.create({
    boxImage: {
        width: 160,
        height: 210,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 25,
    },
    img: {
        width: 160,
        height: 210,
        resizeMode: 'cover',
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0px 0px 8px -3px #00000040',
    },
    textBox: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    text: {
        textAlign: 'left',
        color: lightTheme.colors.primary,
        fontFamily: 'Poppins',
        fontWeight: 700,
    },
    removeBtnBox: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
});
