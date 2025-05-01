import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DressingNavigatorParamList } from '../../navigation/DressingNavigation/DressingNavigator';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import {
    View,
    Image,
    StyleSheet,
    Touchable,
    TouchableOpacity,
    Text,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

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
                            <View style={styles.chip}>
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outfitScreen: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 40,
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
});
