import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

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
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backText: {
    fontSize: width * 0.05,
    color: "#2D6A4F",
  },
  header: {
    fontSize: width * 0.058,
    fontWeight: "bold",
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
    fontWeight: "bold",
    marginTop: height * 0.006,
  },
  image: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: width * 0.16,
  },
  profileImageContainer: {
    backgroundColor: "#c2dfef",
    width: width * 0.37,
    height: width * 0.37,
    borderRadius: width * 0.185,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.18,
    alignSelf: "center",
  },
  dateText: {
    fontSize: width * 0.035,
    color: "#555",
    textAlign: "center",
  },
  contractText: {
    fontSize: width * 0.035,
    color: "#555",
    textAlign: "center",
    marginTop: height * 0.006,
  },
  renewableText: {
    fontSize: width * 0.035,
    color: "#555",
    textAlign: "center",
    marginBottom: height * 0.018,
  },
  headsContainer: {
    flexDirection: "row",
    alignItems: "center",
    top: height * 0.06,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: width * 0.05,
    top: height * 0.012,
  },
  backImage: {
    width: width * 0.11,
    height: width * 0.11,
  },
  detailsContainer: {
    alignItems: "flex-start",
    paddingLeft: width * 0.05,
    paddingTop: height * 0.05,
  },
  detailsContainer1: {
    alignItems: "flex-start",
    paddingLeft: width * 0.05,
  },
  optionContainer: {
    marginVertical: height * 0.006,
    paddingVertical: height * 0.014,
    backgroundColor: "#e9f7f1",
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.05,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    minHeight: height * 0.09,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
    flex: 1,
  },
  optionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#2D6A4F",
  },
  optionPrice: {
    fontSize: width * 0.04,
    color: "#333",
    marginTop: height * 0.006,
    textAlign: "right",
  },
  checkboxText: {
    fontSize: width * 0.035,
    color: "#555",
  },
  // Styling for the logo section
  logo: {
    alignSelf: "flex-end",
    marginTop: -height * 0.05,
    marginRight: width * 0.025,
  },
  logoImage: {
    width: width * 0.18,
    height: width * 0.13,
    resizeMode: "contain",
  },
  scrollViewContent: {
    paddingBottom: height * 0.04,
  },
});

export default ChildAptDetails;