import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Overlay, ListItem } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Entypo';

export default function DropdownMenu() {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={styles.dropdownButton}
            >
                <View style={{ paddingRight: 3 }}>
                    <Icon name="sound-mix" size={25} color="black" />
                </View>
                <View style={{ paddingLeft: 3 }}>
                    <Icon name="chevron-small-down" size={25} color="#999999" />
                </View>
            </TouchableOpacity>

            <Overlay
                isVisible={visible}
                onBackdropPress={() => setVisible(false)}
                overlayStyle={styles.menuOverlay}
            >
                <View>
                    <ListItem onPress={() => {}}>
                        <ListItem.Content>
                            <ListItem.Title>Option 1</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem onPress={() => {}}>
                        <ListItem.Content>
                            <ListItem.Title>Option 2</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem onPress={() => {}}>
                        <ListItem.Content>
                            <ListItem.Title>Option 3</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                </View>
            </Overlay>
        </>
    );
}

const styles = StyleSheet.create({
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E6E6E6',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    menuOverlay: {
        padding: 0,
        width: 220,
        borderRadius: 12,
    },
});
