// DrawerToggleButton.tsx
import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    GestureResponderEvent,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
    /** true si le drawer est ouvert */
    active: boolean;
    /** fonction à appeler au clic pour toggler le drawer */
    onPress: (event: GestureResponderEvent) => void;
    /** taille du bouton en px (optionnel) */
    size?: number;
    /** couleur de fond (optionnel) */
    backgroundColor?: string;
    /** couleur de l’icône (optionnel) */
    iconColor?: string;
    /** styles additionnels (optionnel) */
    style?: object;
};

export const DrawerToggleButton: React.FC<Props> = ({
    active,
    onPress,
    size = 48,
    backgroundColor = '#6200ee',
    iconColor = '#ffffff',
    style = {},
}) => {
    const [activeName, setActive] = React.useState<
        'chevron-left' | 'chevron-right'
    >('chevron-right');

    const onPressFnct = (event: GestureResponderEvent) => {
        setActive(
            activeName === 'chevron-left' ? 'chevron-right' : 'chevron-left',
        );
        onPress(event);
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                },
                style,
            ]}
            onPress={onPressFnct}
            activeOpacity={0.7}
        >
            <Feather name={activeName} size={size * 0.5} color={iconColor} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
});
