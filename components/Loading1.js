import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Loading1 = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logoLoad.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',  // White background
    justifyContent: 'center',    // Center content vertically
    alignItems: 'center',        // Center content horizontally
  },
  logo: {
    width: 150,  // Adjust as needed
    height: 150, // Adjust as needed
    resizeMode: 'contain', // Keep aspect ratio
  },
});

export default Loading1;
