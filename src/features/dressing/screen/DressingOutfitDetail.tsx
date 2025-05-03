import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DressingNavigatorParamList } from '../navigation/DressingNavigator';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import {
    View,
    Image,
    StyleSheet,
    Touchable,
    TouchableOpacity,
    Text,
    ImageSourcePropType,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import { formatPrice } from '../../../utils/representation';
import { InputField } from '../../../components/core/PlaceHolders';
import { ToggleButton } from '../../../components/core/Toggle';
import { CButton } from '../../../components/core/Buttons';
import {
    ClothDetailDressingItem,
    ClothDetailMarketplaceItem,
} from '../component/ClothDetail';

const cloth1 = require('../../../assets/images/exemples/clothing.jpg');
const cloth2 = require('../../../assets/images/exemples/clothing2.jpg');

type ClothDetailMarketplace = {
    name: string;
    image_cloth: ImageSourcePropType;
    place: 'Marketplace';
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    price: number;
    url_cloth: string;
};

type ClothDetailDressing = {
    name: string;
    image_cloth: ImageSourcePropType;
    place: 'Dressing';
    category_place: string;
};

const data_details: Array<ClothDetailMarketplace | ClothDetailDressing> = [
    {
        name: 'T-shirt simple noir',
        image_cloth: cloth1,
        place: 'Marketplace',
        size: 'L',
        price: 1190,
        url_cloth: 'https://some-contents.com',
    },
    {
        name: 'T-shirt simple noir',
        image_cloth: cloth1,
        place: 'Marketplace',
        size: 'L',
        price: 1190,
        url_cloth: 'https://some-contents.com',
    },
    {
        name: 'T-shirt basique',
        image_cloth: cloth2,
        place: 'Dressing',
        category_place: 'Mes t-shirts basique',
    },
];

export type DressingClothGaleryScreenProps = NativeStackScreenProps<
    DressingNavigatorParamList,
    'DressingOutfitDetail'
>;

export function DressingOutfitDetail({
    route,
    navigation,
}: DressingClothGaleryScreenProps) {
    const { outfit_image } = route.params;

    const goBack = () => navigation.goBack();

    const listTag = ['basique', 'cool', 'soirée'];

    return (
        <View style={styles.outfitScreen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                indicatorStyle="black"
            >
                {/*Image FullSize Display */}
                <View style={styles.imageFullBox}>
                    <Image source={outfit_image} style={styles.image} />

                    <TouchableOpacity onPress={goBack} style={styles.goBackBtn}>
                        <Feather
                            name="arrow-left"
                            size={25}
                            color="#000"
                            style={styles.iconGoBack}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={goBack}
                        style={[styles.goBackBtn, styles.moreBtn]}
                    >
                        <Feather
                            name="more-vertical"
                            size={25}
                            color="#000"
                            style={styles.iconGoBack}
                        />
                    </TouchableOpacity>
                </View>

                {/*Tag Box */}
                <View style={styles.tagBox}>
                    {listTag.map((itm, idx) => {
                        return (
                            <View key={idx.toString()} style={styles.chip}>
                                <Text style={styles.chipText}>{itm}</Text>
                            </View>
                        );
                    })}
                    <TouchableOpacity
                        onPress={() => console.log('add tag')}
                        style={[styles.chip, styles.addTagBtn]}
                    >
                        <Feather name="plus" size={13} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/*Détails Clothes */}
                <View style={styles.detailBox}>
                    <View style={styles.detailTitleBox}>
                        <Text style={styles.detailTitle}>Détails</Text>
                        <Text style={styles.detailSubtitle}>
                            {data_details.length} Vêtements
                        </Text>
                    </View>

                    <View style={styles.detailList}>
                        {data_details.map((item, index) => {
                            return item.place === 'Marketplace' ? (
                                <ClothDetailMarketplaceItem
                                    image={item.image_cloth}
                                    title={item.name}
                                    subtitle={`Taille ${item.size}`}
                                    price={item.price}
                                    key={index.toString()}
                                />
                            ) : (
                                <ClothDetailDressingItem
                                    image={item.image_cloth}
                                    title={item.name}
                                    subtitle={item.category_place}
                                    key={index.toString()}
                                />
                            );
                        })}
                    </View>
                </View>

                <TouchableOpacity style={{ padding: 16 }}>
                    <CButton
                        variant="secondary"
                        onPress={() => {
                            navigation.goBack();
                            navigation.navigate('VirtualTryOn');
                        }}
                        size="xlarge"
                    >
                        Retour à l'essayage
                    </CButton>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outfitScreen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 40,
        backgroundColor: '#fff',
    },
    imageFullBox: {
        height: 520,
        width: '100%',
    },
    image: {
        objectFit: 'cover',
        height: 520,
    },
    goBackBtn: {
        position: 'absolute',
        top: 10,
        left: 10,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    moreBtn: {
        left: undefined,
        right: 10,
    },
    iconGoBack: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    tagBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    chip: {
        width: 70,
        height: 30,
        borderRadius: 15,
        margin: 3,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#fff',
    },
    addTagBtn: {
        width: 30,
    },

    detailBox: {
        paddingHorizontal: 16,
        marginVertical: 20,
        flexDirection: 'column',
    },
    detailTitleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        fontWeight: 700,
    },
    detailSubtitle: {
        fontSize: 14,
    },
    detailList: {},
});
