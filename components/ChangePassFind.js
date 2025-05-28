import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

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
      // Step 1: Check if the timer is still active
      const savedTime = await AsyncStorage.getItem(`verificationTimer_${email}`);
      if (savedTime) {
        const remainingTime = parseInt(savedTime, 10) - Math.floor(Date.now() / 1000);
        if (remainingTime > 0) {
          Alert.alert(`Please wait for the countdown to finish before resending the OTP. Time left: ${formatTime(remainingTime)}`);
          return;
        } else {
          // Clear expired timer
          await AsyncStorage.removeItem(`verificationTimer_${email}`);
        }
      }

      // Step 2: Verify if the email exists
      const response = await fetch(`${BASE_URL}/api/users/find-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Email found:', data);

        // Step 3: Send OTP to the user's email
        const otpResponse = await fetch(`${BASE_URL}/api/otp/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const otpData = await otpResponse.json();

        if (otpResponse.ok) {
          console.log('OTP sent successfully:', otpData);
          Alert.alert('Success', 'OTP has been sent to your email');

          // Step 4: Save the timer in AsyncStorage
          const newTime = 60; // 1 minute
          await AsyncStorage.setItem(`verificationTimer_${email}`, (Math.floor(Date.now() / 1000) + newTime).toString());

          // Step 5: Navigate to VerificationForgotPass screen
          navigation.navigate('VerificationForgotPass', { email });
        } else {
          console.error('Error sending OTP:', otpData);
          Alert.alert('Error', otpData.message || 'Failed to send OTP');
        }
      } else {
        Alert.alert('Error', data.message || 'Email not found');
      }
    } catch (error) {
      console.error('Find Account Error:', error);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
  };

  return (
    <ImageBackground source={require("../assets/resetPassBG.png")} style={styles.background}>
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
        />

        <TouchableOpacity onPress={handleFindAccount} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button2}>
          <Text style={styles.buttonText2}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backButton: { 
    position: 'absolute', 
    top: height * 0.06, 
    left: width * 0.05 
  },
  backIcon: { 
    width: width * 0.11, 
    height: width * 0.11 
  },
  container: { 
    width: '85%', 
    padding: width * 0.06, 
    backgroundColor: 'white', 
    borderRadius: width * 0.06, 
    alignItems: 'center' 
  },
  header: { 
    fontSize: width * 0.07, 
    fontWeight: 'bold', 
    marginBottom: height * 0.012 
  },
  subHeader: { 
    fontSize: width * 0.040, 
    color: 'gray', 
    marginBottom: height * 0.025, 
    textAlign: 'center'
  },
  input: { 
    width: '100%', 
    height: height * 0.06, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: width * 0.025, 
    paddingLeft: width * 0.03, 
    marginBottom: height * 0.018, 
    fontSize: width * 0.045
  },
  button: { 
    marginTop: height * 0.018, 
    backgroundColor: '#00aa13', 
    padding: height * 0.015, 
    borderRadius: width * 0.13, 
    width: '80%', 
    alignItems: 'center' 
  },
  button2: { 
    marginTop: height * 0.012, 
    backgroundColor: 'white', 
    padding: height * 0.015, 
    borderRadius: width * 0.13, 
    borderColor: '#00aa13', 
    borderWidth: 1, 
    width: '80%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontSize: width * 0.045 
  },
  buttonText2: { 
    color: '#00aa13', 
    fontSize: width * 0.045 
  },
});

export default ChangePassFinds;
