import * as React from 'react';

import {
    StyleSheet,
    Text,
    Touchable,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAppSelector } from '../../../utils/hooks';
import FastImage from '@d11/react-native-fast-image';
import { baseColors } from '../../../styles/theme';
import { Modal } from 'react-native-paper';

export function ExplorerCard({ item, columnWidth }) {
    const [modal, setModal] = React.useState(false);
    return (
        <View
            style={[
                styles.card,
                {
                    width: columnWidth,
                    height: columnWidth * 2,
                },
            ]}
        >
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setModal(true)}
            >
                <FastImage
                    source={{
                        uri: item.image_url,
                        priority: FastImage.priority.normal,
                    }}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </TouchableOpacity>
            <View style={styles.descrBox}>
                <Text numberOfLines={1} style={styles.descr}>
                    {item.description}
                </Text>
            </View>

            <Modal
                visible={modal}
                onDismiss={() => setModal(false)}
                theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
                style={{ height: 200, width: '100%' }}
            >
                <Text style={{ color: baseColors.white, padding: 10 }}>
                    {item.description}
                </Text>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: 200,
    },
    descrBox: {
        padding: 8,
        height: 40,
        // overflow: 'hidden',
        position: 'absolute',
        bottom: 200,
    },
    descr: {
        color: baseColors.lightGray_3,
        textShadowColor: baseColors.black,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
        fontSize: 14,
    },
});
