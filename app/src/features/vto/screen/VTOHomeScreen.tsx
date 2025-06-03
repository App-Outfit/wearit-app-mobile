import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import VTODisplay from '../component/VTODisplay';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { spacing } from '../../../styles/theme';
import Toast from 'react-native-toast-message';
import { ToastAlert } from '../../../components/core/Toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { ShareDrawer } from '../component/ShareDrawer';
import { MiniDressing } from '../component/ListClothes';

export function VTODressingScreen({ navigation }) {
    const [currentIsSave, setCurrentSave] = React.useState<boolean>(false);
    const bottomSheetShare = React.useRef<BottomSheet>(null);

    const succesSaveOutfitToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Outfit enregistré !',
            position: 'bottom',
        });
    };

    const saveOutfit = () => {
        setCurrentSave(true);
        succesSaveOutfitToast();
    };

    const cancelSaveOutfit = () => setCurrentSave(false);

    const onPressSave = () => {
        if (!currentIsSave) saveOutfit();
        else cancelSaveOutfit();
    };

    const handleSnapPress = React.useCallback(() => {
        bottomSheetShare.current?.snapToIndex(0);
    }, []);

    const toCreateBody = () => {
        console.log(navigation);
        navigation.push('AvatarCreation');
    };

    return (
        <GestureHandlerRootView>
            <View style={{ flex: 1, position: 'relative', margin: 14 }}>
                <View style={styles.container}>
                    <View style={styles.vtoDisplayContainer}>
                        <VTODisplay onNavigate={toCreateBody} />
                    </View>
                    <View style={styles.scrollComponent}>
                        <MiniDressing />
                    </View>
                </View>

                <View style={styles.iconComponent}>
                    {/* <TouchableOpacity style={styles.icon}>
                    <Feather name="filter" size={20} />
                    <Text style={styles.textIcon}>Filtrer</Text>
                </TouchableOpacity> */}
                    <TouchableOpacity style={styles.icon} onPress={onPressSave}>
                        {currentIsSave ? (
                            <FontAwesome name="bookmark" size={20} />
                        ) : (
                            <FontAwesome name="bookmark-o" size={20} />
                        )}
                        <Text style={styles.textIcon}>Enregistrer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={handleSnapPress}
                    >
                        <Feather name="share-2" size={20} />
                        <Text style={styles.textIcon}>Partager</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.iconComponent, styles.iconTopComponent]}>
                    <TouchableOpacity
                        style={[styles.icon, { marginBottom: 5 }]}
                    >
                        <Feather name="rotate-ccw" size={15} />
                        <Text style={styles.textIcon}>Réessayer</Text>
                    </TouchableOpacity>
                </View>

                <ShareDrawer ref={bottomSheetShare} onChange={() => {}} />
                <ToastAlert />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
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
