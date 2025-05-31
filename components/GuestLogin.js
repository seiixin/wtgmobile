import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const GuestLogin = () => {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/BackButton2.png')} style={styles.backButtonImage} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={require('../assets/GuestLoginLogo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>Walk to Grave</Text>
          <Text style={styles.tagline}>Navigation App</Text>
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            onPress={() => { navigation.navigate("SignIn"); }}
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
          I have read and acknowledge the Walk to Grave{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: hp('5%'),
    left: wp('5%'),
    width: wp('10%'),
    height: wp('10%'),
    zIndex: 10,
  },
  backButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp('5%'),
    marginTop: hp('7%'),
  },
  logo: {
    width: wp('43%'),
    height: wp('32%'),

  },
  appName: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#1a5242',
    fontFamily: 'Inter_700Bold',
  },
  tagline: {
    fontSize: wp('4%'),
    color: '#1a5242',
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#2E8B57',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: hp('1.2%'),
    width: wp('80%'),
    flexDirection: 'row',
    justifyContent: 'center', // Center the text horizontally
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  buttonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center', // Center the text
    flex: 1, // Take available space for centering
  },
  socialButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp('2.5%'),
  },
  socialButton: {
    backgroundColor: '#fff',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: hp('1.2%'),
    width: wp('80%'),
    flexDirection: 'row',
    justifyContent: 'center', // Center the text horizontally
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  icon: {
    width: wp('7%'),
    height: wp('7%'),
    resizeMode: 'contain',
  },
  icons: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  socialButtonText: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center', // Center the text
    flex: 1, // Take available space for centering
  },
  terms: {
    textAlign: 'center',
    fontSize: wp('3.2%'),
    color: 'black',
    marginTop: hp('2%'),
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: wp('10%'),
  },
  link: {
    color: 'green',
    textDecorationLine: 'underline',
    fontFamily: 'Inter_700Bold',
  },
});

export default GuestLogin;
