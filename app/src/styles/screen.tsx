import { StackNavigationOptions } from '@react-navigation/stack';

export const screenOptions: StackNavigationOptions = {
    headerTitleAlign: 'center',
    headerStyle: {
        // borderBottomWidth: 1,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: '#fff',
        height: 90,
    },
    cardStyle: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 0,
    },
    headerTitleStyle: {
        fontSize: 18,
        fontWeight: 700,
        fontFamily: 'Poppins',
        letterSpacing: 0.5,
    },
};
