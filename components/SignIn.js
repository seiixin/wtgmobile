import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const navigation = useNavigation(); 
  const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

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
      // Step 1: Login the user
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.user && data.user._id) {
        // Step 2: Check if the timer is still active
        const savedTime = await AsyncStorage.getItem(`verificationTimer_${email}`);
        if (savedTime) {
          const remainingTime = parseInt(savedTime, 10) - Math.floor(Date.now() / 1000);
          if (remainingTime > 0) {
            alert(`Please wait for the countdown to finish before proceeding. Time left: ${formatTime(remainingTime)}`);
            return;
          } else {
            // Clear expired timer
            await AsyncStorage.removeItem(`verificationTimer_${email}`);
          }
        }

        // Step 3: Store user ID in AsyncStorage
        await AsyncStorage.setItem("userId", data.user._id);
        console.log("User ID stored in AsyncStorage:", data.user._id);

        // Step 4: Send OTP to the user's email
        const otpResponse = await fetch(`${BASE_URL}/api/otp/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        });

        const otpData = await otpResponse.json();
        console.log("OTP response:", otpData);

        if (otpResponse.ok && otpData.success) {
          alert("Login successful. Please verify your account with the OTP sent to your email.");

          // Step 5: Save the timer in AsyncStorage
          const newTime = 60; // 1 minute
          await AsyncStorage.setItem(`verificationTimer_${email}`, (Math.floor(Date.now() / 1000) + newTime).toString());

          // Step 6: Navigate to the Verification screen
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
    <ImageBackground 
      source={require("../assets/SignInBg.jpg")} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Hello! Welcome back, you’ve been missed</Text>

          <Text style={styles.label}>Email *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password *</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible} // Toggle between visible and hidden password
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
              <Ionicons 
                name={isPasswordVisible ? "eye" : "eye-off"} // Toggle between eye and eye-off
                size={24} 
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("ChangePassFind")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          
            <TouchableOpacity style={styles.guestButton} onPress={() => navigation.navigate("GuestScreen")}>
              <Text style={styles.guestText}>Continue As Guest</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or sign in with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity>
              <Image source={require("../assets/apple.png")} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../assets/google.png")} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../assets/facebook.png")} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.registerText}>
            <Text style={styles.blackText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.Text}>Register</Text>
            </TouchableOpacity>
          </Text>
    </ImageBackground>
  );
};

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
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 60,
    padding: 20,
    paddingHorizontal: 30,
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
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginVertical: 10,
    textAlign: "center",
  },
  label: {
    width: "100%",
    fontSize: 14,
    color: "#000",
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  forgotPassword: {
    color: "#00aa13",
    left: 70,
    fontSize: 12,
    marginTop: 5,
    textDecorationLine: "underline",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#00aa13",
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 20,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    color: "#777",
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    width: "100%",
    marginBottom: 20,
  },
  socialIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  registerText: {
    position: "absolute",
    fontSize: 14,
    left: 100,
    bottom: 130,
  },
  blackText: {
    color: "white",
  },
  Text: {
    color: "#fde245",
    fontWeight: "bold",
    alignItems: "center",
    top: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signInButton: {
    flex: 1,
    backgroundColor: "#00aa13",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  guestButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#00aa13",
    paddingVertical: 8,
    color: 'green',
    borderRadius: 10,
    alignItems: "center",
  },
  guestText: {
    color: 'green',
  }
});

export default SignIn;