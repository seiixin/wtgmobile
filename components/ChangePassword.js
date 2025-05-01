import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password should be at least 6 characters');
      return;
    }

    try {
      // Retrieve user ID from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Error", "User not found");
        return;
      }

      // Check if current password is correct
      const response = await fetch(`${BASE_URL}/api/users/validate-password/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
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
        navigation.goBack(); // Navigate back to profile
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

        <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
          <Text style={styles.buttonText}>Change password</Text>
        </TouchableOpacity>
      </View>
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
    top: 50,
    left: 35,
    zIndex: 1,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    alignItems: 'center',
    height: "65%",
   
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#fab636',
    padding: 15,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  icon: {
    width: 60,
    height: 60,
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});

export default ChangePassword;
