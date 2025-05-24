import React, { useState } from "react";
import { View, Text, Dimensions, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("window");

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
    top: height * 0.06,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: width * 0.05,
    top: height * 0.012,
  },
  backImage: {
    width: width * 0.11,
    height: width * 0.11,
  },
  header: {
    fontSize: width * 0.058,
    fontWeight: 'bold',
    textAlign: "center",
    marginTop: height * 0.012,
  },
  headerTitle: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    color: "#2D6A4F",
    textAlign: "center",
    marginTop: height * 0.012,
  },
  headerSubtitle: {
    fontSize: width * 0.052,
    color: "#555",
    textAlign: "center",
    fontWeight: 'bold',
    marginTop: height * 0.006,
  },
  profileImageContainer: {
    backgroundColor: '#efc2c2',
    width: width * 0.37,
    height: width * 0.37,
    borderRadius: width * 0.185,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.18,
    alignSelf: "center",
  },
  image: {
    width: width * 0.24,
    height: width * 0.24,
    borderRadius: width * 0.12,
  },
  detailsContainer: {
    alignItems: 'flex-start',
    paddingLeft: width * 0.05,
    marginBottom: height * 0.012,
    paddingTop: height * 0.05,
  },
  dateText: {
    fontSize: width * 0.035,
    color: "#555",
    textAlign: "center",
  },
  logo: {
    alignSelf: 'flex-end',
    marginTop: -height * 0.05,
    marginRight: width * 0.025,
  },
  logoImage: {
    width: width * 0.18,
    height: width * 0.13,
    resizeMode: "contain",
  },
  optionContainer: {
    marginVertical: height * 0.006,
    paddingVertical: height * 0.014,
    backgroundColor: "#e9f7f1",
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.05,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    minHeight: height * 0.09,
  },
  subOptionContainer: {
    marginVertical: height * 0.006,
    paddingVertical: height * 0.01,
    backgroundColor: "#d1f0d2",
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.05,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
    flex: 1,
  },
  optionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#2D6A4F",
  },
  optionTitle1: {
    fontSize: width * 0.038,
    fontWeight: "bold",
    color: "#2D6A4F",
  },
  optionPrice: {
    fontSize: width * 0.04,
    color: "#333",
    marginTop: height * 0.006,
    textAlign: 'right',
  },
  checkboxText1: {
    fontSize: width * 0.032,
    color: "#555",
  },
  scrollViewContent: {
    paddingBottom: height * 0.04,
  },
});

export default PrivateLotDetails;
