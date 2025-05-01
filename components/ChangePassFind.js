import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChangePassFinds = () => {
  const [email, setEmail] = useState('');
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

  const handleFindAccount = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your registered email');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/users/find-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpModalVisible(true);
      } else {
        Alert.alert('Error', data.message || 'Email not found');
      }
    } catch (error) {
      console.error('Find Account Error:', error);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
  };

  const handleVerifyOtp = () => {
    setOtpModalVisible(false);
    navigation.navigate('ResetPassword', { email });
  };

  return (
    <ImageBackground source={require("../assets/resetPassBG.png")} style={styles.background}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require("../assets/BackButton.png")} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.header}>Find Your Account</Text>
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

      <Modal visible={isOtpModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleVerifyOtp} style={styles.button}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backIcon: { width: 40, height: 40 },
  container: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 20, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 16, color: 'gray', marginBottom: 20 },
  input: { width: '100%', height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingLeft: 10, marginBottom: 15 },
  button: { marginTop:15, backgroundColor: '#00aa13', padding: 15, borderRadius: 50, width: '80%', alignItems: 'center' },
  button2: { marginTop:10, backgroundColor: 'white', padding: 15, borderRadius: 50, borderColor: '#00aa13', borderWidth:1, width: '80%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
  buttonText2: { color: '#00aa13', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default ChangePassFinds;
