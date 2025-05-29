import * as React from 'react';

import { View, Image, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { formatPrice } from '../../../utils/representation';

export const ClothDetailDressingItem = ({ image, title, subtitle }: any) => {
    return (
        <View style={styleClothItem.box}>
            <View style={styleClothItem.imageBox}>
                <Image source={image} style={styleClothItem.image} />
            </View>

            <View style={styleClothItem.textBox}>
                <View style={styleClothItem.titleBox}>
                    <Text style={styleClothItem.title}>{title}</Text>
                    <Text style={styleClothItem.subtitle}>{subtitle}</Text>
                </View>

                <View
                    style={[
                        styleClothItem.bottomBox,
                        { justifyContent: 'flex-end' },
                    ]}
                >
                    <Text style={styleClothItem.categoryText}>Dressing</Text>
                </View>

                <View style={styleClothItem.removeBtnBox}>
                    <FontAwesome name="trash-o" size={20} color={'#ED1068'} />
                </View>
            </View>
        </View>
    );
};

export const ClothDetailMarketplaceItem = ({
    image,
    title,
    subtitle,
    price,
}: any) => {
    const price_formated = formatPrice(price);

    return (
        <View style={styleClothItem.box}>
            <View style={styleClothItem.imageBox}>
                <Image source={image} style={styleClothItem.image} />
            </View>

            <View style={styleClothItem.textBox}>
                <View style={styleClothItem.titleBox}>
                    <Text style={styleClothItem.title}>{title}</Text>
                    <Text style={styleClothItem.subtitle}>{subtitle}</Text>
                </View>

                <View style={styleClothItem.bottomBox}>
                    <Text style={styleClothItem.priceText}>
                        {price_formated}
                    </Text>
                    <Text style={styleClothItem.categoryText}>Marketplace</Text>
                </View>

                <View style={styleClothItem.removeBtnBox}>
                    <FontAwesome name="trash-o" size={20} color={'#ED1068'} />
                </View>
            </View>
        </View>
    );
};

const styleClothItem = StyleSheet.create({
    box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 110,
        marginTop: 15,
        borderColor: '#E6E6E6',
        borderWidth: 1,
        padding: 15,
        borderRadius: 15,
        position: 'relative',
    },
    imageBox: {
        width: 80,
        height: 80,
        borderRadius: 15,
        overflow: 'hidden',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 15,
        objectFit: 'contain',
    },
    textBox: {
        flex: 1,
        marginLeft: 15,
        height: 80,
        justifyContent: 'space-between',
    },
    titleBox: {},
    title: {
        fontSize: 20,
        fontWeight: 700,
    },
    subtitle: {
        color: '#808080',
    },
    bottomBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceText: {
        fontWeight: 700,
        fontSize: 16,
    },
    categoryText: {
        alignSelf: 'flex-end',
        color: '#808080',
    },
    removeBtnBox: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
});
