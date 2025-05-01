import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RosaryPrayer = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('RosaryPrayer'); // Default selected tab

  return (
    <ImageBackground
      source={require('../assets/RosaryBg.png')}
      style={styles.background}
    >
      {/* Back Button at the top-left edge */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Prayers of the Holy Rosary</Text>
        <Text style={styles.description}>
          The Rosary prayers are the Apostles Creed, Our Father, Hail Marys, Glory Be, and, if desired, the Fatima Prayer. Next come five mysteries. Rosary prayers conclude with the Hail Holy Queen.
        </Text>
        
        {/* Offer a Prayer Button without Background */}
        <TouchableOpacity 
          style={styles.offerButton} 
          onPress={() => navigation.navigate('RosaryOffer')}
          >
          <Text style={styles.offerButtonText}>Offer a Prayer</Text>
          <Ionicons name="arrow-forward" size={20} color="#4caf50" />
        </TouchableOpacity>

      </View>

      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 20,
  },
  container: {
    padding: 20,
    backgroundColor: '#f0f5da',
    height: 200,
    bottom: 50,
  },
  title: {
    color: '#4caf50',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  offerButtonText: {
    color: '#4caf50', // Keeps text color unchanged
    fontSize: 16,
    marginRight: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default RosaryPrayer;
