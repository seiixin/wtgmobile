import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";
const { width, height } = Dimensions.get('window');

const VerificationRegister = () => {
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerId, setTimerId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const inputRefs = Array.from({ length: 6 }, () => React.createRef());

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
    startTimer(60);
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
    if (!/^\d*$/.test(text)) return;
    let codeArray = [...verificationCode];
    codeArray[index] = text;
    setVerificationCode(codeArray);
    if (text && index < 5) {
      const nextInputRef = inputRefs[index + 1];
      if (nextInputRef && nextInputRef.current) nextInputRef.current.focus();
    }
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
        startTimer(60);
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
        // Step 2: Complete the registration process
        const registerResponse = await fetch(`${BASE_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(route.params.formData),
        });
        const registerData = await registerResponse.json();
        if (registerResponse.ok) {
          setIsVerified(true);
          await AsyncStorage.removeItem(`verificationTimer_${email}`);
        } else {
          Alert.alert(registerData.message || 'Registration failed');
        }
      } else {
        Alert.alert("Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error verifying OTP. Please try again.");
    }
  };

  const handleConfirmation = () => {
    setIsVerified(false);
    navigation.navigate("SignIn");
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/VerificationBg.png')}
      style={styles.background}
      resizeMode="cover"
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
            <Ionicons name="arrow-back" size={RFValue(22, height)} color="#fff" />
          </View>
        </TouchableOpacity>
      )}

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

        {/* REMOVE the continue/verify button below */}
        {/* 
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
          <Text style={styles.verifyButtonText}>Verify Email</Text>
        </TouchableOpacity>
        */}
      </View>

      {/* Confirmation Modal */}
      {isVerified && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={RFValue(60, height)} color="#38b6ff" />
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
    height: hp('105%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f6f6f6",
  },
  card: {
    backgroundColor: '#fff',
    padding: wp('7%'),
    borderRadius: wp('7%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.7%') },
    shadowOpacity: 0.2,
    shadowRadius: wp('2%'),
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: RFValue(15, height),
    color: '#777',
    marginVertical: hp('1.5%'),
    textAlign: 'center',
  },
  email: {
    color: 'green',
    fontSize: RFValue(15, height),
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '110%',
    marginVertical: hp('2%'),
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
    marginHorizontal: wp('1%'),
    fontFamily: 'Inter_700Bold',
  },
  timer: {
    fontSize: RFValue(13, height),
    color: '#555',
    textAlign: 'center',
  },
  click: {
    marginTop: hp('1.5%'),
    color: '#6d6d6d',
    fontSize: RFValue(13, height),
    textAlign: 'center',
  },
  resendButton: {
    marginTop: hp('0.5%'),
  },
  resendButtonText: {
    color: 'green',
    fontSize: RFValue(12, height),
    textDecorationLine: 'underline',
    textAlign: 'center',
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
    marginTop: hp('2.5%'),
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: RFValue(16, height),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: hp('6%'),
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
    padding: wp('7%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: RFValue(20, height),
    fontWeight: 'bold',
    marginTop: hp('1%'),
    color: '#000',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: RFValue(15, height),
    textAlign: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
    color: '#555',
  },
  confirmButton: {
    backgroundColor: '#38b6ff',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('8%'),
    marginTop: hp('1%'),
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: RFValue(16, height),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VerificationRegister;