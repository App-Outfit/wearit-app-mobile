import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Images, Animations } from '../../assets';
import LottieView from 'lottie-react-native';

import styles from './LoadingScreen.styles';

export function LoadingScreen({navigation} : any){
  useEffect(() => {
    // Simulate loading andimport styles from './LoadingScreen.styles'; navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      // Navigate to Home and remove LaunchScreen from the stack
      navigation.replace('HomeScreen'); 
    }, 1300);

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, [navigation]);


  return (
    <View style={styles.loading_screen}>
      <View style={styles.container}>
        <Image source={Images.logo_wearit} style={styles.logo} />
      </View>
      <LottieView
          source={Animations.loading_spinner}
          autoPlay
          loop
          style={styles.animation}
      />
    </View>
  );
};
