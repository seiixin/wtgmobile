import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';

const PrivateLotDetails = () => {
  const navigation = useNavigation();

  // State to manage visibility of sub-options for each option
  const [isUndergroundOpen, setIsUndergroundOpen] = useState(false);
  const [isAboveGroundOpen, setIsAboveGroundOpen] = useState(false);

  // Toggle functions
  const toggleUnderground = () => setIsUndergroundOpen(!isUndergroundOpen);
  const toggleAboveGround = () => setIsAboveGroundOpen(!isAboveGroundOpen);

  return (
    <ImageBackground 
      source={require('../assets/AdultDetBG.png')} // Using the uploaded background image
      style={styles.background} 
      resizeMode="cover"
    >
        <View style={styles.headsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/BackButton.png')} style={styles.backImage} />
          </TouchableOpacity>
          <Text style={styles.header}>View Details</Text>
        </View>

        {/* Profile Image with Background */}
        <View style={styles.profileImageContainer}>
          <Image source={require("../assets/private.png")} style={styles.image} />
        </View>
        <Text style={styles.headerTitle}>PRIVATE LOTS</Text>

        {/* Pricing Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.headerSubtitle}>New Rate / Price</Text>
          <Text style={styles.dateText}>Effective on March 1, 2023</Text>
        </View>

        {/* Logo on Right Side */}
        <View style={styles.logo}>
          <Image source={require('../assets/walk_to_grave_logo.png')} style={styles.logoImage} />
        </View>

        {/* ScrollView to make options scrollable */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Options */}
          <TouchableOpacity onPress={toggleUnderground}>
            <View style={styles.optionContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.optionTitle}>UNDER GROUND</Text>
              </View>
              <Text style={styles.optionPrice}>₱12,500.00</Text>
            </View>
          </TouchableOpacity>

          {/* Sub-Option: Re-Open (Only visible if the underground option is open) */}
          {isUndergroundOpen && (
            <>
              <View style={styles.subOptionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle1}>Re-Opening</Text>
                  <Text style={styles.checkboxText1}>with New Lapida</Text>
                </View>
                <Text style={styles.optionPrice}>₱6,000.00</Text>
              </View>
              <View style={styles.subOptionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle1}>Additional Fee</Text>
                  <Text style={styles.checkboxText1}>if transferring from other cemeteries</Text>
                </View>
                <Text style={styles.optionPrice}>₱1,000.00</Text>
              </View>
            </>
          )}

          <TouchableOpacity onPress={toggleAboveGround}>
            <View style={styles.optionContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.optionTitle}>ABOVE GROUND</Text>
              </View>
              <Text style={styles.optionPrice}>₱11,500.00</Text>
            </View>
          </TouchableOpacity>

          {/* Sub-Option: Re-Open (Only visible if the above ground option is open) */}
          {isAboveGroundOpen && (
            <>
              <View style={styles.subOptionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle1}>Re-Opening</Text>
                  <Text style={styles.checkboxText1}>with New Lapida</Text>
                </View>
                <Text style={styles.optionPrice}>₱4,000.00</Text>
              </View>
              <View style={styles.subOptionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle1}>Additional Fee</Text>
                  <Text style={styles.checkboxText1}>if transferring from other cemeteries</Text>
                </View>
                <Text style={styles.optionPrice}>₱1,000.00</Text>
              </View>
            </>
          )}

          <View style={styles.optionContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>BONE BOX</Text>
            </View>
            <Text style={styles.optionPrice}>₱4,000.00</Text>
          </View>
        </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 50,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 10,
  },
  backImage: {
    width: 30,
    height: 30,
  },
  header: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: "center",
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2D6A4F",
    textAlign: "center",
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 21,
    color: "#555",
    textAlign: "center",
    fontWeight: 'bold',
    marginTop: 5,
  },
  profileImageContainer: {
    backgroundColor: '#efc2c2',
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 170,
    alignSelf: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 60,
  },
  detailsContainer: {
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginBottom: 10,
    paddingTop: 40,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  logo: {
    alignSelf: 'flex-end',
    marginTop: -55,
    marginRight: 10,
  },
  logoImage: {
    width: 70,
    height: 50,
  },
  optionContainer: {
    marginVertical: 5,
    paddingVertical: 15,
    backgroundColor: "#e9f7f1",
    borderRadius: 10,
    paddingHorizontal: 20,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    minHeight: 70,
  },
  subOptionContainer: {
    marginVertical: 5,
    paddingVertical: 8,
    backgroundColor: "#d1f0d2",
    borderRadius: 10,
    paddingHorizontal: 20,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D6A4F",
  },
  optionTitle1: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2D6A4F",
  },
  optionPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    textAlign: 'right',
  },
  checkboxText1: {
    fontSize: 13,
    color: "#555",
  },
  scrollViewContent: {
    paddingBottom: 20, // Add padding at the bottom to avoid cut-off
  },
});

export default PrivateLotDetails;
