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
import { AddButton } from '../../../components/core/Buttons';
import DropdownMenu from '../component/DropDownMenu';
import { lightTheme } from '../../../styles/theme';
import { DressingNavigatorParamList } from '../navigation/DressingNavigator';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { handleCamera, handleGallery } from './Camera';
import { Modal, PaperProvider, Portal } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { ClothItem } from '../component/ClothItem';

export type DressingClothGaleryScreenProps = NativeStackScreenProps<
    DressingNavigatorParamList,
    'DressingClothGalery'
>;
export function DressingClothGaleryScreen({
    route,
}: DressingClothGaleryScreenProps) {
    const { title, subtitle, clothes } = route.params;
    const [newImageUri, setNewImageUri] = React.useState(null);

    const [visibleModal, setModalVisible] = React.useState(false);

    const addCloths = () => {
        setModalVisible(true);
    };

    const openCamera = () => {
        handleCamera(setNewImageUri);
    };

    const openGalery = () => {
        handleGallery(setNewImageUri);
    };

    return (
        <>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContentContainer}
                    theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
                >
                    <LinearGradient
                        colors={['#bfa2db', '#fff']}
                        style={{
                            width: '100%',
                            height: '100%',
                            padding: 20,
                            borderRadius: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={openCamera}
                            style={{
                                marginRight: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome
                                name="camera"
                                size={40}
                                style={{ marginBottom: 5 }}
                            />
                            <Text>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={openGalery}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome
                                name="picture-o"
                                size={40}
                                style={{ marginBottom: 5 }}
                            />
                            <Text>Galerie</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </Modal>
            </Portal>
            <View style={styles.dressingScreen}>
                <View style={styles.titleBox}>
                    <View style={styles.titleTextBox}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>
                    <TouchableOpacity onPress={addCloths}>
                        <AddButton />
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
                            <Text
                                style={styles.emptyBoxText}
                                onPress={addCloths}
                            >
                                Ajouter des Vêtements
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={clothes}
                        keyExtractor={(_, idx) => idx.toString()}
                        numColumns={2}
                        contentContainerStyle={{
                            padding: 8,
                            paddingBottom: 180,
                        }}
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
        </>
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
    },
    emptyBoxText: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 600,
        color: lightTheme.colors.primary,
    },
    modalContentContainer: {
        width: '70%',
        height: 150,
        alignSelf: 'center',
        borderRadius: 15,
    },
});
