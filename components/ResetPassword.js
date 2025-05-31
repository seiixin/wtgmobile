import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, Image, StatusBar, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";
  const { email } = route.params;

  const validatePassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[@$!%*?&#]/.test(password);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Password Requirements',
        'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
      );
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Password reset successfully!');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
  };

  return (
    <ImageBackground source={require("../assets/resetPassBG2.png")} style={styles.background}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require("../assets/BackButton.png")} style={styles.backIcon} />
      </TouchableOpacity>
      
      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={require('../assets/ResetPLogo.png')} style={styles.icon} />
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter a new password below to change your password</Text>

          <Text style={styles.label}>New Password *</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your New Password"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={RFValue(18, height)} color="#d9d9d9" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Re-enter Password *</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Re-Enter your New Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
              <Ionicons name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={RFValue(18, height)} color="#d9d9d9" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.ChangePassButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.ChangePassText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmationModal
        visible={isModalVisible}
        message="Are you sure you want to reset your password?"
        onConfirm={() => {
          setModalVisible(false);
          handleResetPassword();
        }}
        onCancel={() => setModalVisible(false)}
        modalStyle={styles.modalContent}
        textStyle={styles.modalText}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "#f6f6f6", 
  },
  backButton: { 
    position: 'absolute', 
    top: hp('6%'), 
    left: wp('7%'), 
    zIndex: 1,
  },
  backIcon: { 
    width: wp('12%'), 
    height: wp('12%'),
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: hp('12%'),
  },
  icon: {
    width: wp('35%'),
    height: hp('10%'),
    resizeMode: "contain",
    marginBottom: hp('2%'),
    marginTop: hp('2%'),
  },
  card: {
    width: wp('85%'),
    borderRadius: wp('8%'),
    paddingVertical: hp('2%'),
    paddingBottom: hp('4%'),
    paddingHorizontal: wp('7%'),
    top: hp('4%'),
    alignItems: "center",
    backgroundColor: 'white',
  },
  title: {
    fontSize: RFValue(22, height),
    fontWeight: "bold",
    color: "black",
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: RFValue(13, height),
    color: "#777",
    marginTop: hp('0.5%'),
    marginBottom: hp('2%'),
    marginHorizontal: wp('2%'),
    textAlign: "center",
  },
  label: {
    width: "100%",
    fontSize: RFValue(14, height),
    color: "black",
    marginTop: hp('1.5%'),
    fontWeight: "bold",
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: wp('2%'),
    marginTop: hp('1%'),
    marginBottom: hp('1.5%'),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: hp('5.5%'),
    backgroundColor: "transparent",
    fontSize: RFValue(15, height),
    color: "#222",
  },
  ChangePassButton: {
    width: "100%",
    backgroundColor: "#fab636",
    paddingVertical: hp('1.5%'),
    borderRadius: wp('10%'),
    marginTop: hp('2.5%'),
    alignItems: "center",
  },
  ChangePassText: {
    color: "#fff",
    fontSize: RFValue(15, height),
    fontWeight: "bold",
  },
  modalContent: {
    width: wp('90%'),
    backgroundColor: '#fff',
    padding: wp('5%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    maxHeight: hp('80%'),
  },
  modalText: {
    fontSize: RFValue(15, height),
    textAlign: 'center',
  },
});

export default ResetPassword;