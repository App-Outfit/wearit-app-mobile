import * as React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Portal, Modal } from 'react-native-paper';
import { setUpper, setLower, setDress } from '../slice/TryonSlice';
import type { ClothData } from '../slice/sampleTryons';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';
import VTODisplay from '../component/VTODisplay';

import Feather from 'react-native-vector-icons/Feather';
import { baseColors, spacing } from '../../../styles/theme';
import { ImportChoice } from '../../../components/choice_component/ImportChoice';
import { ModalAddClothInfo } from '../component/ModalAddClothInfo';

export function VTODressingScreen() {
    return (
        <View style={{ flex: 1, position: 'relative', margin: 14 }}>
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
        padding: spacing.medium,
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
        marginTop: spacing.xSmall,
    },
});

function MiniDressing() {
    const dispatch = useDispatch();
    const [newPictureUri, setNewPictureUri] = React.useState<string | null>(
        null,
    );
    const [importModalOpen, setImportModalOpen] = React.useState(false);
    const [infoModalOpen, setInfoModalOpen] = React.useState(true);
    const openModalAddCloth = () => {
        setImportModalOpen(true);
    };

    const [customCloths, setCustomCloths] = React.useState<ClothData[]>([]);
    const allCloths = [...sampleCloths, ...customCloths];

    const handleImagePicked = (uri) => {
        setImportModalOpen(false);
        if (uri) {
            setNewPictureUri(uri);
            setInfoModalOpen(true);
        }
    };

    const handleSaveNewCloth = ({ cloth_type, category, cloth_id }) => {
        if (newPictureUri) {
            const newCloth: ClothData = {
                cloth_type,
                category,
                cloth_id,
                cloth_url: { uri: newPictureUri },
            };
            setCustomCloths((prev) => [...prev, newCloth]);
            setNewPictureUri(null);
        }
        setInfoModalOpen(false);
    };

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
            {allCloths.map((cloth: ClothData, idx: number) => {
                if (idx === 0) {
                    return (
                        <TouchableOpacity
                            key={0}
                            onPress={openModalAddCloth}
                            style={styleDressing.addButton}
                        >
                            <View style={styleDressing.addButtonCircle}>
                                <Feather
                                    name="plus"
                                    color={baseColors.white}
                                    size={23}
                                />
                            </View>
                            <Text style={styleDressing.addButtonText}>
                                Ajouter un vêtement
                            </Text>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => onSelect(cloth)}
                        style={styleDressing.imgBox}
                    >
                        <Image
                            source={cloth.cloth_url}
                            style={styleDressing.img}
                        />
                    </TouchableOpacity>
                );
            })}

            <ImportChoice
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onPicked={handleImagePicked}
            />
            <ModalAddClothInfo
                open={infoModalOpen}
                onCancel={() => setInfoModalOpen(false)}
                onSave={handleSaveNewCloth}
            />
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
        marginBottom: spacing.small,
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    addButton: {
        width: 90,
        height: 70,
        backgroundColor: baseColors.white,
        marginBottom: spacing.medium,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonCircle: {
        width: 30,
        height: 30,
        backgroundColor: baseColors.primary,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 11,
        textAlign: 'center',
        margin: 0,
        marginTop: 5,
    },
});
