import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ChangePassFinds = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFindAccount = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your registered email');
      return;
    }

    try {
      const savedTime = await AsyncStorage.getItem(`verificationTimer_${email}`);
      if (savedTime) {
        const remainingTime = parseInt(savedTime, 10) - Math.floor(Date.now() / 1000);
        if (remainingTime > 0) {
          Alert.alert(`Please wait for the countdown to finish before resending the OTP. Time left: ${formatTime(remainingTime)}`);
          return;
        } else {
          await AsyncStorage.removeItem(`verificationTimer_${email}`);
        }
      }

      const response = await fetch(`${BASE_URL}/api/users/find-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        const otpResponse = await fetch(`${BASE_URL}/api/otp/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const otpData = await otpResponse.json();

        if (otpResponse.ok) {
          Alert.alert('Success', 'OTP has been sent to your email');
          const newTime = 60;
          await AsyncStorage.setItem(`verificationTimer_${email}`, (Math.floor(Date.now() / 1000) + newTime).toString());
          navigation.navigate('VerificationForgotPass', { email });
        } else {
          Alert.alert('Error', otpData.message || 'Failed to send OTP');
        }
      } else {
        Alert.alert('Error', data.message || 'Email not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground source={require("../assets/resetPassBG.png")} style={styles.background} resizeMode="cover">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require("../assets/BackButton.png")} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.header}>Find your Account</Text>
          <Text style={styles.subHeader}>Enter your email to reset your password</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity onPress={handleFindAccount} style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button2}>
            <Text style={styles.buttonText2}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: hp('6%'),
    left: wp('5%'),
    zIndex: 10,
  },
  backIcon: {
    width: wp('11%'),
    height: wp('11%'),
    resizeMode: 'contain',
  },
  container: {
    width: wp('85%'),
    padding: wp('6%'),
    backgroundColor: 'white',
    borderRadius: wp('6%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('1.2%'),
    fontFamily: 'Inter_700Bold',
    color: '#222',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: wp('4%'),
    color: 'gray',
    marginBottom: hp('2.5%'),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  input: {
    width: '100%',
    height: hp('6%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp('2.5%'),
    paddingLeft: wp('3%'),
    marginBottom: hp('1.8%'),
    fontSize: wp('4.2%'),
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#f8f8f8',
  },
  button: {
    marginTop: hp('1.8%'),
    backgroundColor: '#00aa13',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('10%'),
    width: '80%',
    alignItems: 'center',
  },
  button2: {
    marginTop: hp('1.2%'),
    backgroundColor: 'white',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('10%'),
    borderColor: '#00aa13',
    borderWidth: 1,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: wp('4.2%'),
    fontFamily: 'Inter_700Bold',
  },
  buttonText2: {
    color: '#00aa13',
    fontSize: wp('4.2%'),
    fontFamily: 'Inter_700Bold',
  },
});

export default ChangePassFinds;
