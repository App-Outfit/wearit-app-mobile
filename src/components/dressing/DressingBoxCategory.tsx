import * as React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ImageSourcePropType,
    TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { AddCircleButton } from '../core/Buttons';

type DressinBoxCategoryProps = {
    name_category: string;
    nb_clothes: number;
    imgs: ImageSourcePropType[];
};

export const DressingBoxCategory: React.FC<DressinBoxCategoryProps> = ({
    name_category,
    nb_clothes,
    imgs,
}) => {
    const defaultImg = require('../../assets/images/exemples/clothing.jpg');

    const displayImgs: ImageSourcePropType[] = imgs.slice(0, 3);

    const display1 =
        displayImgs.length === 0 ? (
            <View style={[styles.image, styles.image1]}>
                <View style={{ position: 'absolute', bottom: 30, right: 20 }}>
                    <AddCircleButton onPress={() => console.log('Add')} />
                </View>
            </View>
        ) : (
            <Image
                source={'' || displayImgs[0]}
                style={[styles.image, styles.image1]}
            />
        );

    return (
        <View style={styles.boxContainer}>
            <Entypo
                name="dots-three-vertical"
                size={16}
                color="#1E1E1E"
                style={styles.menuIcon}
            />

            <View style={styles.purpleBackground} />

            {/* Image stack */}
            <View style={styles.imageStack}>
                {display1}
                <Image
                    source={'' || displayImgs[1]}
                    style={[styles.image, styles.image2]}
                />
                <Image
                    source={'' || displayImgs[1]}
                    style={[styles.image, styles.image3]}
                />
            </View>

            {/* Text content */}
            <Text style={styles.title}>{name_category}</Text>
            <Text style={styles.subtitle}>{nb_clothes} Vêtements</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    boxContainer: {
        width: 165,
        height: 225,
        marginBottom: 30,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 12,
        position: 'relative',
    },
    menuIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    purpleBackground: {
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        height: 74,
        width: 165,
        backgroundColor: '#f5eaff',
        borderRadius: 20,
    },
    imageStack: {
        position: 'absolute',
        top: 30,
        left: 18,
        right: 0,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        position: 'absolute',
        resizeMode: 'cover',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    image1: {
        zIndex: 3,
        top: 25,
        left: 0,
        width: 65,
        height: 90,
        boxShadow: '4px 4px 15px -2px #00000040',
    },
    image2: {
        zIndex: 2,
        top: -5,
        left: 10,
        width: 76,
        height: 106,
        boxShadow: '4px 0px 4px 0px #00000040',
    },
    image3: {
        zIndex: 1,
        top: -40,
        left: 20,
        width: 90,
        height: 126,
        boxShadow: '4px 0px 15px -6px #00000040',
    },
    title: {
        position: 'absolute',
        bottom: 28,
        left: 12,
        right: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    subtitle: {
        position: 'absolute',
        bottom: 8,
        left: 12,
        fontSize: 12,
        color: '#7A7A7A',
    },
});
