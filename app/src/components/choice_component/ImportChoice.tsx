import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { baseColors } from '../../styles/theme';
import { handleCamera, handleGallery } from '../core/Camera';
import { useDispatch } from 'react-redux';
import { Dialog } from '@rneui/themed';

export function ImportChoice({ open, onClose, onPicked }) {
    const dispatch = useDispatch();

    const openCamera = async () => {
        handleCamera(onPicked);
        onClose();
    };

    const openGallery = async () => {
        handleGallery(onPicked);
        onClose();
    };

    return (
        <Dialog
            isVisible={open}
            onBackdropPress={onClose}
            overlayStyle={styles.modalContentContainer}
        >
            <LinearGradient
                colors={['#bfa2db', '#fff']}
                style={styles.gradient}
            >
                <TouchableOpacity onPress={openCamera} style={styles.option}>
                    <FontAwesome name="camera" size={40} style={styles.icon} />
                    <Text>Caméra</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openGallery} style={styles.option}>
                    <FontAwesome
                        name="picture-o"
                        size={40}
                        style={styles.icon}
                    />
                    <Text>Galerie</Text>
                </TouchableOpacity>
            </LinearGradient>
        </Dialog>
    );
}

const styles = StyleSheet.create({
    modalContentContainer: {
        padding: 0,
        borderRadius: 15,
        overflow: 'hidden',
    },
    gradient: {
        width: '100%',
        height: 150,
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    option: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 5,
    },
});
