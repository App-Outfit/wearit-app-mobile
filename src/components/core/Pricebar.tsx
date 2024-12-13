import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { BodyText, Header } from './Typography';
import { lightTheme, normalize } from '../../styles/theme';

type SliderProps = {
    min?: number;
    max?: number;
    step?: number;
};

const Pricebar: React.FC<SliderProps> = ({ min = 1, max = 100, step = 1 }) => {
    const [range, setRange] = useState<number[]>([min, max / 2]);

    return (
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Header variant="h3">Prix</Header>
                <BodyText style={styles.text} variant="large">
                    {range[0]} $ - {range[1]} $
                </BodyText>
            </View>

            <MultiSlider
                values={range}
                sliderLength={300}
                onValuesChange={(values: number[]) => setRange(values)}
                min={min}
                max={max}
                step={step}
                selectedStyle={{
                    backgroundColor: lightTheme.colors.primary,
                    height: 4,
                }}
                unselectedStyle={{
                    backgroundColor: lightTheme.colors.lightGray,
                    height: 3,
                }}
                markerStyle={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: lightTheme.colors.white,
                    borderWidth: 1,
                    borderColor: lightTheme.colors.lightGray,
                }}
                pressedMarkerStyle={{
                    height: 25,
                    width: 25,
                    backgroundColor: lightTheme.colors.white,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 25,
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 310,
    },
    text: {
        color: lightTheme.colors.lightGray,
    },
});

export default Pricebar;
