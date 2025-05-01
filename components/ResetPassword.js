import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const BASE_URL = "http://192.168.0.26:8000";
  const { email } = route.params;

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
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
              <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="gray" />
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
              <Ionicons name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.ChangePassButton} onPress={handleResetPassword}>
            <Text style={styles.ChangePassText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  backButton: { position: 'absolute', top: 50, left: 20 },
  backIcon: { width: 40, height: 40 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  card: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 60,
    paddingVertical: 20,
    paddingBottom: 40,
    paddingHorizontal: 35,
    top: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e1e1e",
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    marginBottom: 15,
    marginHorizontal: 15,
    textAlign: "center",
  },
  label: {
    width: "100%",
    fontSize: 13,
    color: "#1e1e1e",
    marginTop: 10,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  input: {
    flex: 1,
    height: 45,
  },
  ChangePassButton: {
    width: "100%",
    backgroundColor: "#fab636",
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 20,
    alignItems: "center",
  },
  ChangePassText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ResetPassword;