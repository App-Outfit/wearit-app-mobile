import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import typographyStyles from './Typography.styles';

// Header component
type HeaderProps = {
    variant: 'h1' | 'h2' | 'h3' | 'h4';
    style?: TextStyle;
    children: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({ variant, style, children }) => {
    const headerStyle = StyleSheet.compose(typographyStyles[variant], style);

    return <Text style={headerStyle}>{children}</Text>;
};

// BodyText component
type BodyTextProps = {
    variant: 'large' | 'medium' | 'small';
    style?: TextStyle;
    children: React.ReactNode;
};

export const BodyText: React.FC<BodyTextProps> = ({
    variant,
    style,
    children,
}) => {
    const bodyTextStyle = StyleSheet.compose(typographyStyles[variant], style);

    return <Text style={bodyTextStyle}>{children}</Text>;
};
