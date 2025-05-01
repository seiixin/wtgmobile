import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
const ChildAptDetails = () => {
     const navigation = useNavigation();

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
          <Image source={require("../assets/child.png")} style={styles.image} />
        </View>
        <Text style={styles.headerTitle}>CHILD</Text>

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
          <Text style={styles.renewableText}>• NON-RENEWABLE</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
           {/* Options */}
        <View style={styles.optionContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>1YR OLD BELOW</Text>
            <Text style={styles.checkboxText}>with Lapida</Text>
          </View>
          <Text style={styles.optionPrice}>₱3,000.00</Text>
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
    backgroundColor: '#c2dfef', // Background color applied to the image container
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

    paddingTop:40
  },
  detailsContainer1:{ 
    alignItems: 'flex-start',
    paddingLeft: 20,
     
  },
  optionContainer: {
    marginVertical: 5,
    paddingVertical: 20,
    backgroundColor: "#e9f7f1", 
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
  // Styling for the logo section
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

export default ChildAptDetails;
