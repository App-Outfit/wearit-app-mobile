import { StackNavigationOptions } from '@react-navigation/stack';

export const screenOptions: StackNavigationOptions = {
    headerTitleAlign: 'center',
    headerStyle: {
        boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
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
