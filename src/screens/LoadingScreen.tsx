import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export function LoadingScreen({navigation} : any){
  useEffect(() => {
    // Simulate loading and navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen'); // Navigate to Home and remove LaunchScreen from the stack
    }, 1300);

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, [navigation]);


  return (
    <View style={styles.container}>
      <Image source={require('../assets/icons/logo-wearit.png')} style={styles.logo} />
      <LottieView
        source={require('../assets/lottie/lottie-loading-spinner.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Adjust as needed
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  animation: {
    width: 200,
    height: 200,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#888888',
  },
});
