import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const VerificationForgotPass = () => {
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';
  const inputRefs = Array.from({ length: 6 }, () => React.createRef());

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
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
        setTimeLeft(60);
        setVerificationCode(Array(6).fill(''));
        if (inputRefs[0] && inputRefs[0].current) inputRefs[0].current.focus();
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
        setIsVerified(true);
      } else {
        Alert.alert("Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error verifying OTP. Please try again.");
    }
  };

  const handleConfirmation = () => {
    setIsVerified(false);
    navigation.navigate("ResetPassword", { email });
  };

  // Auto proceed after 2 seconds when verified
  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        handleConfirmation();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/VerificationBg.png')}
      style={styles.background}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Back Button */}
      {!isVerified && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <View style={styles.backButtonCircle}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Please enter the code we just sent to</Text>
        <Text style={styles.email}>{email}</Text>
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
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp('100%'),
    height: hp('105%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f6f6f6",
  },
  card: {
    backgroundColor: '#fff',
    padding: wp('8%'),
    borderRadius: wp('10%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.7%') },
    shadowOpacity: 0.2,
    shadowRadius: wp('3%'),
    elevation: 6,
    top: hp('2%'),
    width: wp('88%'),
    alignItems: 'center',
    marginVertical: hp('2%'),
    marginBottom: hp('6%'),
  },
  title: {
    fontSize: RFValue(22, height),
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: RFValue(15, height),
    color: '#777',
    marginVertical: hp('2%'),
    textAlign: 'center',
  },
  email: {
    color: 'green',
    fontSize: RFValue(15, height),
    marginBottom: hp('1%'),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: hp('2.5%'),
  },
  inputBox: {
    width: wp('11%'),
    height: wp('11%'),
    backgroundColor: '#f5f5f5',
    borderRadius: wp('2.5%'),
    textAlign: 'center',
    fontSize: RFValue(16, height),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  timer: {
    fontSize: RFValue(13, height),
    color: '#555',
  },
  click: {
    marginTop: hp('2%'),
    color: '#6d6d6d',
    fontSize: RFValue(13, height),
  },
  resendButton: {
    marginTop: hp('0.5%'),
  },
  resendButtonText: {
    color: 'green',
    fontSize: RFValue(12, height),
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
    paddingVertical: hp('1.5%'),
    borderRadius: wp('10%'),
    marginTop: hp('3%'),
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: RFValue(16, height),
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: hp('8%'),
    left: wp('7%'),
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 10,
  },
  backButtonCircle: {
    backgroundColor: '#fcbd21',
    borderRadius: wp('6%'),
    width: wp('12%'),
    height: wp('12%'),
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
    paddingHorizontal: wp('5%'),
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: wp('8%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: RFValue(20, height),
    fontWeight: 'bold',
    marginTop: hp('1%'),
    color: '#000',
  },
  modalMessage: {
    fontSize: RFValue(15, height),
    textAlign: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('2.5%'),
    color: '#555',
  },
  confirmButton: {
    backgroundColor: '#38b6ff',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('8%'),
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: RFValue(16, height),
    fontWeight: 'bold',
  },
});

export default VerificationForgotPass;