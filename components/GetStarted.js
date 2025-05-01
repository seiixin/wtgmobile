import React from 'react';
import { View, ImageBackground, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
    top: 90,
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 15,
    top: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '900', // ✅ Extra bold for emphasis
    textAlign: 'center',
    color: '#12894f',
  },
description: {
    fontSize: 13,
    color: '#333',
    marginBottom: 20,
    marginHorizontal: 10,
    textAlign: 'center',
    lineHeight: 21, // ✅ Adjusted line height to reduce gap
  },


  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    top: 80,
  },
  tourButton: {
    width: '60%',
    backgroundColor: '#00aa13',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  tourButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  signInLink: {
    color: '#1b5343',
    fontWeight: 'bold',
    top: 4,
  },
});

export default GetStarted;
