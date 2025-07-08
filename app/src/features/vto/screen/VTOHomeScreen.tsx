import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import VTODisplay from '../component/VTODisplay';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { baseColors, spacing } from '../../../styles/theme';
import Toast from 'react-native-toast-message';
import { ToastAlert } from '../../../components/core/Toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { ShareDrawer } from '../component/ShareDrawer';
import { MiniDressing } from '../component/ListClothes';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import {
    selectReadyTryonsLower,
    selectReadyTryonsUpper,
    selectReadyTryonsWithType,
    selectTryonStatus,
} from '../tryonSelectors';
import { setDress, setUpper, setUpperLower } from '../tryonSlice';
import MenuDrawer from 'react-native-side-drawer';
import { DrawerToggleButton } from '../../../components/core/DrawerToggleButton';
import { selectUserCredits } from '../../profil/selectors/userSelectors';
import { fetchCredits } from '../../profil/thunks/userThunks';
import { selectResultTryon } from '../tryonSelectors';
import uuid from 'react-native-uuid';
import { saveImageToGalleryAsync } from '../../../utils/download';
import { useState, useEffect, useCallback } from 'react';

export function VTODressingScreen({ navigation }) {
    const [currentIsSave, setCurrentSave] = React.useState<boolean>(false);
    const bottomSheetShare = React.useRef<BottomSheet>(null);
    const tryonsReady = useAppSelector(selectReadyTryonsWithType);
    const upperTryons = useAppSelector(selectReadyTryonsUpper);
    const lowerTryons = useAppSelector(selectReadyTryonsLower);
    const [drawerCloth, setDrawerCloth] = React.useState<boolean>(true);
    const credits = useAppSelector(selectUserCredits);
    const currentResult = useAppSelector(selectResultTryon);
    const dispatch = useAppDispatch();
    const tryonStatus = useAppSelector(selectTryonStatus);

    // Mémoriser les sélecteurs pour éviter les recalculs
    const memoizedTryonsReady = React.useMemo(() => tryonsReady, [tryonsReady]);
    const memoizedUpperTryons = React.useMemo(() => upperTryons, [upperTryons]);
    const memoizedLowerTryons = React.useMemo(() => lowerTryons, [lowerTryons]);

    // --- Ajout du système de queue pour images random ---
    const [randomQueue, setRandomQueue] = useState<string[]>([]);
    const [isLoadingRandom, setIsLoadingRandom] = useState(false);
    const [currentRandomImage, setCurrentRandomImage] = useState<string | null>(null);

    useEffect(() => {
      if (
        typeof tryonStatus === 'string' &&
        tryonStatus === 'succeeded' &&
        randomQueue.length === 0 &&
        memoizedTryonsReady.length > 0
      ) {
        let isMounted = true;
        const initQueue = () => {
          setIsLoadingRandom(true);
          const img1 = generateRandomOutfit();
          const img2 = generateRandomOutfit();
          if (isMounted) {
            setRandomQueue([img1, img2]);
            setCurrentRandomImage(img1);
            setIsLoadingRandom(false);
          }
        };
        initQueue();
        return () => { isMounted = false; };
      }
    }, [tryonStatus, randomQueue.length, memoizedTryonsReady.length]);

    const handleRandomize = useCallback(() => {
      if (randomQueue.length === 0) {
        setIsLoadingRandom(true);
        const img = generateRandomOutfit();
        setRandomQueue([img]);
        setCurrentRandomImage(img);
        setIsLoadingRandom(false);
        return;
      }
      const [nextImage, ...rest] = randomQueue;
      setCurrentRandomImage(nextImage);
      setRandomQueue(rest);
      const img = generateRandomOutfit();
      setRandomQueue((q) => [...q, img]);
    }, [randomQueue]);

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

    const handleDownloadImage = async () => {
        if (!currentResult) {
            Toast.show({
                type: 'error',
                text1: 'Aucune image à télécharger',
                position: 'bottom',
            });
            return;
        }
        
        const fileName = `wearit-${uuid.v4()}.jpg`;
        try {
            await saveImageToGalleryAsync(currentResult, fileName);
            Toast.show({
                type: 'success',
                text1: 'Image téléchargée !',
                position: 'bottom',
            });
        } catch (e) {
            console.error('Échec téléchargement :', e);
            Toast.show({
                type: 'error',
                text1: 'Erreur lors du téléchargement',
                position: 'bottom',
            });
        }
    };

    const toCreateBody = () => {
        navigation.push('AvatarCreation');
    };

    const onNavigate = () => {
        toCreateBody();
    };

    const generateRandomOutfit = () => {
      if (memoizedTryonsReady.length === 0) {
        if (typeof tryonStatus === 'string' && tryonStatus !== 'loading') {
          Toast.show({
            type: 'error',
            text1: 'Aucun vêtement disponible',
            position: 'bottom',
          });
        }
        return '';
      }
      const randomIndex = Math.floor(Math.random() * memoizedTryonsReady.length);
      const randomOutfit = memoizedTryonsReady[randomIndex];
      switch (randomOutfit.cloth_type) {
        case 'dress':
          dispatch(setDress(randomOutfit));
          break;
        case 'upper': {
          const lowerOutfit =
            memoizedLowerTryons[Math.floor(Math.random() * memoizedLowerTryons.length)];
          if (lowerOutfit) {
            dispatch(
              setUpperLower({
                upper: randomOutfit,
                lower: lowerOutfit,
              })
            );
          } else {
            dispatch(setUpper(randomOutfit));
          }
          break;
        }
        case 'lower': {
          const upperOutfit =
            memoizedUpperTryons[Math.floor(Math.random() * memoizedUpperTryons.length)];
          if (upperOutfit) {
            dispatch(
              setUpperLower({
                upper: upperOutfit,
                lower: randomOutfit,
              })
            );
          } else {
            dispatch(setUpper(randomOutfit));
          }
          break;
        }
        default:
          Toast.show({
            type: 'error',
            text1: 'Type de vêtement inconnu',
            position: 'bottom',
          });
      }
      return '';
    };

    React.useEffect(() => {
        // Ne charger les crédits qu'une seule fois si ils ne sont pas déjà chargés
        if (!credits) {
            dispatch(fetchCredits());
        }
    }, [dispatch]); // Suppression de credits des dépendances

    return (
        <GestureHandlerRootView>
            <View
                style={{
                    flex: 1,
                    position: 'relative',
                    marginHorizontal: spacing.small,
                }}
            >
                <View style={styles.container}>
                    <View
                        style={[
                            styles.vtoDisplayContainer,
                            {
                                flex: drawerCloth ? 1 : 2.8,
                            },
                        ]}
                    >
                        <VTODisplay
                            drawerCloth={drawerCloth}
                            onNavigate={onNavigate}
                            onRandomize={handleRandomize}
                            randomImage={currentRandomImage}
                        />
                        {isLoadingRandom && <ActivityIndicator style={{ position: 'absolute', top: '50%', left: '50%' }} />}
                    </View>
                    <View
                        style={[
                            styles.scrollComponent,
                            {
                                minWidth: drawerCloth ? 110 : 0,
                                width: drawerCloth ? 'auto' : 0,
                            },
                        ]}
                    >
                        <MiniDressing
                            setDrawerCloth={setDrawerCloth}
                            drawerCloth={drawerCloth}
                        />
                    </View>
                </View>

                <View style={styles.iconComponent}>
                    {/* <TouchableOpacity style={styles.icon} onPress={onPressSave}>
                        {currentIsSave ? (
                            <FontAwesome name="bookmark" size={20} />
                        ) : (
                            <FontAwesome name="bookmark-o" size={20} />
                        )}
                        <Text style={styles.textIcon}>Enregistrer</Text>
                    </TouchableOpacity> */}
                    {/* Bouton shuffle supprimé, remplacé par le swipe */}
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={handleDownloadImage}
                    >
                        <Feather name="download" size={20} />
                    </TouchableOpacity>
                </View>

                <ShareDrawer ref={bottomSheetShare} onChange={() => {}} />
                <ToastAlert />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    vtoDisplayContainer: {
        // flex: 2.8,
        marginRight: 10,
        height: '98%',
    },
    scrollComponent: {
        // flex: 1,
        // minWidth: 110,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
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
        textAlign: 'center',
    },
});
