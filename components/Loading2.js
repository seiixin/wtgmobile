import React from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';

const Loading2 = () => {
  return (
    <ImageBackground
      source={require('../assets/Load2.png')} 
      style={styles.background}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logoLoad2.png')} style={styles.logo} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});

export default Loading2;
