import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from "react-native-responsive-fontsize";

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const { width, height } = Dimensions.get('window');

const VerificationRegister = () => {
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false); // State to track verification status
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const [timerId, setTimerId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const inputRefs = Array.from({ length: 6 }, () => React.createRef());

  // Start or restart the countdown timer
  const startTimer = (duration = 60) => {
    setTimeLeft(duration);
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(id);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  useEffect(() => {
    if (route.params && route.params.email) {
      setEmail(route.params.email);
    }
    startTimer(60); // Start timer on mount

    return () => {
      if (timerId) clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (text, index) => {
    if (!/^\d*$/.test(text)) return; // Only allow numeric input

    let codeArray = [...verificationCode];
    codeArray[index] = text;
    setVerificationCode(codeArray);

    // Auto-focus next input
    if (text && index < 5) {
      const nextInputRef = inputRefs[index + 1];
      if (nextInputRef && nextInputRef.current) nextInputRef.current.focus();
    }

    // Auto-submit when last digit is entered
    if (text && index === 5 && codeArray.every((digit) => digit !== '')) {
      handleVerifyCode(codeArray.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInputRef = inputRefs[index - 1];
      if (prevInputRef && prevInputRef.current) prevInputRef.current.focus();
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) {
      Alert.alert(`Please wait for the countdown to finish before resending the code. Time left: ${formatTime(timeLeft)}`);
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
        startTimer(60); // Reset the timer to 1 minute
        await AsyncStorage.setItem(`verificationTimer_${email}`, (Math.floor(Date.now() / 1000) + 60).toString());
      } else {
        Alert.alert("Failed to resend OTP. Please try again.");
        console.error("Resend OTP error:", data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      Alert.alert("Error resending OTP. Please try again.");
    }
  };

  const handleVerifyCode = async (code) => {
    try {
      const otp = code || verificationCode.join('');
      const response = await fetch(`${BASE_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP verified successfully:", data);

        // Step 2: Complete the registration process
        const registerResponse = await fetch(`${BASE_URL}/api/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(route.params.formData),
        });

        const registerData = await registerResponse.json();

        if (registerResponse.ok) {
          setIsVerified(true); // Show confirmation modal
          await AsyncStorage.removeItem(`verificationTimer_${email}`); // Reset the OTP timer in AsyncStorage
        } else {
          console.error('Error completing registration:', registerData);
          Alert.alert(registerData.message || 'Registration failed');
        }
      } else {
        Alert.alert("Invalid or expired OTP. Please try again.");
        console.error("OTP verification error:", data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error verifying OTP. Please try again.");
    }
  };

  const handleConfirmation = () => {
    setIsVerified(false);
    navigation.navigate("SignIn"); // Navigate to the SignIn screen
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
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Please enter the code we just sent to</Text>
        <Text style={styles.email}>{email}</Text>
        {/* OTP Input Fields */}
        <View style={styles.inputContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={styles.inputBox}
              value={verificationCode[index]}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
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
          disabled={timeLeft > 0}
        >
          <Text style={[styles.resendButtonText, timeLeft > 0 && styles.disabledText]}>
            Resend Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
          <Text style={styles.verifyButtonText}>Verify Email</Text>
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
              <Text style={styles.confirmButtonText}>Continue to Sign In</Text>
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
    height: height * 1.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f6f6f6",
  },
  card: {
    backgroundColor: '#fff',
    padding: width * 0.08,
    borderRadius: width * 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    top: 20,
    width: width * 0.88,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 50,
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: RFValue(15),
    color: '#777',
    marginVertical: 15,
    textAlign: 'center',
  },
  email: {
    color: 'green',
    fontSize: RFValue(15),
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  inputBox: {
    width: width * 0.11,
    height: width * 0.11,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: RFValue(16),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  timer: {
    fontSize: RFValue(13),
    color: '#555',
  },
  click: {
    marginTop: 15,
    color: '#6d6d6d',
    fontSize: RFValue(13),
  },
  resendButton: {
    marginTop: 5,
  },
  resendButtonText: {
    color: 'green',
    fontSize: RFValue(12),
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: 'gray',
  },
  verifyButton: {
    width: '85%',
    backgroundColor: '#00aa13',
    paddingVertical: height * 0.015,
    borderRadius: 50,
    marginTop: 25,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 10,
  },
  backButtonCircle: {
    backgroundColor: '#fcbd21',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: width * 0.08,
    borderRadius: width * 0.06,
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  modalMessage: {
    fontSize: RFValue(15),
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    color: '#555',
  },
  confirmButton: {
    backgroundColor: '#38b6ff',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 30,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});

export default VerificationRegister;