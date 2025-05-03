import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState(''); // State to store the email
  const navigation = useNavigation();

  // Fetch user email from the database
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Retrieve userId from AsyncStorage
        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/users/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setEmail(data.email); // Set the email in state
        } else {
          console.error("Failed to fetch user email:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  }, []);

  const handleInputChange = (text, index) => {
    let codeArray = verificationCode.split('');
    codeArray[index] = text;
    setVerificationCode(codeArray.join(''));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/VerificationBg.png')}
      style={styles.background}
    >
      {/* Back Button with Ionicon */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Please enter the verification code sent to your email.</Text>
        <Text style={styles.email}>{email}</Text> 
        <View style={styles.inputContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TextInput
              key={index}
              style={styles.inputBox}
              value={verificationCode[index] || ''}
              onChangeText={(text) => handleInputChange(text, index)}
              maxLength={1}
              keyboardType="number-pad"
              textAlign="center"
            />
          ))}
        </View>

        <Text style={styles.click}>Don't receive OTP?</Text>
        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendButtonText}>Resend Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={() => navigation.navigate('MainTabs', { screen: 'HistoryTab' })}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '104%',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: "#f6f6f6", 
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,  
    borderRadius: 50,  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.2,  
    shadowRadius: 12,  
    elevation: 6, 
    top: 20,
    width: '85%',
    alignItems: 'center', 
    marginVertical: 20,
  },
  title: {
    fontSize: 28,  
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,  
    color: '#777',
    marginVertical: 15,  
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20, 
  },
  inputBox: {
    width: 50,  
    height: 50,    
    backgroundColor: '#f5f5f5',
    borderRadius: 10,  
    textAlign: 'center',
    fontSize: 24,  
    borderWidth: 1,
    borderColor: '#ccc',
  },
  click: {
    marginTop: 15,  
    color: '#6d6d6d',
    fontSize: 16,  
  },
  resendButton: {
    marginTop: 15,  
  },
  resendButtonText: {
    color: 'green',
    fontSize: 16,  
  },
  verifyButton: {
    width: '85%',
    backgroundColor: '#00aa13',
    paddingVertical: 15,  
    borderRadius: 50,  
    marginTop: 25,  
    alignItems: 'center',
  }, 
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,  
    fontWeight: 'bold',
  },
  email: {
    color: 'green',
    bottom: 10
  },
  backButton: {
    position: 'absolute', 
    top: 40, 
    left: 20, 
    backgroundColor: 'transparent',
    padding: 10,
  },
});

export default Verification;
