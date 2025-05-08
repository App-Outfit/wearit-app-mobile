import * as React from 'react';

import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function OutfitItem({ source, title, subtitle }: any) {
    return (
        <View style={styles.imageBox}>
            <Image source={source} style={styles.image} />

            <View style={styles.textBox}>
                <Text style={styles.text}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            {/*Menu btn */}
            <TouchableOpacity
                onPress={() => {}}
                style={styles.detailBtnBox}
            ></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    imageBox: {
        width: 160,
        height: 180,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 45,
    },
    image: {
        width: 160,
        height: 210,
        resizeMode: 'contain',
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0px 0px 8px -3px #00000040',
    },
    textBox: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    text: {
        textAlign: 'left',
        fontFamily: 'Poppins',
        fontWeight: 700,
        color: '#000',
    },
    subtitle: {},
    detailBtnBox: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
});
