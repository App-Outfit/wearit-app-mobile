import { StyleSheet } from 'react-native';
import { lightTheme } from '../../styles/theme';

const styles = StyleSheet.create({
    loading_screen: {
        flex: 1,
        backgroundColor: lightTheme.colors.lauchScreen,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginTop: 100,
    },
    animation: {
        width: 50,
        height: 50,
        marginBottom: 150,
        marginTop: 0,
    },
});

export default styles;
