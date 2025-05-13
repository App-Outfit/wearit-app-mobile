import * as React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { lightTheme } from '../../../styles/theme';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const ClothItem = ({ source }: any) => {
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
