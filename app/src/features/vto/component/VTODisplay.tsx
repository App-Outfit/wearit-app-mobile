import * as React from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { TryonData, ClothData } from '../slice/sampleTryons';
import {
    loadAssetBase64,
    inpaintRegion,
    inpaintUpper,
    inpaintLower,
    inpaintDress,
    inpaintUpperLower,
} from '../service/InpaintingService';
import { loadTryonsSuccess } from '../slice/TryonSlice';
import { sampleTryons, sampleCloths } from '../slice/sampleTryons';
import {
    fetchBodies,
    fetchBodyMasks,
    fetchCurrentBody,
} from '../../body/bodyThunks';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { AddButtonText } from '../../../components/core/Buttons';
import { baseColors, spacing } from '../../../styles/theme';
import { TryonItem } from '../tryonTypes';
import { selectResultTryon, selectSelectedTryon } from '../tryonSelectors';
import { ClothingItem } from '../../clothing/clothingTypes';
import {
    selectAllClothes,
    selectClothTypeByTryonID,
} from '../../clothing/clothingSelectors';
import FastImage from '@d11/react-native-fast-image';
import { selectCurrentBody } from '../../body/bodySelectors';
import { UpperLowerTryon, setCurrentResult } from '../tryonSlice';
import { inpaintTryon } from '../tryonThunks';
import { current } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const ImageDisplay = React.memo(
    ({ uri }: { uri: string }) => (
        <FastImage
            style={styles.image}
            source={{
                uri: uri,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
        />
    ),
    (prev, next) => prev.uri === next.uri,
);

export function isUpperLowerTryon(x: any): x is UpperLowerTryon {
    return x && typeof x === 'object' && 'upper' in x && 'lower' in x;
}

export default function VTODisplay({ onNavigate, drawerCloth, onRandomize, randomImage }) {
    const dispatch = useAppDispatch();
    const [resultBase64, setResultBase64] = React.useState<string>('');
    const [upperMaskBase64, setUpperMaskBase64] = React.useState<string>();
    const [lowerMaskBase64, setLowerMaskBase64] = React.useState<string>();
    const [dressMaskBase64, setDressMaskBase64] = React.useState<string>();
    const [tryon64, setTryon64] = React.useState<string>('');
    const current_body = useAppSelector(selectCurrentBody);
    const [isSwiping, setIsSwiping] = React.useState(false);
    const translateY = useSharedValue(0);
    const isSliding = React.useRef(false);
    const prevDrawerCloth = React.useRef(drawerCloth);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleRandomize = React.useCallback(async () => {
        // Slide la photo hors de l'écran vers le haut
        translateY.value = withTiming(-800, { duration: 250 }, (finished) => {
            if (finished) {
                runOnJS(triggerRandomize)();
            }
        });
    }, []);

    // Fonction JS pour randomize et slide-in (depuis le bas)
    const triggerRandomize = async () => {
        if (onRandomize) {
            await onRandomize();
        }
        // Slide-in la nouvelle photo depuis le bas
        translateY.value = 800;
        translateY.value = withSpring(0, { damping: 15 });
    };

    const onGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { startY: number }
    >({
        onStart: (_, ctx) => {
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            if (!drawerCloth) {
                translateY.value = ctx.startY + event.translationY;
            }
        },
        onEnd: (event) => {
            if (!drawerCloth) {
                if (event.translationY < -120) {
                    // Swipe vers le haut : slide out et randomize
                    translateY.value = withTiming(-800, { duration: 250 }, (finished) => {
                        if (finished) {
                            runOnJS(triggerRandomize)();
                        }
                    });
                } else {
                    // Retour à la position initiale
                    translateY.value = withSpring(0, { damping: 15 });
                }
            }
        },
    });

    React.useEffect(() => {
        // dispatch(loadTryonsSuccess(sampleTryons));
    }, [dispatch]);

    React.useEffect(() => {
        const initCurrentResult = async () => {
            if (current_body) {
                // Charger l'image principale du body immédiatement
                const uri = await loadAssetBase64(current_body.image_url);
                dispatch(setCurrentResult(uri));
                setResultBase64(uri);

                // Charger les masks en arrière-plan
                Promise.all([
                    loadAssetBase64(current_body.mask_upper),
                    loadAssetBase64(current_body.mask_lower),
                    loadAssetBase64(current_body.mask_dress),
                ]).then(([upperMask, lowerMask, dressMask]) => {
                    setUpperMaskBase64(upperMask);
                    setLowerMaskBase64(lowerMask);
                    setDressMaskBase64(dressMask);
                });
            }
        };
        initCurrentResult();
    }, [current_body, dispatch]);

    // const userCloth = useAppSelector(selectAllClothes);
    const selected = useAppSelector(selectSelectedTryon);
    const userCloth = useAppSelector(selectAllClothes);
    // const selectedTryon:  UpperLowerTryon | TryonItem | null =
    // selected.upperLower || selected.dress || selected.upper || selected.lower || null;

    const { selectedTryon, currentType } = React.useMemo<{
        selectedTryon: UpperLowerTryon | TryonItem | null;
        currentType: 'upper&lower' | 'upper' | 'lower' | 'dress' | null;
    }>(() => {
        if (selected.upper && selected.lower) {
            return {
                selectedTryon: { upper: selected.upper, lower: selected.lower },
                currentType: 'upper&lower',
            };
        }
        if (selected.dress) {
            return { selectedTryon: selected.dress, currentType: 'dress' };
        }
        if (selected.upper) {
            return { selectedTryon: selected.upper, currentType: 'upper' };
        }
        if (selected.lower) {
            return { selectedTryon: selected.lower, currentType: 'lower' };
        }
        return { selectedTryon: null, currentType: null };
    }, [selected.upper, selected.lower, selected.dress]);

    // const currentType = React.useMemo<string | null | undefined>(() => {
    //     if (!selectedTryon) return null;
    //     if (selectedTryon instanceof UpperLowerTryon) return 'upperLower';

    //     const cloths = userCloth.find(
    //         (c: ClothingItem) => c.id === selectedTryon.clothing_id,
    //     );
    //     return cloths?.cloth_type;
    // }, [selectedTryon]);

    React.useEffect(() => {
        if (isUpperLowerTryon(selectedTryon)) {
            const computeResult = async () => {
                if (!selectedTryon.upper || !selectedTryon.lower) {
                    return;
                }
                const upper64 = await loadAssetBase64(
                    selectedTryon.upper.output_url,
                );
                const lower64 = await loadAssetBase64(
                    selectedTryon.lower.output_url,
                );
                try {
                    const result = await inpaintUpperLower(
                        resultBase64,
                        upper64,
                        upperMaskBase64 || '',
                        lower64,
                        lowerMaskBase64 || '',
                    );
                    setResultBase64(result);
                    dispatch(setCurrentResult(result));
                } catch (err) {}
            };
            computeResult();
        } else {
            if (
                !selectedTryon?.id ||
                !selectedTryon.output_url ||
                !currentType
            ) {
                return;
            }

            const computeResult = async () => {
                const tryon64 = await loadAssetBase64(selectedTryon.output_url);
                try {
                    let result: string;
                    switch (currentType) {
                        case 'upper':
                            result = await inpaintUpper(
                                resultBase64,
                                tryon64,
                                upperMaskBase64 || '',
                            );
                            break;
                        case 'lower':
                            result = await inpaintLower(
                                resultBase64,
                                tryon64,
                                lowerMaskBase64 || '',
                            );
                            break;
                        case 'dress':
                            result = await inpaintDress(
                                resultBase64,
                                tryon64,
                                dressMaskBase64 || '',
                            );
                            break;
                        default:
                            throw new Error(
                                `Unknown inpaint type: ${currentType}`,
                            );
                    }

                    setResultBase64(result);
                    dispatch(setCurrentResult(result));
                } catch (err) {}
            };

            computeResult();
        }
    }, [selectedTryon, currentType, dispatch]);

    React.useEffect(() => {
        if (resultBase64) {
            setTryon64(resultBase64);
        }
    }, [resultBase64]);

    React.useEffect(() => {
        if (prevDrawerCloth.current && !drawerCloth) {
            // Rail vient d'être caché : mini rebond
            translateY.value = withTiming(-30, { duration: 120 }, () => {
                translateY.value = withSpring(0, { damping: 8 });
            });
        }
        prevDrawerCloth.current = drawerCloth;
    }, [drawerCloth]);

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent} enabled={!drawerCloth}>
            <Animated.View style={[styles.boxImg, animatedStyle]}>
                {current_body !== null ? (
                    <ImageDisplay uri={`data:image/png;base64,${randomImage || resultBase64}`} />
                ) : (
                    <View style={styles.boxOri}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: `data:image/png;base64,${randomImage || resultBase64}`,
                            }}
                            resizeMode="contain"
                        />
                        <View style={styles.addButtonBox}>
                            <AddButtonText
                                onPress={onNavigate}
                                text={'Ajouter votre mannequin'}
                            />
                        </View>
                    </View>
                )}
            </Animated.View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    boxImg: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: spacing.small,
    },
    boxOri: {
        position: 'relative',
        flex: 1,
        width: '100%',
    },
    addButtonBox: {
        position: 'absolute',
        backgroundColor: baseColors.white,
        bottom: 0,
        right: 0,
        height: 80,
        borderTopLeftRadius: spacing.small,
        paddingVertical: spacing.xSmall,
    },
});
