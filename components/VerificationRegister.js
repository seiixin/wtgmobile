import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const VerificationRegister = () => {
  const [verificationCode, setVerificationCode] = useState('');
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

    let codeArray = verificationCode.split('');
    codeArray[index] = text;
    setVerificationCode(codeArray.join(''));

    // Automatically focus the next input box
    if (text && index < 5) {
      const nextInput = index + 1;
      const nextInputRef = inputRefs[nextInput];
      if (nextInputRef && nextInputRef.current) nextInputRef.current.focus();
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

      <View style={styles.card}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Please enter the code we just sent to
</Text>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Inter_700Bold', // Use Inter for title
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginVertical: 15,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular', // Use Inter for subtitle
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
    fontFamily: 'Inter_700Bold', // Use Inter for input
  },
  click: {
    marginTop: 15,
    color: '#6d6d6d',
    fontSize: 16,
    fontFamily: 'Inter_400Regular', // Use Inter for click text
  },
  resendButton: {
    marginTop: 5,
  },
  resendButtonText: {
    color: 'green',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular', // Use Inter for resend
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
    fontFamily: 'CodeProBold', // Use Code Pro for button text
  },
  email: {
    color: 'green',
    bottom: 10,
    fontFamily: 'Inter_400Regular', // Use Inter for email
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 10,
  },
  backButtonCircle: {
    backgroundColor: '#fde245', // yellow
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
    fontFamily: 'Inter_700Bold', // Use Inter for modal title
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_400Regular', // Use Inter for modal message
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
    fontFamily: 'CodeProBold', // Use Code Pro for confirm button
  },
  timer: { fontSize: 16, color: 'red', marginBottom: 10, fontFamily: 'Inter_400Regular' },
  disabledButton: { opacity: 0.5 },
  disabledText: { color: 'gray', fontFamily: 'Inter_400Regular' },
});

export default VerificationRegister;