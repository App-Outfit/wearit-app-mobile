import * as React from 'react';

import {
    Dimensions,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Header } from '../../../../components/core/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { CButton } from '../../../../components/core/Buttons';
import {
    baseColors,
    normalize,
    spacing,
    typography,
} from '../../../../styles/theme';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
    ICarouselInstance,
    Pagination,
} from 'react-native-reanimated-carousel';
import { ImportChoice } from '../../../../components/choice_component/ImportChoice';
import Feather from 'react-native-vector-icons/Feather';
import { uploadBody } from '../../../body/bodyThunks';
import { useAppDispatch } from '../../../../utils/hooks';
import { createFormData } from '../../../../utils/form';

const width = Dimensions.get('window').width;
const data = [
    'Prenez une photos de vous, dans une position simple, de face.',
    'Vous devez apparaitre seul.',
    'Le corps doit être visible de la tête au pied.',
    'Les mains doivent être apprente.',
];

export function AvatarCreationScreen({ navigation }: any) {
    const ref = React.useRef<ICarouselInstance>(null);
    const dispatch = useAppDispatch();
    const progress = useSharedValue<number>(0);
    const [modalChoice, setModalChoice] = React.useState<boolean>(false);
    const [index, setIndex] = React.useState<number>(0);
    const [newPictureUri, setNewPictureUri] = React.useState<string | null>(
        null,
    );

    const param_gender = 'men';

    const femaleOnboarding = require('../../../../assets/images/auth/female-onboarding.png');
    const maleOnboarding = require('../../../../assets/images/auth/male-onboarding.png');

    const onPressPagination = (idx: number) => {
        ref.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            // count: idx - progress.value,
            index: idx,
            // count: idx - progress.value,
            animated: false,
        });
        setIndex(idx);
    };

    const handleImagePicked = async (uri) => {
        setModalChoice(false);
        if (uri) {
            setNewPictureUri(uri);
        }

        // Send newPictureURI to backend
        try {
            const formData = createFormData(uri);
            const action = await dispatch(uploadBody(formData));

            if (uploadBody.fulfilled.match(action)) {
                navigation.push('AvatarWaiting');
            }
        } catch (error) {
            console.log('ERROR UPLOAD BODY : ', error);
        }

        // Navigate to Screen Waiting Create Avatar
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.goBackBox}
                onPress={() => navigation.goBack()}
            >
                <Feather name="arrow-left" size={35} color={baseColors.black} />
            </TouchableOpacity>

            {/* Section texte */}
            <View style={styles.textContainer}>
                <Header variant="h3" style={styles.title}>
                    Soyez votre propre mannequin !
                </Header>
            </View>

            {/* Section images */}
            {param_gender === 'men' ? (
                <Image
                    source={maleOnboarding}
                    style={[styles.image, styles.image2]}
                    resizeMode="contain"
                />
            ) : (
                <Image
                    source={femaleOnboarding}
                    style={styles.image}
                    resizeMode="contain"
                />
            )}

            {/* Boutons CTA */}
            <View style={styles.bottomContainer}>
                <LinearGradient
                    colors={['#FFFFFF', 'rgba(255, 255, 255, 0)']}
                    style={styles.gradient}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    locations={[0.43, 0.99]}
                >
                    <Carousel
                        ref={ref}
                        width={width}
                        height={120}
                        data={data}
                        onProgressChange={progress}
                        onScrollEnd={(idx) => onPressPagination(idx)}
                        renderItem={({ index }) => (
                            <View style={styles.carouselView}>
                                <View style={styles.carouselIndex}>
                                    <Text style={styles.carouselIndexText}>
                                        {index + 1}
                                    </Text>
                                </View>
                                <View style={styles.carouselTextBox}>
                                    <Text style={styles.carouselText}>
                                        {data[index]}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />

                    <View style={styles.buttonBottomContainer}>
                        {index + 1 !== data.length ? (
                            <CButton
                                variant="primary"
                                size="medium"
                                onPress={() =>
                                    onPressPagination(progress.value + 1)
                                }
                                style={styles.button}
                            >
                                Suivant
                            </CButton>
                        ) : (
                            <CButton
                                variant="primary"
                                size="xlarge"
                                onPress={() => setModalChoice(true)}
                                style={styles.button}
                            >
                                Créer votre mannequin
                            </CButton>
                        )}
                        <CButton
                            variant="secondary"
                            size="xlarge"
                            onPress={() =>
                                onPressPagination(progress.value + 1)
                            }
                            style={styles.button}
                        >
                            Passez
                        </CButton>
                    </View>
                </LinearGradient>

                <ImportChoice
                    open={modalChoice}
                    onClose={() => setModalChoice(false)}
                    onPicked={(uri) => handleImagePicked(uri)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: baseColors.secondary,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: normalize(20),
        paddingHorizontal: normalize(0),
        position: 'relative',
    },
    goBackBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    title: {
        fontSize: 30,
        paddingTop: 50,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'left',
        lineHeight: 38,
        letterSpacing: -2,
        color: baseColors.black,
    },
    image: {
        width: '100%',
        height: 700,
        marginVertical: 20,
        position: 'absolute',
        top: -30,
        left: 100,
    },
    image2: {
        left: 70,
        top: -80,
        height: 730,
        backgroundColor: 'transparent',
    },
    bottomContainer: {
        width: '100%',
        height: 320,
        backgroundColor: 'transparent',
    },
    gradient: {
        width: '100%',
        height: 320,
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    buttonBottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: normalize(300),
    },
    carouselView: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
        paddingBottom: 10,
    },
    carouselIndex: {
        borderRadius: '50%',
        backgroundColor: baseColors.primary,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselIndexText: {
        color: baseColors.white,
        textAlign: 'center',
        fontSize: 16,
    },
    carouselTextBox: {
        flex: 1,
        padding: spacing.medium,
        // borderWidth: 1
    },
    carouselText: {
        color: baseColors.black,
        fontSize: 16,
        fontFamily: typography.poppins.semiBold,
        textAlign: 'center',
    },
});
