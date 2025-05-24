import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Image, Dimensions} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back! Please sign in.</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
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
                name={isPasswordVisible ? "eye" : "eye-off"} // Toggle between eye and eye-off
                size={24} 
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
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 80,
    padding: 25,
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
    fontSize: SCREEN_WIDTH * 0.06, // ~24px at 400px width
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.035, // ~14px
    color: "#777",
    marginVertical: 10,
    textAlign: "center",
  },
  label: {
    width: "100%",
    fontSize: SCREEN_WIDTH * 0.035,
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
    fontSize: SCREEN_WIDTH * 0.03, // ~12px
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
    flex: 1,
    backgroundColor: "#00aa13",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  signInText: {
    color: "#fff",
    fontSize: SCREEN_WIDTH * 0.04, // ~16px
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
    fontSize: SCREEN_WIDTH * 0.035,
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
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 20,
  },
  guestButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#00aa13",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  guestText: {
    color: "green",
    fontSize: SCREEN_WIDTH * 0.035,
  },
  registerContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  registerText: {
    fontSize: SCREEN_WIDTH * 0.038,
    color: "#333",
    flexDirection: "row",
  },
  blackText: {
    color: "#333",
    fontSize: SCREEN_WIDTH * 0.038,
  },
  registerLink: {
    color: "#00aa13",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: SCREEN_WIDTH * 0.038,
  },
});


export default SignIn;