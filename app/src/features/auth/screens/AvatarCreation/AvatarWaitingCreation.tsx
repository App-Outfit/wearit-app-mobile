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
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../../utils/hooks';
import { useBodyWS } from '../../hooks/useBodyWS';
import { selectCurrentBody } from '../../../body/bodySelectors';
import Feather from 'react-native-vector-icons/Feather';

export function AvatarWaitingCreationScreen({ navigation, route }) {
    const dispatch = useAppDispatch();

    // Souscription aux événements WS
    useBodyWS();

    // Récupère l'état du body depuis le store
    const currentBody = useAppSelector(selectCurrentBody);

    // Quand le preprocessing est prêt, navigue vers l'écran de résultat
    React.useEffect(() => {
        // if (currentBody?.status === 'ready') {
        //     navigation.getParent()?.navigate('Welcome');
        // }
        // navigation.getParent("Home")?.navigate('Welcome');
    }, [currentBody?.status, currentBody?.id, navigation]);

    return (
        <View style={styles.container}>
            {currentBody?.status !== 'ready' ? (
                <>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator
                            animating={true}
                            color={baseColors.white}
                            size={60}
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Header variant="h3" style={styles.title}>
                            Création de votre mannequin...
                        </Header>
                        <Text style={styles.text}>
                            Cela prend quelques minutes. Vous recevrez une notification dès que c’est prêt !
                        </Text>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.loadingBox}>
                        <Feather
                            name="check-circle"
                            size={60}
                            color={baseColors.white}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Header variant="h3" style={styles.title}>
                            Votre Mannequin est prêt !
                        </Header>
                        <Text style={styles.text}>
                            Vous pouvez maintenant continuer à personnaliser
                            votre avatar et découvrir nos vêtements.
                        </Text>
                    </View>
                </>
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
                    <View style={styles.buttonBottomContainer}>
                        <CButton
                            disabled={currentBody?.status !== 'ready'}
                            size="xlarge"
                            style={{ width: 320 }}
                            onPress={() =>
                                navigation.getParent()?.navigate('Welcome') ||
                                navigation.getParent()?.navigate('MainTabs')
                            }
                        >
                            Continuer
                        </CButton>
                    </View>
                </LinearGradient>
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
        paddingTop: normalize(200),
        paddingHorizontal: normalize(0),
        position: 'relative',
    },
    loadingBox: {
        height: 80,
        justifyContent: 'flex-end',
    },
    textContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    title: {
        fontSize: 30,
        paddingTop: 20,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        lineHeight: 38,
        letterSpacing: -2,
        color: baseColors.black,
    },
    text: {
        fontSize: 16,
        fontFamily: typography.poppins.regular,
        textAlign: 'center',
        padding: spacing.small,
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
        paddingBottom: 140,
    },
    buttonBottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
