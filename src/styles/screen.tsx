import { StackNavigationOptions } from '@react-navigation/stack';

export const screenOptions: StackNavigationOptions = {
    headerTitleAlign: 'center',
    headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: '#fff',
    },
    cardStyle: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 0,
    },
    headerTitleStyle: {
        fontSize: 22,
        fontWeight: 700,
        fontFamily: 'Poppins',
        letterSpacing: 0.5,
    },
};
