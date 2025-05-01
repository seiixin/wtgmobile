import React, { useState } from 'react';
import { View, Text, ImageBackground, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NovenaPrayer = () => {
  const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('NovenaPrayer'); // Default selected tab
     

  return (
    <ImageBackground
      source={require('../assets/NovenaBg.png')} 
      style={styles.background}
    >
      {/* Back Button at the top-left edge */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Prayers for All 9 Days</Text>
        <Text style={styles.description}>
          A Novena is made up of nine days of prayer and meditation usually to ask God for special prayer requests or petitions. Novenas are often used to ask specific saints to pray for us. The Saint Jude Novena, for example, is prayed to ask Saint Jude to intercede on behalf of a request that seems especially dire.
        </Text>
         <TouchableOpacity 
                  style={styles.offerButton} 
                  onPress={() => navigation.navigate('NovenaOffer')}
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
    top: 50,  // Adjust this for perfect alignment
    left: 20, // Pushes it to the left edge
    zIndex: 10, // Ensures it stays on top of other elements
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional background for better visibility
    padding: 10,
    borderRadius: 20,
  },
  container: {
    padding: 20,
    backgroundColor: '#f0f5da',
    height: 240,
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
  bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#f8f8f8',
        elevation: 10, // Shadow for Android
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: -8 }, // Shadow above the nav bar
        shadowOpacity: 0.4,
        shadowRadius: 4,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
    },
    navItem: {
      alignItems: 'center',
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
});

export default NovenaPrayer;
