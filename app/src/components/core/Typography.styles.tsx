import { StyleSheet } from 'react-native';
import { normalize } from '../../styles/theme';

const typographyStyles = StyleSheet.create({
    // Headers
    h1: {
        fontSize: normalize(64),
        letterSpacing: -3.2,
        lineHeight: 70,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
        fontFamily: 'DM-Sans-Bold',
        fontWeight: '800',
        color: '#1a1a1a',
    },
    h2: {
        fontSize: 32,
        letterSpacing: -1.6,
        lineHeight: 40,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        color: '#1a1a1a',
    },
    h3: {
        fontSize: 24,
        lineHeight: 29,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        color: '#1a1a1a',
    },
    h4: {
        fontSize: 20,
        lineHeight: 24,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
        color: '#1a1a1a',
    },

    // Body text
    large: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Poppins-Regular',
        color: '#1a1a1a',
        fontWeight: '600',
    },
    medium: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
        color: '#1a1a1a',
        fontWeight: '600',
    },
    small: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'Poppins-Regular',
        color: '#1a1a1a',
        fontWeight: '600',
    },
});

export default typographyStyles;
