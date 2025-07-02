import * as React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
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
        onSave({
            cloth_type: clothType,
            category,
            cloth_id: clothId,
        });
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
        <Modal
            visible={open}
            animationType="fade"
            transparent
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.modalContent}
                    >
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
                                clothId === undefined ||
                                category === undefined
                            }
                            onPress={saveNewCloth}
                        >
                            Enregistrer
                        </CButton>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    },
    typeText: {
        fontFamily: typography.poppins.regular,
        fontSize: 16,
    },
});
