import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, StatusBar, Dimensions } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");

const AdultDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const burialService = route.params?.burialService;

  if (!burialService) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No details available.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground 
        source={require('../assets/AdultDetBG.png')}
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
          {burialService.icon ? (
            <Image source={{ uri: burialService.icon }} style={styles.image} />
          ) : (
            <Image source={require("../assets/adult.png")} style={styles.image} />
          )}
        </View>
        <Text style={styles.headerTitle}>{burialService.serviceName || "ADULT"}</Text>

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
          {burialService.contractYears && (
            <Text style={styles.contractText}>• {burialService.contractYears} YEARS CONTRACT</Text>
          )}
          <Text style={styles.renewableText}>
            • {burialService.renewable ? "RENEWABLE" : "NON-RENEWABLE"}
          </Text>
        </View>

        {/* Pricing Layers */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {burialService.pricingLayers && burialService.pricingLayers.length > 0 ? (
            burialService.pricingLayers.map((layer, idx) => (
              <View key={idx} style={styles.optionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>{layer.label}</Text>
                  <Text style={styles.checkboxText}>{layer.description}</Text>
                </View>
                <Text style={styles.optionPrice}>{layer.price}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#555", textAlign: "center" }}>No pricing details available.</Text>
          )}
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp('100%'),
    height: hp('105%'),
    resizeMode: "cover",
  },
  backText: {
    fontSize: wp('5%'),
    color: "#2D6A4F",
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: hp('1.2%'),
    fontFamily: 'Inter_700Bold',
  },
  headerTitle: {
    fontSize: wp('6.5%'),
    fontWeight: "bold",
    color: "#2D6A4F",
    textAlign: "center",
    marginTop: hp('1.2%'),
    fontFamily: 'Inter_700Bold',
  },
  headerSubtitle: {
    fontSize: wp('5.2%'),
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: hp('0.6%'),
    fontFamily: 'Inter_700Bold',
  },
  image: {
    width: wp('32%'),
    height: wp('32%'),
    borderRadius: wp('16%'),
  },
  profileImageContainer: {
    backgroundColor: "#cadf94",
    width: wp('37%'),
    height: wp('37%'),
    borderRadius: wp('18.5%'),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp('18%'),
    alignSelf: "center",
  },
  dateText: {
    fontSize: wp('3.5%'),
    color: "#555",
    textAlign: "center",
    fontFamily: 'Inter_400Regular',
  },
  contractText: {
    fontSize: wp('3.5%'),
    color: "#555",
    textAlign: "center",
    marginTop: hp('0.6%'),
    fontFamily: 'Inter_400Regular',
  },
  renewableText: {
    fontSize: wp('3.5%'),
    color: "#555",
    textAlign: "center",
    marginBottom: hp('1.8%'),
    fontFamily: 'Inter_400Regular',
  },
  headsContainer: {
    flexDirection: "row",
    alignItems: "center",
    top: hp('6%'),
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: wp('5%'),
  },
  backImage: {
    width: wp('11%'),
    height: wp('11%'),
  },
  detailsContainer: {
    alignItems: "flex-start",
    paddingLeft: wp('5%'),
    paddingTop: hp('5%'),
  },
  detailsContainer1: {
    alignItems: "flex-start",
    paddingLeft: wp('5%'),
  },
  optionContainer: {
    marginVertical: hp('0.6%'),
    paddingVertical: hp('1.4%'),
    backgroundColor: "#e9f7f1",
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    minHeight: hp('9%'),
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: wp('5%'),
    flex: 1,
  },
  optionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    color: "#2D6A4F",
    fontFamily: 'Inter_700Bold',
  },
  optionPrice: {
    fontSize: wp('4%'),
    color: "#333",
    marginTop: hp('0.6%'),
    textAlign: "right",
    fontFamily: 'Inter_700Bold',
  },
  checkboxText: {
    fontSize: wp('3.5%'),
    color: "#555",
    fontFamily: 'Inter_400Regular',
  },
  logo: {
    alignSelf: "flex-end",
    marginTop: -hp('5%'),
    marginRight: wp('2.5%'),
  },
  logoImage: {
    width: wp('18%'),
    height: wp('13%'),
    resizeMode: "contain",
  },
  scrollViewContent: {
    paddingBottom: hp('4%'),
  },
});

export default AdultDetails;
