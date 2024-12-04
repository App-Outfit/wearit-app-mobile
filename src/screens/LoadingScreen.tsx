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
    <View style={styles.loading_screen}>
      <View style={styles.container}>
        <Image source={require('../assets/icons/logo-wearit.png')} style={styles.logo} />
      </View>
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
  loading_screen: {
    flex: 1,
    backgroundColor: '#000000',
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
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#888888',
  },
});
