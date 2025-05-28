import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, TouchableWithoutFeedback, Alert, ImageBackground } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

const GraveInformation = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { grave } = route.params; // Get passed data
    const [isCandleLit, setIsCandleLit] = useState(false);
    const [hasCandleBeenLit, setHasCandleBeenLit] = useState(false);
    const [candleCount, setCandleCount] = useState(0);
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
            const bookmarks = existingBookmarks ? JSON.parse(existingBookmarks) : [];

            // Check if the grave is already bookmarked
            if (bookmarks.some((item) => item._id === grave._id)) {
                Alert.alert('Already Bookmarked', 'This grave is already in your bookmarks.');
                return;
            }

            const updatedBookmarks = [...bookmarks, grave];
            await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            Alert.alert('Bookmarked', 'This grave has been added to your bookmarks.');
        } catch (error) {
            console.error('Error bookmarking grave:', error);
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

        loadCandleData();
    }, [grave._id]);

    return (
        <View style={{ flex: 1 }}>
            {/* Fixed Buttons */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('MainTabs', { screen: 'HistoryTab' })}
            >
                <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            <View style={styles.topRightButtons}>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social-outline" size={26} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
                    <Ionicons name="bookmark-outline" size={26} color="white" />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header Image */}
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: grave.image ? grave.image : 'https://via.placeholder.com/300' }}
                        style={styles.headerImage}
                    />
                </View>

                {/* Profile Section */}
                <View style={styles.profileContainer}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: grave.image ? grave.image : 'https://via.placeholder.com/90' }}
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
                        source={hasCandleBeenLit
                            ? require("../assets/CandleLighted.png")
                            : require("../assets/CandleLight.png")}
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
                        style={[styles.lightCandleButton, hasCandleBeenLit && styles.noBackground]}
                    >
                        {hasCandleBeenLit ? (
                            <LinearGradient
                                colors={["#000000", "#c89116"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.lightCandleGradient}
                            >
                                <View style={styles.buttonContent}>
                                    <Image source={require("../assets/Candle2.png")} style={styles.CandleImage} />
                                    <Text style={styles.buttonText3}>  Candle was Lit</Text>
                                </View>
                            </LinearGradient>
                        ) : (
                            <View style={styles.buttonContent}>
                                <Image source={require("../assets/Candle1.png")} style={styles.CandleImage} />
                                <Text style={styles.buttonText}>  Light a candle</Text>
                            </View>
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
                            onPress={() => navigation.navigate('MainTabs', { screen: 'PrayersTab' })}
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
                          <Ionicons name="location" size={24} color="white" /> Navigate to the Grave
                        </Text>
                      </View>
                    </TouchableOpacity>
                </View>

                {/* Hidden ViewShot for Modal Content */}
                <View style={{ position: 'absolute', left: -9999, top: -9999 }}>
  <ViewShot ref={modalContentRef} options={{ format: 'png', quality: 0.9 }}>
    <ImageBackground
      source={{ uri: grave.image ? grave.image : 'https://via.placeholder.com/300' }}
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
              source={{ uri: grave.image ? grave.image : 'https://via.placeholder.com/100' }}
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
    <TouchableWithoutFeedback onPress={() => setIsCandleLit(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={require('../assets/WtG2.png')} style={styles.wtg2logo} />
            <Text style={styles.memorialHeader}>Memorial Candle</Text>
            <Text style={styles.memorialSubtext}>Thank you for taking part in the memory.</Text>
            <View style={styles.imageBorderOuter}>
              <View style={styles.imageBorderInner}>
                <Image
                  source={{ uri: grave.image ? grave.image : 'https://via.placeholder.com/100' }}
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
    );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff" },
  headerContainer: { position: "relative" },
  headerImage: { width: "100%", height: height * 0.45 },

  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.06,
    backgroundColor: 'rgb(252, 189, 33)',
    padding: width * 0.025,
    borderRadius: width * 0.12,
    zIndex: 10,
  },
  topRightButtons: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    flexDirection: 'row',
    zIndex: 10,
  },
  shareButton: {
    backgroundColor: 'rgba(54, 38, 38, 0.5)',
    padding: width * 0.025,
    borderRadius: width * 0.12,
    marginRight: width * 0.025,
  },
  bookmarkButton: {
    backgroundColor: 'rgba(54, 38, 38, 0.5)',
    padding: width * 0.025,
    borderRadius: width * 0.12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.05,
    position: "relative"
  },
  profileImageContainer: {
    top: -height * 0.08,
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 2,
    borderColor: "#94b143",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: width * 0.23,
    height: width * 0.23,
    borderRadius: width * 0.115,
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: { flex: 1 },
  profileBottomLeftImage: {
    position: "absolute",
    bottom: height * 0.01,
    left: width * 0.08,
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.03,
  },
  profileBottomRightImage: {
    position: "absolute",
    bottom: height * 0.01,
    right: width * 0.05,
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.03,
  },
  name: { fontSize: width * 0.06, fontWeight: "bold", marginBottom: height * 0.005 },
  dates: { fontSize: width * 0.037, color: "gray" },
  location: { fontSize: width * 0.03, color: "gray", marginTop: height * 0.005 },
  description: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.012,
    textAlign: "center",
    width: "90%",
    height: height * 0.13,
    lineHeight: width * 0.045,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: height * 0.012,
  },
  lightCandleButton: {
    borderRadius: width * 0.025,
    overflow: "hidden",
    backgroundColor: "orange",
    width: width * 0.38,
    height: height * 0.065,
    alignItems: "center",
    justifyContent: "center",
  },
  noBackground: { backgroundColor: "transparent" },
  lightCandleGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: width * 0.025,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.025,
  },
  CandleImage: {
    width: width * 0.045,
    height: height * 0.035,
    resizeMode: "contain"
  },
  ScanningImage: {
    width: width * 0.06,
    height: height * 0.035,
    resizeMode: "contain"
  },
  scanMemoryButton: {
    borderRadius: width * 0.025,
    overflow: "hidden",
    width: width * 0.38,
    height: height * 0.065,
    alignItems: "center",
    justifyContent: "center",
  },
  scanMemoryGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: width * 0.025,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: width * 0.045 },
  buttonText3: { color: "#fad02c", fontWeight: "bold", fontSize: width * 0.045 },
  buttonText2: { color: "#333333", fontWeight: "bold", fontSize: width * 0.045 },

  bottomContainer: {
    justifyContent: "space-evenly",
    backgroundColor: "white",
    marginTop: height * 0.012,
    paddingTop: 0,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomContainer2: {
    marginBottom: -height * 0.012,
    paddingBottom: -height * 0.012,
  },
  bottomButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButton: {
    flexDirection: "column",
    alignItems: "center",
    padding: width * 0.025,
    paddingHorizontal: width * 0.05,
    flex: 1,
  },
  modalBackgroundImage: {
    width: '100%',
    minHeight: height * 0.6,
    borderRadius: width * 0.05,
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
    padding: width * 0.05,
  },
  bottomButtonText: {
    marginTop: height * 0.005,
    textAlign: "center",
    color: "#4d4c4c",
    fontSize: width * 0.032,
  },
  divider: {
    width: 1.5,
    height: "40%",
    backgroundColor: "gray",
  },
  prayerImage: {
    width: width * 0.045,
    height: height * 0.03,
    resizeMode: "contain"
  },
  updateImage: {
    width: width * 0.05,
    height: height * 0.03,
    resizeMode: "contain"
  },
  navigateButtonContainer: {
    backgroundColor: "#2E8B57",
    padding: width * 0.04,
    alignItems: "center",
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    width: "100%",
    height: height * 0.08,
    alignSelf: "center"
  },
  navigateButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.045
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  modalContent: {
    width: "90%",
    borderRadius: width * 0.05,
    padding: width * 0.05,
    alignItems: "center",
  },
  wtg2logo: {
    width: width * 0.18,
    height: width * 0.18,
    top: -height * 0.025,
  },
  WtG2: {
    width: width * 0.23,
    height: width * 0.23,
    marginBottom: height * 0.018,
    resizeMode: "contain",
  },
  modalProfileImage: {
    width: width * 0.27,
    height: width * 0.27,
    borderRadius: width * 0.135,
    borderWidth: 0.1,
    borderColor: "white",
  },
  imageBorderOuter: {
    width: width * 0.29,
    height: width * 0.29,
    borderRadius: width * 0.145,
    backgroundColor: "#94b143",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBorderInner: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: width * 0.14,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  memorialHeader: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginBottom: height * 0.012,
    color: "white",
    textAlign: "center",
  },
  memorialSubtext: {
    fontSize: width * 0.05,
    fontStyle: "italic",
    marginBottom: height * 0.018,
    textAlign: "center",
    color: "white",
  },
  candleCount: {
    fontSize: width * 0.045,
    textAlign: "center",
    marginTop: height * 0.018,
    marginBottom: height * 0.03,
    color: "white",
  },
  boldText: {
    fontWeight: "bold",
  },
  encourageText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: height * 0.06,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: width * 0.04,
  },
  icon: {
    width: width * 0.15,
    height: width * 0.15,
  },
  candleCountContainer: {
    position: 'absolute',
    top: height * 0.012,
    right: width * 0.11,
    backgroundColor: 'red',
    borderRadius: width * 0.025,
    width: width * 0.045,
    height: width * 0.045,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candleCountText: {
    color: 'white',
    fontSize: width * 0.025,
    fontWeight: 'bold',
  },
});

export default GraveInformation;