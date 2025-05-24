import * as React from 'react';
import {
    Button,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Keyboard,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { spacing, typography } from '../../../styles/theme';
import MultiChoice, {
    Option,
} from '../../../components/choice_component/MultipleChoice';
import UniqueChoice from '../../../components/choice_component/UniqueChoice';
import { InputField } from '../../../components/core/PlaceHolders';
import { CButton } from '../../../components/core/Buttons';

export function ModalAddClothInfo({ open, onCancel, onSave }) {
    const [clothType, setClothType] = React.useState<
        'upper' | 'lower' | 'dress' | undefined
    >();
    const [category, setCategory] = React.useState<string>();
    const [clothId, setClothId] = React.useState<string>();

    const saveNewCloth = () => {
        onSave(clothType, category, clothId);
        setClothType(undefined);
        setCategory(undefined);
        setClothId(undefined);
    };

    const clothTypeOption: Option[] = React.useMemo(
        () => [
            { key: 'upper', label: 'Haut du corps' },
            { key: 'lower', label: 'Bas du corps' },
            { key: 'dress', label: 'Corps entier' },
        ],
        [],
    );

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
                        <Text style={styles.typeText}>Type :</Text>
                        <View
                            style={{ flex: 1, marginVertical: spacing.small }}
                        >
                            <UniqueChoice
                                options={clothTypeOption}
                                selected={clothType}
                                onChange={(key) => {
                                    if (
                                        key === 'upper' ||
                                        key === 'lower' ||
                                        key === 'dress'
                                    )
                                        setClothType(key);
                                }}
                            />
                        </View>

                        <InputField
                            placeholder="Nom"
                            value={clothId}
                            onChangeText={setClothId}
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        <InputField
                            placeholder="Catégorie (ex. 'robe', 't-shirt')"
                            value={category}
                            onChangeText={setCategory}
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        <CButton
                            variant="primary"
                            size="xlarge"
                            disabled={
                                clothType === undefined ||
                                !clothId === undefined ||
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
