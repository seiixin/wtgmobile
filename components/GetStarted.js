import React from 'react';
import { View, ImageBackground, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const GetStarted = () => {
    const navigation = useNavigation(); // Add this line to use navigation

  return (
    <ImageBackground source={require('../assets/GetStarted.png')} style={styles.background}>
      {/* Main Content Container */}

    <View style={styles.container1}>
        <Text style={styles.title}>We’ve been there...</Text>
        <View style={styles.container}>
            <Text style={styles.description}>
            Cemetery events are not easy. The encounter with loss, and pain are tough and overwhelming. As we grow older, memorials, funerals, and visiting graves become part of our routine. And then comes a moment like this - confusing and frustrating - and we ask ourselves, “where are they buried? How do I get to their grave? I’ve been here already, why can’t I find it?” We wander around the cemetery over and over again inspecting grave names.
            </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.tourButton} onPress={() => navigation.navigate('IntroSlides')}>
            <Text style={styles.tourButtonText}>Let’s Take a Tour</Text>
            </TouchableOpacity>
            
            <Text style={styles.signInText}>
                Already have an account? 
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.signInLink}> Sign in</Text>
                </TouchableOpacity>
            </Text>
            
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
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container1: {
    marginTop: height * 0.2,
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: width * 0.09,
    paddingVertical: height * 0.02,
    marginTop: height * 0.01,
  },
  title: {
    fontSize: width * 0.08, // Responsive font size
    fontWeight: '900',
    textAlign: 'center',
    color: '#12894f',
    marginBottom: height * 0.01,
  },
  description: {
    fontSize: width * 0.035,
    color: '#333',
    marginBottom: height * 0.025,
    marginHorizontal: width * 0.02,
    textAlign: 'center',
    lineHeight: width * 0.05,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.025,
    marginTop: height * 0.09,
  },
  tourButton: {
    width: width * 0.6,
    backgroundColor: '#00aa13',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.08,
    alignItems: 'center',
    marginBottom: height * 0.012,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tourButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  signInText: {
    textAlign: 'center',
    fontSize: width * 0.037,
    color: '#555',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  signInLink: {
    color: '#1b5343',
    fontWeight: 'bold',
    marginLeft: 2,
    fontSize: width * 0.037,
    textDecorationLine: 'underline',
    top: 2,
  },
});

export default GetStarted;
