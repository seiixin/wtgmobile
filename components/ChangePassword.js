import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../components/modals/ConfirmationModal'; // Import the reusable modal
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false); // State for confirmation modal
  const [email, setEmail] = useState(''); // State for email

  const navigation = useNavigation();
  const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    // Password validation logic from Register.js
    const validatePassword = (password) =>
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@$!%*?&#]/.test(password);

    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
      );
      return;
    }

    try {
      // Get the logged-in user's ID from AsyncStorage (set during login)
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      // Validate current password using /api/users/validate-password/:id
      const response = await fetch(`${BASE_URL}/api/users/validate-password/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        Alert.alert('Error', data.message || 'Invalid current password');
        return;
      }

      // If current password is valid, update it with the new one
      const updateResponse = await fetch(`${BASE_URL}/api/users/update-password/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const updateData = await updateResponse.json();
      if (updateResponse.ok) {
        Alert.alert('Success', 'Password has been changed successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', updateData.message || 'Failed to change password');
      }

    } catch (error) {
      console.error('Password Change Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/ChangePasswordBG.png")} 
      style={styles.background}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require("../assets/BackButton.png")} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Image source={require("../assets/ChangePassIcon.png")} style={styles.icon} />
        <Text style={styles.header}>Reset password</Text>
        <Text style={styles.subHeader}>Enter your current and new password below</Text>

        {/* Current Password */}
        <Text style={styles.label}>Current Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            secureTextEntry={!isCurrentPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons 
              name={isCurrentPasswordVisible ? "eye" : "eye-off"} 
              size={24} 
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <Text style={styles.label}>New Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            secureTextEntry={!isNewPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons 
              name={isNewPasswordVisible ? "eye" : "eye-off"} 
              size={24} 
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Re-enter Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter password"
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons 
              name={isConfirmPasswordVisible ? "eye" : "eye-off"} 
              size={24} 
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setConfirmationVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Change password</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={isConfirmationVisible}
        message="Are you sure you want to change your password?"
        onConfirm={() => {
          setConfirmationVisible(false); // Close the modal
          handleChangePassword(); // Proceed with password change
        }}
        onCancel={() => setConfirmationVisible(false)} // Close the modal
      />
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: wp('85%'),
    padding: wp('5%'),
    backgroundColor: 'white',
    borderRadius: wp('8%'),
    alignItems: 'center',
    height: hp('72%'), // Responsive height
  },
  header: {
    fontSize: RFValue(22, height),
    fontWeight: 'bold',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  subHeader: {
    fontSize: RFValue(15, height),
    color: 'gray',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: hp('6%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingLeft: wp('2%'),
    marginBottom: hp('1.2%'),
    fontSize: RFValue(15, height),
  },
  button: {
    backgroundColor: '#fab636',
    padding: hp('1.8%'),
    borderRadius: wp('10%'),
    width: '100%',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  buttonText: {
    color: 'white',
    fontSize: RFValue(15, height),
    fontWeight: 'bold',
  },
  icon: {
    width: wp('18%'),
    height: wp('18%'),
    marginTop: hp('2%'),
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: hp('1.5%'),
    fontSize: RFValue(14, height),
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: wp('2%'),
    top: hp('1.2%'),
  },
  // Example modal style if you use a custom modal
  modalContent: {
    width: wp('90%'),
    backgroundColor: '#fff',
    padding: wp('5%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    maxHeight: hp('80%'),
  },
});

export default ChangePassword;
