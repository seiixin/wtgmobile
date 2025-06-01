import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Image, Dimensions, StatusBar, Modal, Platform, ScrollView, KeyboardAvoidingView, BackHandler } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); // <-- Add this line
  const navigation = useNavigation();
  const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

  // Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setShowExitModal(true); // or setShowLogoutModal(true) in History.js
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.user && data.user._id) {
        const savedTime = await AsyncStorage.getItem(`verificationTimer_${email}`);
        if (savedTime) {
          const remainingTime = parseInt(savedTime, 10) - Math.floor(Date.now() / 1000);
          if (remainingTime > 0) {
            alert(`Please wait for the countdown to finish before proceeding. Time left: ${formatTime(remainingTime)}`);
            return;
          } else {
            await AsyncStorage.removeItem(`verificationTimer_${email}`);
          }
        }

        await AsyncStorage.setItem("userId", data.user._id);

        const otpResponse = await fetch(`${BASE_URL}/api/otp/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        });

        const otpData = await otpResponse.json();

        if (otpResponse.ok && otpData.success) {
          alert("Login successful. Please verify your account with the OTP sent to your email.");
          const newTime = 60;
          await AsyncStorage.setItem(`verificationTimer_${email}`, (Math.floor(Date.now() / 1000) + newTime).toString());
          navigation.navigate("Verification", { email: data.user.email });
        } else {
          alert("Failed to send OTP. Please try again.");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
      <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" translucent />
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 24,
            alignItems: 'center',
            width: '80%'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
              Are you sure you want to close the application?
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <TouchableOpacity
                style={{ marginRight: 24, padding: 10 }}
                onPress={() => setShowExitModal(false)}
              >
                <Text style={{ color: '#38b6ff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => BackHandler.exitApp()}
              >
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require("../assets/SignInBg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior="padding"
              keyboardVerticalOffset={0}
            >
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: hp('5%') }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
              <Image source={require('../assets/RegisLogo.png')} style={{ width: wp('35%'), height: hp('15%'), marginTop: hp('5%') }} />
                <SignInContent
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  isPasswordVisible={isPasswordVisible}
                  setIsPasswordVisible={setIsPasswordVisible}
                  handleSignIn={handleSignIn}
                  navigation={navigation}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: hp('5%') }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            <Image source={require('../assets/RegisLogo.png')} style={{ width: wp('35%'), height: hp('15%'), marginTop: hp('5%') }} />
              <SignInContent
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isPasswordVisible={isPasswordVisible}
                setIsPasswordVisible={setIsPasswordVisible}
                handleSignIn={handleSignIn}
                navigation={navigation}
              />
            </ScrollView>
          )}
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

const SignInContent = ({
  email,
  setEmail,
  password,
  setPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  handleSignIn,
  navigation,
}) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Welcome back! Please Sign In.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
          <Ionicons
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={wp('6%')}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <TouchableOpacity onPress={() => navigation.navigate("ChangePassFind")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.signInButton}
          onPress={handleSignIn}
        >
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.guestButton}
          onPress={() => navigation.navigate("GuestScreen")}
        >
          <Text style={styles.guestText}>Continue As Guest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Image
            source={require("../assets/google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/twitter.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          <Text style={styles.blackText}>Don't have an account? </Text>
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: wp('80%'),
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: wp('10%'),
    padding: wp('6%'),
    paddingHorizontal: wp('8%'),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: "bold",
    color: "#000",
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: wp('3.5%'),
    color: "#777",
    marginVertical: hp('1%'),
    textAlign: "center",
    fontFamily: 'Inter_400Regular',
  },
  label: {
    width: "100%",
    fontSize: wp('3.5%'),
    color: "#000",
    marginTop: hp('1%'),
    fontWeight: "bold",
    fontFamily: 'Inter_700Bold',
  },
  input: {
    width: "100%",
    height: hp('5%'),
    backgroundColor: "#f5f5f5",
    borderRadius: wp('2%'),
    paddingHorizontal: wp('2%'),
    marginTop: hp('0.5%'),
    fontSize: wp('3.8%'),
    fontFamily: 'Inter_400Regular',
  },
  forgotPassword: {
    color: "#00aa13",
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
    textDecorationLine: "underline",
    fontFamily: 'Inter_400Regular',
  },
  eyeIcon: {
    position: "absolute",
    right: wp('2%'),
    top: hp('1.2%'),
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  signInButton: {
    flex: 1,
    backgroundColor: "#00aa13",
    paddingVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    alignItems: "center",
    marginRight: wp('2%'),
  },
  signInText: {
    color: "#fff",
    fontSize: wp('4%'),
    fontWeight: "bold",
    fontFamily: 'Inter_400Regular',
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp('2%'),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: wp('2%'),
    color: "#777",
    fontSize: wp('3.5%'),
    fontFamily: 'Inter_400Regular',
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp('5%'),
    width: "100%",
    marginBottom: hp('2%'),
  },
  socialIcon: {
    width: wp('12%'),
    height: wp('12%'),
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: hp('2%'),
  },
  guestButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#00aa13",
    paddingVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    alignItems: "center",
  },
  guestText: {
    color: "green",
    fontSize: wp('3.5%'),
    fontFamily: 'Inter_400Regular',
  },
  registerContainer: {
    alignItems: "center",
    marginBottom: hp('3%'),
    marginTop: hp('1.5%'),
  },
  registerText: {
    fontSize: wp('3.8%'),
    color: "#333",
    flexDirection: "row",
    fontFamily: 'Inter_400Regular',
  },
  blackText: {
    color: "#333",
    fontSize: wp('3.8%'),
    fontFamily: 'Inter_400Regular',
  },
  registerLink: {
    color: "#00aa13",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: wp('3.8%'),
    fontFamily: 'Inter_400Regular',
  },
});

export default SignIn;