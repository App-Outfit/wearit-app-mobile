import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { baseColors } from '../../../styles/theme';
import { useUploadClothing } from '../../clothing/hooks/useUploadClothing';

export function ExplorerCard({ item, columnWidth, isActive, onOpen, onClose }) {
    const { saveClothing, loading } = useUploadClothing();

    const handleUpload = async (type: 'upper' | 'lower' | 'dress') => {
        await saveClothing({
            uri: item.image_url,
            category: type,
            cloth_type: type,
            name: item.id,
        });
        onClose();
    };

    return (
        <View style={[styles.card, { width: columnWidth }]}>
            <FastImage
                source={{ uri: item.image_url }}
                style={[styles.image, { width: columnWidth }]}
                resizeMode="cover"
            />

            {/* On ouvre/clôt l’overlay via les props */}
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={isActive ? onClose : onOpen}
            />

            {/* SEULE cette carte affiche l’overlay */}
            {isActive && (
                <View style={[styles.overlay, { width: columnWidth }]}>
                    <Text style={styles.overlayTitle}>Ajouter comme :</Text>
                    {(['upper', 'lower', 'dress'] as const).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={styles.optionButton}
                            disabled={loading}
                            onPress={() => handleUpload(type)}
                        >
                            <Text style={styles.optionText}>
                                {type === 'upper'
                                    ? 'Haut'
                                    : type === 'lower'
                                      ? 'Bas'
                                      : 'Tenue complète'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.cancelButton}
                    >
                        <Text style={styles.cancelText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 8,
        position: 'relative',
    },
    image: {
        height: 200,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 12,
        justifyContent: 'center',
        zIndex: 2,
    },
    overlayTitle: {
        color: baseColors.white,
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 12,
        textAlign: 'center',
    },
    optionButton: {
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    optionText: {
        color: baseColors.white,
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        width: '100%',
        paddingVertical: 8,
    },
    cancelText: {
        color: baseColors.error,
        fontSize: 16,
        textAlign: 'center',
    },
});
