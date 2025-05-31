import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, StatusBar, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");

const PrivateLotDetails = () => {
  const navigation = useNavigation();

  const [isUndergroundOpen, setIsUndergroundOpen] = useState(false);
  const [isAboveGroundOpen, setIsAboveGroundOpen] = useState(false);

  const toggleUnderground = () => setIsUndergroundOpen(!isUndergroundOpen);
  const toggleAboveGround = () => setIsAboveGroundOpen(!isAboveGroundOpen);

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
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp('100%'),
    height: hp('105%'),
    resizeMode: 'cover',
  },
  headsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: hp('6%'),
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: wp('5%'),
  },
  backImage: {
    width: wp('11%'),
    height: wp('11%'),
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginTop: hp('0.6%'),
    fontFamily: 'Inter_700Bold',
  },
  profileImageContainer: {
    backgroundColor: '#efc2c2',
    width: wp('37%'),
    height: wp('37%'),
    borderRadius: wp('18.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('18%'),
    alignSelf: "center",
  },
  image: {
    width: wp('24%'),
    height: wp('24%'),
    borderRadius: wp('12%'),
  },
  detailsContainer: {
    alignItems: 'flex-start',
    paddingLeft: wp('5%'),
    marginBottom: hp('1.2%'),
    paddingTop: hp('5%'),
  },
  dateText: {
    fontSize: wp('3.5%'),
    color: "#555",
    textAlign: "center",
    fontFamily: 'Inter_400Regular',
  },
  logo: {
    alignSelf: 'flex-end',
    marginTop: -hp('5%'),
    marginRight: wp('2.5%'),
  },
  logoImage: {
    width: wp('18%'),
    height: wp('13%'),
    resizeMode: "contain",
  },
  optionContainer: {
    marginVertical: hp('0.6%'),
    paddingVertical: hp('1.4%'),
    backgroundColor: "#e9f7f1",
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    minHeight: hp('9%'),
  },
  subOptionContainer: {
    marginVertical: hp('0.6%'),
    paddingVertical: hp('1%'),
    backgroundColor: "#d1f0d2",
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    flex: 1,
  },
  optionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    color: "#2D6A4F",
    fontFamily: 'Inter_700Bold',
  },
  optionTitle1: {
    fontSize: wp('3.8%'),
    fontWeight: "bold",
    color: "#2D6A4F",
    fontFamily: 'Inter_700Bold',
  },
  optionPrice: {
    fontSize: wp('4%'),
    color: "#333",
    marginTop: hp('0.6%'),
    textAlign: 'right',
    fontFamily: 'Inter_700Bold',
  },
  checkboxText1: {
    fontSize: wp('3.2%'),
    color: "#555",
    fontFamily: 'Inter_400Regular',
  },
  scrollViewContent: {
    paddingBottom: hp('4%'),
  },
});

export default PrivateLotDetails;
