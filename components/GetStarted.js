import React from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const GetStarted = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground source={require('../assets/GetStarted.png')} style={styles.background} resizeMode="cover">
        <View style={styles.container1}>
          <Text style={styles.title}>We’ve been there...</Text>
          <View style={styles.container}>
            <Text style={styles.description}>
              Cemetery events are not easy. The encounter with loss, and pain are tough and overwhelming. As we grow older, memorials, funerals, and visiting graves become part of our routine. And then comes a moment like this - confusing and frustrating - and we ask ourselves, “where are they buried? How do I get to their grave? I’ve been here already, why can’t I find it?” We wander around the cemetery over and over again inspecting grave names.
            </Text>
          </View>

          <Image
            source={require('../assets/GsLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.tourButton} onPress={() => navigation.navigate('IntroSlides')}>
              <Text style={styles.tourButtonText}>Let’s Take a Tour</Text>
            </TouchableOpacity>

            <Text style={styles.signInText}>
              Already have an account?
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp('100%'),
    height: hp('105%'),
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container1: {
    marginTop: hp('30%'),
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: wp('9%'),
    paddingVertical: hp('1%'),
    marginTop: hp('1%'),
  },
  logo: {
    width: wp('15%'),
    height: hp('8%'),
    alignSelf: 'center',
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: '900',
    textAlign: 'center',
    color: '#12894f',
    marginBottom: hp('1%'),
    fontFamily: 'Inter_700Bold',
  },
  description: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginHorizontal: wp('2%'),
    textAlign: 'center',
    lineHeight: wp('5%'),
    fontFamily: 'Inter_400Regular',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: hp('2.5%'),

  },
  tourButton: {
    width: wp('60%'),
    backgroundColor: '#00aa13',
    paddingVertical: hp('2%'),
    borderRadius: wp('8%'),
    alignItems: 'center',
    marginBottom: hp('1.2%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tourButtonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    fontFamily: 'Inter_700Bold',
  },
  signInText: {
    textAlign: 'center',
    fontSize: wp('3.7%'),
    color: '#555',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    fontFamily: 'Inter_400Regular',
  },
  signInLink: {
    color: '#1b5343',
    fontWeight: 'bold',
    marginLeft: 2,
    fontSize: wp('3.7%'),
    textDecorationLine: 'underline',
    top: 2,
    fontFamily: 'Inter_700Bold',
  },
});

export default GetStarted;
