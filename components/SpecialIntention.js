import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const SpecialIntention = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('SpecialIntention');
  const [accountRemovedModal, setAccountRemovedModal] = useState(false);

  useEffect(() => {
    let intervalId;
    const checkUserExists = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;
        const response = await fetch(`${BASE_URL}/api/users/${userId}`);
        if (!response.ok) {
          setAccountRemovedModal(true);
          await AsyncStorage.removeItem("userId");
          return;
        }
        const data = await response.json();
        if (!data || data.error || data.message === "User not found") {
          setAccountRemovedModal(true);
          await AsyncStorage.removeItem("userId");
        }
      } catch (error) {
        // Optionally handle network errors
      }
    };
    intervalId = setInterval(checkUserExists, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Modal
        visible={accountRemovedModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" translucent />
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 24,
            alignItems: 'center',
            width: '80%'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: 'red' }}>
              Your account has been removed by the administrator.
            </Text>
            <TouchableOpacity
              style={{ padding: 10, marginTop: 16 }}
              onPress={() => {
                setAccountRemovedModal(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
                });
              }}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require('../assets/SpecialIntentionBG.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Back Button at the top-left edge */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp('7%')} color="white" />
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.title}>A Prayer for Special Intentions</Text>
          <Text style={styles.description}>
            Special intentions prayers allow users to offer personalized prayers based on their needs. These include prayers for protection, asking God to guard against harm and evil; prayers for strength, seeking divine help in times of difficulty; and prayers for guidance, asking for wisdom and direction in making decisions.
          </Text>
          <TouchableOpacity style={styles.offerButton} onPress={() => navigation.navigate('SpecialIntentionsOffer')}>
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

export default SpecialIntention;
