import * as React from 'react';

import { View } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';

export default function DropdownMenu() {
    const [visible, setVisible] = React.useState(false);

    return (
        <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
                <Button
                    onPress={() => setVisible(true)}
                    style={{
                        borderWidth: 1.5,
                        borderColor: '#E6E6E6',
                        borderRadius: 8,
                    }}
                >
                    <View style={{ paddingRight: 3 }}>
                        <Icon name="sound-mix" size={25} color="black" />
                    </View>
                    <View style={{ paddingLeft: 3 }}>
                        <Icon
                            name="chevron-small-down"
                            size={25}
                            color="#999999"
                        />
                    </View>
                </Button>
            }
            anchorPosition="bottom"
            statusBarHeight={40}
            contentStyle={{
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 0,
                backgroundColor: 'white',
            }}
        >
            <Menu.Item onPress={() => {}} title="Option 1" />
            <Menu.Item onPress={() => {}} title="Option 2" />
            <Menu.Item onPress={() => {}} title="Option 3" />
        </Menu>
    );
}
