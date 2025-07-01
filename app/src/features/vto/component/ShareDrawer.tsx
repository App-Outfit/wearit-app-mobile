import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing, typography } from '../../../styles/theme';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import uuid from 'react-native-uuid';
import { saveImageToGalleryAsync } from '../../../utils/download';
import { useAppSelector } from '../../../utils/hooks';
import { selectResultTryon } from '../tryonSelectors';
import * as MediaLibrary from 'expo-media-library';

export function ShareDrawer({ ref, onChange }) {
    const snapPoints = React.useMemo(() => ['25%'], []);

    const currentResult = useAppSelector(selectResultTryon);

    const handleSaveToGallery = async () => {
        if (!currentResult) return;
        const fileName = `wearit-${uuid.v4()}.jpg`;
        try {
            await saveImageToGalleryAsync(currentResult, fileName);
            console.log('Enregistré dans la galerie !');
        } catch (e) {
            console.error('Échec enregistrement en galerie :', e);
        }
    };

    return (
        <BottomSheet
            index={-1}
            ref={ref}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onChange={onChange}
            enablePanDownToClose
        >
            <BottomSheetView style={styleShare.contentContainer}>
                <View style={styleShare.titleContainer}>
                    <Text style={styleShare.title}>Partager</Text>
                </View>

                <View style={styleShare.shareItemContainer}>
                    <TouchableOpacity
                        style={styleShare.shareItem}
                        onPress={handleSaveToGallery}
                    >
                        <View style={styleShare.shareIconContainer}>
                            <Feather name="download" size={37} />
                        </View>
                        <Text style={styleShare.shareItemText}>
                            Télécharger
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styleShare.shareItem}
                        onPress={() => {}}
                    >
                        <View style={styleShare.shareIconContainer}>
                            <Feather name="mail" size={37} />
                        </View>
                        <Text style={styleShare.shareItemText}>Mail</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styleShare.shareItem}
                        onPress={() => {}}
                    >
                        <View style={styleShare.shareIconContainer}>
                            <FontAwesome name="whatsapp" size={37} />
                        </View>
                        <Text style={styleShare.shareItemText}>Whatsapp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styleShare.shareItem}
                        onPress={() => {}}
                    >
                        <View style={styleShare.shareIconContainer}>
                            <Feather name="instagram" size={37} />
                        </View>
                        <Text style={styleShare.shareItemText}>Instagram</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styleShare = StyleSheet.create({
    contentContainer: {
        flex: 1,
        zIndex: 2000,
    },
    titleContainer: {
        height: 30,
        marginBottom: spacing.large,
    },
    title: {
        fontFamily: typography.poppins.bold,
        fontSize: 18,
        textAlign: 'center',
    },
    shareItemContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignContent: 'center',
        flexDirection: 'row',
    },
    shareItem: {
        width: 80,
        height: 80,
        justifyContent: 'flex-start',
        alignContent: 'center',
    },
    shareItemText: {
        textAlign: 'center',
    },
    shareIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xSmall,
    },
});
