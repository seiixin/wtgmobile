import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const RosaryPrayer = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('RosaryPrayer');

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground
        source={require('../assets/RosaryBg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Back Button at the top-left edge */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp('7%')} color="white" />
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
            <Ionicons name="arrow-forward" size={wp('5%')} color="#4caf50" />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <Image
            source={require('../assets/LogosP.png')}
            style={{ width: wp('25%'), height: hp('7%'), marginTop: hp('5%') }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: hp('6%'),
    left: wp('5%'),
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: wp('2.5%'),
    borderRadius: wp('6%'),
  },
  container: {
    marginTop: hp('12%'),
    marginHorizontal: wp('7%'),
    backgroundColor: '#f0f5da',
    borderRadius: wp('5%'),
    padding: wp('6%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    color: '#4caf50',
    fontSize: RFValue(22, height),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: hp('1%'),
    fontFamily: 'Inter_700Bold',
  },
  description: {
    fontSize: RFValue(15, height),
    color: '#333',
    textAlign: 'center',
    marginVertical: hp('2%'),
    fontFamily: 'Inter_400Regular',
  },
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
  },
  offerButtonText: {
    color: '#4caf50',
    fontSize: RFValue(16, height),
    marginRight: wp('2%'),
    fontFamily: 'Inter_700Bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
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
    height: hp('9%'),
  },
  navItem: {
    alignItems: 'center',
  },
});

export default RosaryPrayer;
