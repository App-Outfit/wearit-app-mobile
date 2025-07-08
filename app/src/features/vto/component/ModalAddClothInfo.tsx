import * as React from 'react';
import {
    Button,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Keyboard,
    Image,
    ScrollView,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { spacing, typography } from '../../../styles/theme';
import MultiChoice, {
    Option,
} from '../../../components/choice_component/MultipleChoice';
import UniqueChoice from '../../../components/choice_component/UniqueChoice';
import { InputField } from '../../../components/core/PlaceHolders';
import { CButton } from '../../../components/core/Buttons';
import { clothingIcons } from '../../../assets/icons/clothingIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

export function ModalAddClothInfo({ open, onCancel, onSave, imageUri }) {
    const [clothType, setClothType] = React.useState<'upper' | 'lower' | 'dress' | undefined>();
    const [category, setCategory] = React.useState<string>();

    React.useEffect(() => {
        // Sélectionner upper par défaut à l'ouverture
        if (open && !clothType) setClothType('upper');
    }, [open]);

    // Catégories par type (avec clothingIcons)
    const categoriesByType: Record<'upper' | 'lower' | 'dress', { key: string, label: string, icon: any }[]> = {
        upper: [
            { key: 'tshirt', label: 'T-shirt', icon: clothingIcons.upper },
            { key: 'shirt', label: 'Chemise', icon: clothingIcons.upper },
            { key: 'sweater', label: 'Pull', icon: clothingIcons.upper },
            { key: 'jacket', label: 'Veste', icon: clothingIcons.upper },
            { key: 'coat', label: 'Manteau', icon: clothingIcons.upper },
            { key: 'hoodie', label: 'Hoodie', icon: clothingIcons.upper },
        ],
        lower: [
            { key: 'pants', label: 'Pantalon', icon: clothingIcons.lower },
            { key: 'shorts', label: 'Short', icon: clothingIcons.lower },
            { key: 'skirt', label: 'Jupe', icon: clothingIcons.lower },
        ],
        dress: [
            { key: 'dress', label: 'Robe', icon: clothingIcons.dress },
            { key: 'costume', label: 'Costume', icon: clothingIcons.dress },
        ],
    };

    const saveNewCloth = () => {
        if (!clothType || !category) return;
        onSave({
            cloth_type: clothType,
            category,
        });
        setClothType(undefined);
        setCategory(undefined);
    };

    return (
        <Portal>
            <Modal
                visible={open}
                onDismiss={onCancel}
                contentContainerStyle={styles.modalContentContainer}
                theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Croix de fermeture */}
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
                            onPress={onCancel}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Feather name="x" size={28} color="#888" />
                        </TouchableOpacity>
                        {/* Image de l'habit en haut si disponible */}
                        {imageUri && (
                            <View style={{ alignItems: 'center', marginBottom: 8 }}>
                                <Image source={{ uri: imageUri }} style={{ width: 220, height: 220, borderRadius: 28, resizeMode: 'cover' }} />
                            </View>
                        )}
                        {/* Sélection du type (upper/lower/dress) avec bulle et icône clothingIcons */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 0 }}>
                            {([
                                { type: 'upper', icon: clothingIcons.upper, label: 'Haut' },
                                { type: 'lower', icon: clothingIcons.lower, label: 'Bas' },
                                { type: 'dress', icon: clothingIcons.dress, label: 'Corps' },
                            ] as const).map(({ type, icon, label }) => (
                                <TouchableOpacity
                                    key={type}
                                    style={{
                                        marginHorizontal: 12,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        setClothType(type);
                                        setCategory(undefined);
                                    }}
                                >
                                    <View style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 28,
                                        backgroundColor: clothType === type ? '#f3e9ff' : '#fff',
                                        borderWidth: clothType === type ? 3 : 1,
                                        borderColor: clothType === type ? '#A259FF' : '#ccc',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Image source={icon} style={{ width: 36, height: 36, resizeMode: 'contain' }} />
                                    </View>
                                    <Text style={{ fontSize: 12, marginTop: 2, color: clothType === type ? '#A259FF' : '#222' }}>{label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* Sélection de la catégorie selon le type sélectionné, fond grisé uniforme */}
                        {clothType && (
                            <View style={{
                                backgroundColor: '#F3F4F8',
                                borderRadius: 18,
                                paddingVertical: 12,
                                marginBottom: 8,
                                marginTop: 4,
                                minHeight: 90,
                            }}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {categoriesByType[clothType].map((cat) => (
                                            <TouchableOpacity
                                                key={cat.key}
                                                style={{ marginHorizontal: 8, alignItems: 'center' }}
                                                onPress={() => setCategory(cat.key)}
                                            >
                                                <View style={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 28,
                                                    backgroundColor: category === cat.key ? '#f3e9ff' : '#fff',
                                                    borderWidth: category === cat.key ? 3 : 1,
                                                    borderColor: category === cat.key ? '#A259FF' : '#ccc',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Image source={cat.icon} style={{ width: 36, height: 36, resizeMode: 'contain' }} />
                                                </View>
                                                <Text style={{ fontSize: 12, marginTop: 2, color: category === cat.key ? '#A259FF' : '#222' }}>{cat.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                        <CButton
                            variant="primary"
                            size="xlarge"
                            disabled={
                                clothType === undefined ||
                                category === undefined
                            }
                            onPress={saveNewCloth}
                        >
                            Enregistrer
                        </CButton>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContentContainer: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000088',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        height: 520,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: spacing.medium,

        justifyContent: 'space-between',
        alignContent: 'stretch',
    },
    typeText: {
        fontFamily: typography.poppins.regular,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 6,
        borderRadius: 4,
    },
    typeButton: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 4,
    },
    typeButtonActive: {
        backgroundColor: '#ddd',
    },
});
