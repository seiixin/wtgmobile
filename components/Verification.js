import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false); // State to track verification status
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const navigation = useNavigation();
  const inputRefs = Array.from({ length: 6 }, () => React.createRef());

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/users/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setEmail(data.email);
        } else {
          console.error("Failed to fetch user email:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const savedTime = await AsyncStorage.getItem(`verificationTimer_${email}`);
        if (savedTime) {
          const remainingTime = parseInt(savedTime, 10) - Math.floor(Date.now() / 1000);
          setTimeLeft(remainingTime > 0 ? remainingTime : 0);
          if (remainingTime <= 0) {
            await AsyncStorage.removeItem(`verificationTimer_${email}`); // Clear expired timer
          }
        }
      } catch (error) {
        console.error("Error fetching timer:", error);
      }
    };

    fetchTimer();
  }, [email]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the interval on component unmount
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;

    let codeArray = verificationCode.split('');
    codeArray[index] = text;
    setVerificationCode(codeArray.join(''));

    if (text && index < 5) {
      const nextInput = index + 1;
      const nextInputRef = inputRefs[nextInput];
      if (nextInputRef && nextInputRef.current) nextInputRef.current.focus();
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) {
      Alert.alert(`Please wait for the countdown to finish before resending the OTP. Time left: ${formatTime(timeLeft)}`);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("OTP resent successfully!");
        setTimeLeft(60); // Reset the timer to 60 seconds
      } else {
        Alert.alert("Failed to resend OTP. Please try again.");
        console.error("Resend OTP error:", data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      Alert.alert("Error resending OTP. Please try again.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP verified successfully:", data);
        setIsVerified(true); // Show confirmation modal
        // Reset the verification timer in AsyncStorage
        await AsyncStorage.removeItem(`verificationTimer_${email}`);
      } else {
        alert("Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      alert("Error verifying OTP. Please try again.");
    }
  };

  const handleConfirmation = () => {
    setIsVerified(false);
    navigation.navigate("MainTabs", { screen: "HistoryTab" }); // Navigate to the main app
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/VerificationBg.png')}
      style={styles.background}
    >
      {/* Back Button */}
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
              ref={(ref) => (inputRefs[index] = ref)}
              style={styles.inputBox}
              value={verificationCode[index] || ''}
              onChangeText={(text) => handleInputChange(text, index)}
              maxLength={1}
              keyboardType="number-pad"
              textAlign="center"
            />
          ))}
        </View>

        {/* Countdown Timer */}
        <Text style={styles.timer}>Time left: {formatTime(timeLeft)}</Text>
        <Text style={styles.click}>Don't receive OTP?</Text>
        <TouchableOpacity
          style={[styles.resendButton, timeLeft > 0 && styles.disabledButton]}
          onPress={handleResendCode}
          disabled={timeLeft > 0} // Disable button if countdown is ongoing
        >
          <Text style={[styles.resendButtonText, timeLeft > 0 && styles.disabledText]}>
            Resend Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      {isVerified && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={80} color="#38b6ff" />
            <Text style={styles.modalTitle}>Verified!</Text>
            <Text style={styles.modalMessage}>
              Yahoo! You have successfully verified the account.
            </Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmation}>
              <Text style={styles.confirmButtonText}>Continue to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginBottom: 50,
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
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginVertical: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#38b6ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timer: { fontSize: 14, color: 'red', marginBottom: 0},
  disabledButton: { opacity: 0.5 },
  disabledText: { color: 'gray' },
});

export default Verification;
