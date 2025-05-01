import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
const GuestLogin = () => {
    const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton}
      onPress={() => navigation.goBack()}>
        <Image source={require('../assets/BackButton2.png')} style={styles.backButtonImage} />
      </TouchableOpacity>

      
      <View style={styles.logoContainer}>
        <Image source={require('../assets/GuestLoginLogo.png')} style={styles.logo} />
        <Text style={styles.appName}>Walk to Grave</Text>
        <Text style={styles.tagline}>Navigation App</Text>
      </View>

     

      <View style={styles.socialButtonsContainer}>
      <TouchableOpacity 
                       onPress={() => { 
                         navigation.navigate("SignIn");  // Navigate to GuestLogin screen
                       }} 
                       style={styles.button}
                     >
      <Image source={require('../assets/mail.png')} style={styles.icons} />
        <Text style={styles.buttonText}>Sign in with email</Text>
      </TouchableOpacity>
        {/* Google */}
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/google.png')} style={styles.icon} />
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/facebook.png')} style={styles.icon} />
          <Text style={styles.socialButtonText}>Sign in with Facebook</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/apple.png')} style={styles.icon} />
          <Text style={styles.socialButtonText}>Sign in with Apple</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        I have read and acknowledge the{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center', // Ensures content is vertically aligned
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
  },
  backButtonImage: {
    width: '100%',  // Makes the image fill the container width
    height: '100%', // Makes the image fill the container height
    resizeMode: 'contain', // Ensures the image is scaled properly
  },  
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a5242',
  },
  tagline: {
    fontSize: 18,
    color: '#1a5242',
  },
  button: {
    backgroundColor: '#2E8B57',
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10, // Space between buttons
    width: '80%', // Adjust the width for consistency
    flexDirection: 'row', // Align icon and text horizontally
    justifyContent: 'flex-start', // Align icon and text to the start (left)
    alignItems: 'center', // Ensure content is aligned vertically in the center
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    

  },
  socialButtonsContainer: {
    flexDirection: 'column', // Stack buttons vertically
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10, // Space between buttons
    width: '80%', // Adjust the width for consistency
    flexDirection: 'row', // Align icon and text horizontally
    justifyContent: 'flex-start', // Align icon and text to the start (left)
    alignItems: 'center', // Ensure content is aligned vertically in the center
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 50, // Space between icon and text
  },
  icons:{
    width: 25,
    height: 20,
    marginRight: 54,
  },
  socialButtonText: {
    fontSize: 14,
    color: 'black', // Green text color
    fontWeight: 'bold',
  },
  terms: {
    textAlign: 'center',
    fontSize: 12,
    color: 'black',
    marginTop: 20,
  },
  link: {
    color: 'green',
  },
});

export default GuestLogin;
