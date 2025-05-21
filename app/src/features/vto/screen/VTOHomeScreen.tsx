import * as React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setUpper, setLower, setDress } from '../slice/TryonSlice';
import type { ClothData } from '../slice/sampleTryons';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';
import VTODisplay from '../component/VTODisplay';

import Feather from 'react-native-vector-icons/Feather';

export function VTODressingScreen() {
    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <View style={styles.container}>
                <View style={styles.vtoDisplayContainer}>
                    <VTODisplay />
                </View>
                <View style={styles.scrollComponent}>
                    <MiniDressing />
                </View>
            </View>

            <View style={styles.iconComponent}>
                <TouchableOpacity style={styles.icon}>
                    <Feather name="filter" size={20} />
                    <Text style={styles.textIcon}>Filtrer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon}>
                    <Feather name="bookmark" size={20} />
                    <Text style={styles.textIcon}>Enregistrer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon}>
                    <Feather name="share-2" size={20} />
                    <Text style={styles.textIcon}>Partager</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.iconComponent, styles.iconTopComponent]}>
                <TouchableOpacity style={[styles.icon, { marginBottom: 5 }]}>
                    <Feather name="rotate-ccw" size={15} />
                    <Text style={styles.textIcon}>Filtrer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    vtoDisplayContainer: {
        flex: 3,
        marginRight: 10,
        height: '95%',

        borderBlockColor: '#fff',
        borderWidth: 1,
    },
    scrollComponent: {
        flex: 1,
    },

    iconComponent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        width: 60,
    },
    iconTopComponent: {
        top: 0,
        bottom: null,
        borderTopRightRadius: 0,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    textIcon: {
        fontSize: 10,
        margin: 0,
        marginTop: 5,
    },
});

function MiniDressing() {
    const dispatch = useDispatch();

    const onSelect = (cloth: ClothData) => {
        const tryon = sampleTryons.find((t) => t.cloth_id === cloth.cloth_id);
        if (!tryon) return;
        if (cloth.category === 'dress') {
            dispatch(setDress(tryon));
        } else if (cloth.category === 'upper') {
            dispatch(setUpper(tryon));
        } else {
            dispatch(setLower(tryon));
        }
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styleDressing.scrollViewContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            {sampleCloths.map((cloth: ClothData, idx: number) => (
                <TouchableOpacity
                    key={idx}
                    onPress={() => onSelect(cloth)}
                    style={styleDressing.imgBox}
                >
                    <Image source={cloth.cloth_url} style={styleDressing.img} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styleDressing = StyleSheet.create({
    scrollView: {},
    scrollViewContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-end',
        width: '100%',
    },
    imgBox: {
        width: 90,
        height: 140,
        marginBottom: 8,
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
