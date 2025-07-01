import * as React from 'react';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { InputField } from '../../components/core/PlaceHolders';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { baseColors } from '../../styles/theme';
import { handleCamera, handleGallery } from '../core/Camera';
import { useDispatch } from 'react-redux';

export function ImportChoice({ open, onClose, onPicked }) {
    const dispatch = useDispatch();
    const [newImageUri, setNewImageUri] = React.useState<string | null>(null);

    const openCamera = async () => {
        handleCamera(onPicked);
        onClose();
    };

    const openGallery = async () => {
        handleGallery(onPicked);
        onClose();
    };

    return (
        <Portal>
            <Modal
                visible={open}
                onDismiss={onClose}
                contentContainerStyle={styles.modalContentContainer}
                theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
            >
                <LinearGradient
                    colors={['#bfa2db', '#fff']}
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: 20,
                        borderRadius: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={openCamera}
                        style={{
                            marginRight: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <FontAwesome
                            name="camera"
                            size={40}
                            style={{ marginBottom: 5 }}
                        />
                        <Text>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={openGallery}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <FontAwesome
                            name="picture-o"
                            size={40}
                            style={{ marginBottom: 5 }}
                        />
                        <Text>Galerie</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    dressingScreen: {
        paddingHorizontal: 10,
    },
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleTextBox: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    subtitle: {
        fontSize: 14,
        color: '#7A7A7A',
    },

    toolBox: {
        marginVertical: 10,
    },
    filterBox: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    emptyBox: {
        height: '80%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyBoxText: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 600,
        color: baseColors.primary,
    },
    modalContentContainer: {
        width: '70%',
        height: 150,
        alignSelf: 'center',
        borderRadius: 15,
    },
    saveButton: {
        backgroundColor: baseColors.primary,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});
