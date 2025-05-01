import React, {useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
const BoneAptDetails = () => {
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
          <Image source={require("../assets/bones.png")} style={styles.image} />
        </View>
        <Text style={styles.headerTitle}>BONE APARTMENT</Text>

        {/* Pricing Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.headerSubtitle}>New Rate / Price</Text>
          <Text style={styles.dateText}>Effective on March 1, 2023</Text>
        </View>

        {/* Logo on Right Side */}
        <View style={styles.logo}>
          <Image source={require('../assets/walk_to_grave_logo.png')} style={styles.logoImage} />
        </View>

        <View style={styles.detailsContainer1}>
          <Text style={styles.contractText}>• 4 YEARS CONTRACT</Text>
          <Text style={styles.renewableText}>• RENEWABLE</Text>
        </View>

        {/* ScrollView to make options scrollable */}
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  {/* Options */}
                  <TouchableOpacity onPress={toggleUnderground}>
                    <View style={styles.optionContainer}>
                      <View style={styles.textContainer}>
                        <Text style={styles.optionTitle}>2 BONES ONLY</Text>
                      </View>
                      <Text style={styles.optionPrice}>₱4,000.00</Text>
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
                        <Text style={styles.optionPrice}>₱3,000.00</Text>
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
            <Text style={styles.optionTitle}>4 BONES ONLY</Text>
          </View>
          <Text style={styles.optionPrice}>₱8,000.00</Text>
        </View>

        <View style={styles.optionContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>6 BONES ONLY</Text>
          </View>
          <Text style={styles.optionPrice}>₱10,000.00</Text>
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
  
  backText: {
    fontSize: 20,
    color: "#2D6A4F",
  },
  header:{
    fontSize:23,
    fontWeight: 'bold',
    textAlign: "center",
    marginTop:10
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2D6A4F",
    textAlign: "center",
    marginTop:10
  },
  headerSubtitle: {
    fontSize: 21,
    color: "#555",
    textAlign: "center",
    fontWeight:'bold',
    marginTop: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImageContainer: {
    backgroundColor: '#efe6c2', // Background color applied to the image container
    width: 140,  // Slightly larger than the image
    height: 140, // Same height as width to keep it circular
    borderRadius: 70, // Ensures it’s a circle
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 170,
    alignSelf: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  contractText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  renewableText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  headsContainer: {
    flexDirection: 'row',  // Aligns items horizontally
    alignItems: 'center',  // Centers the items vertically in the container
    top:50,
    justifyContent: 'center',  // Centers the "View Details" text
  },
  backButton: {
    position: 'absolute',
    left: 20, 
    top:10,
  },
  backImage: {
    width: 30, // Set the size of the back button
    height: 30,
  },
  detailsContainer:{ 
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginBottom: 10,
    paddingTop:40
  },
  detailsContainer1:{ 
    alignItems: 'flex-start',
    paddingLeft: 20,
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
    backgroundColor: "#d1f0d2", // Lighter background for sub-options
    borderRadius: 10,
    paddingHorizontal: 20,
    width: '90%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    alignSelf: 'center', 
    fontSize: 1
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
  checkboxText: {
    fontSize: 14,
    color: "#555",
  },
  checkboxText1: {
    fontSize: 13,
    color: "#555",
  },
  logo: {
    alignSelf: 'flex-end', // Align the logo to the right
    marginTop: -40, // Adjust the margin to fit the layout better
    marginRight: 10
  },
  logoImage: {
    width: 70,  // Adjust the size of the logo
    height: 50,
  },
});

export default BoneAptDetails;
