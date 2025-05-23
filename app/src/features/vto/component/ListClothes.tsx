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
import { setUpper, setLower, setDress } from '../slice/TryonSlice';
import type { ClothData } from '../slice/sampleTryons';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';
import { ImportChoice } from '../../../components/choice_component/ImportChoice';
import { ModalAddClothInfo } from '../component/ModalAddClothInfo';
import { baseColors, spacing, typography } from '../../../styles/theme';

import Feather from 'react-native-vector-icons/Feather';

export function MiniDressing() {
    const dispatch = useDispatch();
    const [newPictureUri, setNewPictureUri] = React.useState<string | null>(
        null,
    );
    const [importModalOpen, setImportModalOpen] = React.useState(false);
    const [infoModalOpen, setInfoModalOpen] = React.useState(false);
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
            style={styleDressing.scrollView}
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
    scrollView: {
        flex: 1,
        width: '100%',
    },
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
