import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, TouchableWithoutFeedback, Alert, ImageBackground, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get('window');

const GraveInformation = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { grave, origin } = route.params || {}; // Get origin
    const [isCandleLit, setIsCandleLit] = useState(false);
    const [hasCandleBeenLit, setHasCandleBeenLit] = useState(false);
    const [candleCount, setCandleCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const modalContentRef = useRef(null); // Reference to the modal content

    const saveModalAsImage = async () => {
        try {
            const uri = await modalContentRef.current.capture(); // Capture the modal content
            const permission = await MediaLibrary.requestPermissionsAsync(); // Request media library permissions

            if (permission.granted) {
                await MediaLibrary.createAssetAsync(uri); // Save the image to the gallery
                Alert.alert('Success', 'The image has been saved to your gallery.');
            } else {
                Alert.alert('Permission Denied', 'Unable to save the image without permission.');
            }
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Error', 'An error occurred while saving the image.');
        }
    };

    const handleLightCandle = async () => {
        try {
            // Retrieve existing candle data from AsyncStorage
            const existingCandleData = await AsyncStorage.getItem('candleData');
            const candleData = existingCandleData ? JSON.parse(existingCandleData) : {};

            // Check if the grave already has candle data
            const graveCandleData = candleData[grave._id] || { lastLit: null, count: 0 };

            // Get the current timestamp
            const now = new Date().getTime();

            // Check if the user can light a candle (1-day interval)
            if (graveCandleData.lastLit && now - graveCandleData.lastLit < 24 * 60 * 60 * 1000) {
              Alert.alert('Candle Already Lit', 'You can light another candle after 24 hours.');
              return;
            }

            // Update the candle data for the grave
            const updatedCandleData = {
                ...candleData,
                [grave._id]: {
                    lastLit: now,
                    count: graveCandleData.count + 1, // Increment the candle count
                },
            };

            // Save the updated candle data to AsyncStorage
            await AsyncStorage.setItem('candleData', JSON.stringify(updatedCandleData));

            // Update the local state
            setHasCandleBeenLit(true);
            setCandleCount(graveCandleData.count + 1); // Update the counter in the UI

            // Show the memorial candle greeting
            setIsCandleLit(true); // This will open the modal
        } catch (error) {
            console.error('Error lighting candle:', error);
        }
    };

    const handleBookmark = async () => {
        try {
            const existingBookmarks = await AsyncStorage.getItem('bookmarks');
            let bookmarks = existingBookmarks ? JSON.parse(existingBookmarks) : [];

            if (isBookmarked) {
                // Remove from bookmarks
                bookmarks = bookmarks.filter((item) => item._id !== grave._id);
                await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                setIsBookmarked(false);
                Alert.alert('Removed', 'This grave has been removed from your bookmarks.');
            } else {
                // Add to bookmarks
                if (!bookmarks.some((item) => item._id === grave._id)) {
                    bookmarks.push(grave);
                    await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                    setIsBookmarked(true);
                    Alert.alert('Bookmarked', 'This grave has been added to your bookmarks.');
                }
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    useEffect(() => {
        const loadCandleData = async () => {
            try {
                const existingCandleData = await AsyncStorage.getItem('candleData');
                const candleData = existingCandleData ? JSON.parse(existingCandleData) : {};

                // Get the candle data for the current grave
                const graveCandleData = candleData[grave._id] || { lastLit: null, count: 0 };

                // Update the local state
                setHasCandleBeenLit(graveCandleData.lastLit && new Date().getTime() - graveCandleData.lastLit < 24 * 60 * 60 * 1000);
                setCandleCount(graveCandleData.count);
            } catch (error) {
                console.error('Error loading candle data:', error);
            }
        };

        const checkBookmark = async () => {
            try {
                const existingBookmarks = await AsyncStorage.getItem('bookmarks');
                const bookmarks = existingBookmarks ? JSON.parse(existingBookmarks) : [];
                setIsBookmarked(bookmarks.some((item) => item._id === grave._id));
            } catch (error) {
                console.error('Error checking bookmark:', error);
            }
        };

        loadCandleData();
        checkBookmark();
    }, [grave._id]);

    useEffect(() => {
      if (hasCandleBeenLit) {
        const updateTimer = () => {
          AsyncStorage.getItem('candleData').then(data => {
            const candleData = data ? JSON.parse(data) : {};
            const graveCandleData = candleData[grave._id] || { lastLit: null, count: 0 };
            if (graveCandleData.lastLit) {
              const now = Date.now();
              const nextAvailable = graveCandleData.lastLit + 24 * 60 * 60 * 1000;
              const diff = nextAvailable - now;
              setTimeLeft(diff > 0 ? diff : 0);
            }
          });
        };
        updateTimer();
        timerRef.current = setInterval(updateTimer, 1000);
        return () => clearInterval(timerRef.current);
      } else {
        setTimeLeft(0);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, [hasCandleBeenLit, grave._id]);

    const formatTime = (ms) => {
      if (ms <= 0) return "00:00:00";
      const totalSeconds = Math.floor(ms / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <View style={{ flex: 1 }}>
                {/* Fixed Buttons */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (origin) {
                            navigation.navigate(origin);
                        } else {
                            navigation.goBack();
                        }
                    }}
                >
                    <Ionicons name="arrow-back" size={wp('6.5%')} color="white" />
                </TouchableOpacity>
                <View style={styles.topRightButtons}>
                    <TouchableOpacity style={styles.shareButton}>
                        <Ionicons name="share-social-outline" size={wp('6.5%')} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
                        <Ionicons
                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                            size={wp('6.5%')}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Header Image */}
                    <View style={styles.headerContainer}>
                        <Image
                            source={grave.image ? { uri: grave.image } : require('../assets/blankDP.jpg')}
                            style={styles.headerImage}
                        />
                    </View>

                    {/* Profile Section */}
                    <View style={styles.profileContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={grave.image ? { uri: grave.image } : require('../assets/blankDP.jpg')}
                                style={styles.profileImage}
                            />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.name}>{grave.firstName}{grave.nickname ? ` '${grave.nickname}'` : ''} {grave.lastName}</Text>
                            <Text style={styles.dates}>
                                Born on {grave.dateOfBirth ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(grave.dateOfBirth)) : 'N/A'}
                            </Text>
                            <Text style={styles.dates}>
                                Buried {grave.burial ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(grave.burial)) : 'N/A'}
                            </Text>
                            <Text style={styles.location}>{grave.phase}, Apartment {grave.aptNo}</Text>
                        </View>
                        <ImageBackground
                            source={
                                hasCandleBeenLit
                                    ? require("../assets/CandleLighted.png")
                                    : require("../assets/CandleLight.png")
                            }
                            style={styles.profileBottomLeftImage}
                        >
                            <View style={styles.candleCountContainer}>
                                <Text style={styles.candleCountText}>{candleCount}</Text>
                            </View>
                        </ImageBackground>
                        <Image source={require("../assets/WtG.png")} style={styles.profileBottomRightImage} />
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        {grave.description || 'No description available.'}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
  <TouchableOpacity
    onPress={handleLightCandle}
    style={[
      styles.lightCandleButton,
      hasCandleBeenLit && timeLeft > 0 && styles.noBackground
    ]}
    disabled={hasCandleBeenLit && timeLeft > 0}
    activeOpacity={hasCandleBeenLit && timeLeft > 0 ? 1 : 0.7}
  >
    {!hasCandleBeenLit ? (
    // Plain orange background, no gradient
    <View style={styles.lightCandleGradient}>
      <View style={styles.buttonContent}>
        <Image source={require("../assets/Candle1.png")} style={styles.CandleImage} />
        <Text style={styles.buttonText}>  Light a candle</Text>
      </View>
    </View>
  ) : (
    // Gradient background for lit/timer states
    <LinearGradient
      colors={["#000000", "#c89116"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.lightCandleGradient}
    >
      <View style={styles.buttonContent}>
        <Image source={require("../assets/Candle2.png")} style={styles.CandleImage} />
        {hasCandleBeenLit && timeLeft > 0 ? (
          <Text style={styles.buttonText3}>  Light again in {formatTime(timeLeft)}</Text>
        ) : (
          <Text style={styles.buttonText}>  Candle was Lit</Text>
        )}
      </View>
    </LinearGradient>
  )}
</TouchableOpacity>

  <TouchableOpacity
    style={styles.scanMemoryButton}
    onPress={() => navigation.navigate('QRScanner')}
  >
    <LinearGradient
      colors={["#ffef5d", "#7ed957"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.scanMemoryGradient}
    >
      <View style={styles.buttonContent}>
        <Image source={require("../assets/scanning.png")} style={styles.ScanningImage} />
        <Text style={styles.buttonText2}> Scan memory</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
</View>

                    {/* Bottom Buttons */}
                    <View style={styles.bottomContainer}>
                        <View style={styles.bottomButtons}>
                            {/* Update Details Button */}
                            <TouchableOpacity style={styles.bottomButton}>
                                <Image source={require("../assets/update.png")} style={styles.updateImage} />
                                <Text style={styles.bottomButtonText}>Update Details</Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Prayers Button */}
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={() => navigation.navigate("Prayers")}
                            >
                                <Image source={require("../assets/prayer.png")} style={styles.prayerImage} />
                                <Text style={styles.bottomButtonText}>Prayers</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bottom Container with Touchable Area */}
                        <TouchableOpacity
                          style={styles.bottomContainer2}
                          activeOpacity={0.8}
                          onPress={() => navigation.navigate('Map', { grave })} // Pass grave as param
                        >
                          <View style={styles.navigateButtonContainer}>
                            <Text style={styles.navigateButtonText}>
                              <Ionicons name="location" size={24} color="white" />
                            </Text>
                            <Text style={styles.navigateButtonText}>Navigate to Grave</Text>
                          </View>
                        </TouchableOpacity>
                    </View>

                    {/* Hidden ViewShot for Modal Content */}
                    <View style={{ position: 'absolute', left: -9999, top: -9999 }}>
  <ViewShot ref={modalContentRef} options={{ format: 'png', quality: 0.9 }}>
    <ImageBackground
      source={grave.image ? { uri: grave.image } : require('../assets/blankDP.jpg')}
      style={{
        width: 350,
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden',
      }}
      imageStyle={{ resizeMode: 'cover', transform: [{ scale: 1.05 }] }}
    >
      <View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 20,
      }} />
      <View style={{ zIndex: 2, alignItems: 'center', width: '100%', padding: 20, paddingHorizontal: 50 }}>
        <Image source={require('../assets/WtG2.png')} style={styles.wtg2logo} />
        <Text style={[styles.memorialHeader, { fontSize: 32, marginBottom: 5 }]}>Memorial Candle</Text>
        <Text style={[styles.memorialSubtext, { fontSize: 16, marginBottom: 15 }]}>Thank you for taking part in the memory.</Text>
        <View style={[styles.imageBorderOuter, { width: 80, height: 80, borderRadius: 40 }]}>
        <View style={[styles.imageBorderInner, { width: 75, height: 75, borderRadius: 37.5 }]}>
            <Image
              source={grave.image ? { uri: grave.image } : require('../assets/blankDP.jpg')}
              style={[styles.modalProfileImage, { width: 70, height: 70, borderRadius: 35 }]}
            />
          </View>
        </View>
        <Text style={styles.candleCount}>
          Together we lit {candleCount} candle{candleCount > 1 ? 's' : ''} for{' '}
          <Text style={styles.boldText}>{grave.firstName} {grave.lastName}{grave.nickname ? `, also known as '${grave.nickname}'` : ''}.</Text>
        </Text>
        <Text style={styles.encourageText}>
          Help light more candles for {grave.firstName} and share with family and friends.
        </Text>
      </View>
    </ImageBackground>
  </ViewShot>
</View>

                    {/* Modal */}
                    <Modal
    transparent={true}
    visible={isCandleLit}
    animationType="fade"
    onRequestClose={() => setIsCandleLit(false)}
>
    {/* Add this StatusBar for modal */}
    <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" translucent={true} />
    <TouchableWithoutFeedback onPress={() => setIsCandleLit(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Image source={require('../assets/WtG2.png')} style={styles.wtg2logo} />
                <Text style={styles.memorialHeader}>Memorial Candle</Text>
                <Text style={styles.memorialSubtext}>Thank you for taking part in the memory.</Text>
                <View style={styles.imageBorderOuter}>
                  <View style={styles.imageBorderInner}>
                    <Image
                      source={grave.image ? { uri: grave.image } : require('../assets/blankDP.jpg')}
                      style={styles.modalProfileImage}
                    />
                  </View>
                </View>
                <Text style={styles.candleCount}>
                  Together we lit {candleCount} candle{candleCount > 1 ? 's' : ''} for{' '}
                  <Text style={styles.boldText}>{grave.firstName} {grave.lastName} {grave.nickname ? `, also known as '${grave.nickname}'` : ''}.</Text>.
                </Text>
                <Text style={styles.encourageText}>
                  Help light more candles for {grave.firstName} and share with family and friends.
                </Text>
            </View>
            {/* Social Media and Save Buttons */}
            <View style={styles.socialIcons}>
                <TouchableOpacity onPress={saveModalAsImage}>
                    <Ionicons name="download-outline" size={55} color="white" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../assets/fb2.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../assets/whatsapp.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../assets/twitter.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    </TouchableWithoutFeedback>
</Modal>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff",  justifyContent: 'space-between', minHeight: height,},
  headerContainer: { position: "relative" },
  headerImage: { width: "100%", height: hp('45%') },

  backButton: {
    position: 'absolute',
    top: hp('5%'),
    left: wp('6%'),
    backgroundColor: 'rgb(252, 189, 33)',
    padding: wp('2.5%'),
    borderRadius: wp('12%'),
    zIndex: 10,
  },
  topRightButtons: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('5%'),
    flexDirection: 'row',
    zIndex: 10,
  },
  shareButton: {
    backgroundColor: 'rgba(54, 38, 38, 0.5)',
    padding: wp('2.5%'),
    borderRadius: wp('12%'),
    marginRight: wp('2.5%'),
  },
  bookmarkButton: {
    backgroundColor: 'rgba(54, 38, 38, 0.5)',
    padding: wp('2.5%'),
    borderRadius: wp('12%'),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp('5%'),
    position: "relative"
  },
  profileImageContainer: {
    top: -hp('8%'),
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    borderWidth: 2,
    borderColor: "#94b143",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: wp('23%'),
    height: wp('23%'),
    borderRadius: wp('11.5%'),
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: { flex: 1 },
  profileBottomLeftImage: {
    position: "absolute",
    bottom: hp('1%'),
    left: wp('8%'),
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('3%'),
  },
  profileBottomRightImage: {
    position: "absolute",
    bottom: hp('1%'),
    right: wp('5%'),
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('3%'),
  },
  name: { fontSize: RFValue(20, height), fontWeight: "bold", marginBottom: hp('0.5%') },
  dates: { fontSize: RFValue(13, height), color: "gray" },
  location: { fontSize: RFValue(11, height), color: "gray", marginTop: hp('0.5%') },
  description: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('1.2%'),
    textAlign: "center",
    marginHorizontal: wp('15%'),
    height: hp('13%'),
    lineHeight: RFValue(18, height),
    fontSize: RFValue(13, height),
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp('1.2%'),
    top: hp('4%'),
  },
  lightCandleButton: {
    borderRadius: wp('2.5%'),
    overflow: "hidden",
    backgroundColor: "orange",
    width: wp('38%'),
    height: hp('6.5%'),
    alignItems: "center",
    justifyContent: "center",
  },
  noBackground: { backgroundColor: "transparent" },
  lightCandleGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp('2.5%'),
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp('5%'),
  },
  CandleImage: {
    width: wp('4.5%'),
    height: hp('3.5%'),
    resizeMode: "contain"
  },
  ScanningImage: {
    width: wp('6%'),
    height: hp('3.5%'),
    resizeMode: "contain"
  },
  scanMemoryButton: {
    borderRadius: wp('2.5%'),
    overflow: "hidden",
    width: wp('38%'),
    height: hp('6.5%'),
    alignItems: "center",
    justifyContent: "center",
  },
  scanMemoryGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp('2.5%'),
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold",
    fontSize: RFValue(16, height),
    textAlign: "center", // Add this line
  },
  buttonText3: { 
    color: "#fad02c", 
    fontWeight: "bold", 
    fontSize: RFValue(14, height),
    textAlign: "center", // Add this line
  },
  buttonText2: { color: "#333333", fontWeight: "bold", fontSize: RFValue(14, height) },

  bottomContainer: {
    justifyContent: "space-evenly",
    backgroundColor: "white",
    marginTop: hp('5%'),
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomContainer2: {
    marginBottom: -hp('1.2%'),
    paddingBottom: -hp('1.2%'),
  },
  bottomButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButton: {
    flexDirection: "column",
    alignItems: "center",
    padding: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    flex: 1,
  },
  modalBackgroundImage: {
    width: '100%',
    minHeight: hp('60%'),
    borderRadius: wp('5%'),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1,
  },
  modalContentAbsolute: {
    zIndex: 2,
    alignItems: 'center',
    width: '100%',
    padding: wp('5%'),
  },
  bottomButtonText: {
    marginTop: hp('0.5%'),
    textAlign: "center",
    color: "#4d4c4c",
    fontSize: RFValue(12, height),
  },
  divider: {
    width: 1.5,
    height: "40%",
    backgroundColor: "gray",
  },
  prayerImage: {
    width: wp('4.5%'),
    height: hp('3%'),
    resizeMode: "contain"
  },
  updateImage: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: "contain"
  },
  navigateButtonContainer: {
    backgroundColor: "#2E8B57",
    padding: wp('4%'),
    alignItems: "center",
    justifyContent: "center", // Add this line
    flexDirection: "row",     // Add this line
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    width: "100%",
    height: hp('10%'),
    alignSelf: "center",
  },
  navigateButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: RFValue(16, height),
    
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp('5%'),
  },
  modalContent: {
    width: "90%",
    borderRadius: wp('5%'),
    padding: wp('5%'),
    alignItems: "center",

  },
  wtg2logo: {
    width: wp('18%'),
    height: wp('18%'),
    top: -hp('2.5%'),
  },
  WtG2: {
    width: wp('23%'),
    height: wp('23%'),
    marginBottom: hp('1.8%'),
    resizeMode: "contain",
  },
  modalProfileImage: {
    width: wp('27%'),
    height: wp('27%'),
    borderRadius: wp('13.5%'),
    borderWidth: 0.1,
    borderColor: "white",
  },
  imageBorderOuter: {
    width: wp('29%'),
    height: wp('29%'),
    borderRadius: wp('14.5%'),
    backgroundColor: "#94b143",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBorderInner: {
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('14%'),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  memorialHeader: {
    fontSize: RFValue(32, height),
    fontWeight: "bold",
    marginBottom: hp('1.2%'),
    color: "white",
    textAlign: "center",
  },
  memorialSubtext: {
    fontSize: RFValue(16, height),
    fontStyle: "italic",
    marginBottom: hp('1.8%'),
    textAlign: "center",
    color: "white",
  },
  candleCount: {
    fontSize: RFValue(16, height),
    textAlign: "center",
    marginTop: hp('1.8%'),
    marginBottom: hp('3%'),
    color: "white",
  },
  boldText: {
    fontWeight: "bold",
  },
  encourageText: {
    fontSize: RFValue(18, height),
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: hp('6%'),
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp('4%'),
  },
  icon: {
    width: wp('15%'),
    height: wp('15%'),
  },
  candleCountContainer: {
    position: 'absolute',
    top: hp('1.2%'),
    right: wp('11%'),
    backgroundColor: 'red',
    borderRadius: wp('2.5%'),
    width: wp('4.5%'),
    height: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  candleCountText: {
    color: 'white',
    fontSize: RFValue(10, height),
    fontWeight: 'bold',
  },
});

export default GraveInformation;