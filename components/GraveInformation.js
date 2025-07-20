import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, TouchableWithoutFeedback, Alert, ImageBackground, StatusBar, Share } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width, height } = Dimensions.get('window');
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

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

    const [cameraModalVisible, setCameraModalVisible] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [accountRemovedModal, setAccountRemovedModal] = useState(false);
    const [isCandleModalVisible, setIsCandleModalVisible] = useState(false); // New state for candle modal
    const [candleUsers, setCandleUsers] = useState([]); // New state for candle users
    const [totalCandleCount, setTotalCandleCount] = useState(0);
    const [user, setUser] = useState(null); // Add user state for email matching
    const [canSubmitMemory, setCanSubmitMemory] = useState(false); // State for memory submission access

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

    const handleScanMemory = async () => {
  if (!permission || !permission.granted) {
    const response = await requestPermission();
    if (response.granted) {
      navigation.navigate('QRScanner');
    } else {
      Alert.alert("Permission Denied", "Camera access is required to scan memories.");
    }
  } else {
    navigation.navigate('QRScanner');
  }
};
    
    const handleLightCandle = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    const userName = await AsyncStorage.getItem("userName"); // Or get from your user state
    const userAvatar = await AsyncStorage.getItem("userAvatar"); // Or get from your user state

    if (!userId) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    // Check local timer (per user)
    const existingCandleData = await AsyncStorage.getItem('candleData');
    const candleData = existingCandleData ? JSON.parse(existingCandleData) : {};
    const userCandleData = candleData[userId] || {};
    const graveCandleData = userCandleData[grave._id] || { lastLit: null, count: 0 };
    const now = new Date().getTime();

    if (graveCandleData.lastLit && now - graveCandleData.lastLit < 24 * 60 * 60 * 1000) {
      Alert.alert('Candle Already Lit', 'You can light another candle after 24 hours.');
      return;
    }

    // 1. Call backend to increment shared candle count
    const response = await fetch(`${BASE_URL}/api/candles/light`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        graveId: grave._id,
        graveType: grave.graveType, // Make sure this is set in your grave object!
        userId,
        userName: userName || "Anonymous",
        userAvatar: userAvatar || ""
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      Alert.alert("Error", data.error || "Failed to light candle.");
      return;
    }

    // 2. Update local candle data (per user)
    userCandleData[grave._id] = {
      lastLit: now,
      count: graveCandleData.count + 1,
    };
    candleData[userId] = userCandleData;
    await AsyncStorage.setItem('candleData', JSON.stringify(candleData));

    setHasCandleBeenLit(true);
    setCandleCount(graveCandleData.count + 1);
    setIsCandleLit(true);

    // 3. Refetch total candle count from backend
    fetchTotalCandleCount();

  } catch (error) {
    console.error('Error lighting candle:', error);
    Alert.alert("Error", "An error occurred while lighting the candle.");
  }
};

const handleBookmark = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    if (isBookmarked) {
      // Fetch all bookmarks for this user
      const response = await fetch(`${BASE_URL}/api/bookmarks?userId=${userId}`);
      const bookmarks = await response.json();
      // Find the bookmark for this grave
      const bookmark = bookmarks.find(b => b.grave && b.grave._id === grave._id);
      if (bookmark) {
        await fetch(`${BASE_URL}/api/bookmarks/${bookmark._id}`, { method: "DELETE" });
        setIsBookmarked(false);
        Alert.alert('Removed', 'This grave has been removed from your bookmarks.');
      }
    } else {
      // Add bookmark with full grave object
      await fetch(`${BASE_URL}/api/bookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, grave }),
      });
      setIsBookmarked(true);
      Alert.alert('Bookmarked', 'This grave has been added to your bookmarks.');
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
  }
};

    useEffect(() => {
        const loadCandleData = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;
    const existingCandleData = await AsyncStorage.getItem('candleData');
    const candleData = existingCandleData ? JSON.parse(existingCandleData) : {};
    const userCandleData = candleData[userId] || {};
    const graveCandleData = userCandleData[grave._id] || { lastLit: null, count: 0 };

    setHasCandleBeenLit(
      graveCandleData.lastLit &&
      new Date().getTime() - graveCandleData.lastLit < 24 * 60 * 60 * 1000
    );
    setCandleCount(graveCandleData.count);
  } catch (error) {
    console.error('Error loading candle data:', error);
  }
};

        const checkBookmark = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) return;
                const response = await fetch(`${BASE_URL}/api/bookmarks?userId=${userId}`);
                const bookmarks = await response.json();
                setIsBookmarked(bookmarks.some(b => b.grave && b.grave._id === grave._id));
            } catch (error) {
                console.error('Error checking bookmark:', error);
            }
        };

        loadCandleData();
        checkBookmark();
    }, [grave._id]);

    // Fetch user data and check email matching for memory submission
    useEffect(() => {
        const fetchUserDataAndCheckAccess = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (userId) {
                    const response = await fetch(`${BASE_URL}/api/users/${userId}`);
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        
                        // Check if user's email matches the grave's contact person email
                        const userEmail = userData.email?.toLowerCase() || '';
                        const contactEmail = grave.assignedContactPerson?.email?.toLowerCase() || '';
                        
                        console.log('🔍 Email matching check:');
                        console.log('User email:', userEmail);
                        console.log('Contact email:', contactEmail);
                        console.log('Match result:', userEmail === contactEmail);
                        
                        setCanSubmitMemory(userEmail === contactEmail);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setCanSubmitMemory(false); // Default to disabled on error
            }
        };

        fetchUserDataAndCheckAccess();
    }, [grave._id, grave.assignedContactPerson]);

    useEffect(() => {
      let intervalId;
      const updateTimer = async () => {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;
        const data = await AsyncStorage.getItem('candleData');
        const candleData = data ? JSON.parse(data) : {};
        const userCandleData = candleData[userId] || {};
        const graveCandleData = userCandleData[grave._id] || { lastLit: null, count: 0 };
        if (graveCandleData.lastLit) {
          const now = Date.now();
          const nextAvailable = graveCandleData.lastLit + 24 * 60 * 60 * 1000;
          const diff = nextAvailable - now;
          setTimeLeft(diff > 0 ? diff : 0);
        }
      };
      if (hasCandleBeenLit) {
        updateTimer();
        intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
      } else {
        setTimeLeft(0);
        if (intervalId) clearInterval(intervalId);
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

    useEffect(() => {
        let intervalId;
        const checkUserExists = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) return;
                const response = await fetch(`${BASE_URL}/api/users/${userId}`);
                if (!response.ok) {
                    setAccountRemovedModal(true);
                    await AsyncStorage.removeItem("userId");
                    return;
                }
                const data = await response.json();
                if (!data || data.error || data.message === "User not found") {
                    setAccountRemovedModal(true);
                    await AsyncStorage.removeItem("userId");
                }
            } catch (error) {
                // Optionally handle network errors
            }
        };
        intervalId = setInterval(checkUserExists, 5000); // Check every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    const fetchCandleUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/candles/grave/${grave._id}`);
        const data = await response.json();
        // Each candle has userName and userAvatar
        const users = data.candles.map(candle => ({
          name: candle.userName,
          avatar: candle.userAvatar
        }));
        setCandleUsers(users);
      } catch (e) {
        setCandleUsers([]);
      }
    };

    const fetchTotalCandleCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/candles/candle-count/${grave.graveType}/${grave._id}`);
        const data = await response.json();
        setTotalCandleCount(data.CandleCount || 0);
      } catch (error) {
        setTotalCandleCount(0);
      }
    };

    useEffect(() => {
      fetchTotalCandleCount();
    }, [grave._id, grave.graveType, isCandleLit]);

    const handleShareProfile = async () => {
      let message = `Check out this memorial for ${grave.firstName} ${grave.lastName}.\n`;

      // Put the link on its own line
      message += `\nLight a candle or view more:\nhttps://walktogravemobile.com/candle-lighting/${grave._id}`;

      try {
        await Share.share({
          message,
          title: 'Share Memorial Profile',
        });
      } catch (error) {
        Alert.alert('Error', 'Unable to share profile.');
      }
    };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <Modal
                visible={accountRemovedModal}
                transparent
                animationType="fade"
                onRequestClose={() => {}}
            >
                <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" translucent />
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 24,
                        alignItems: 'center',
                        width: '80%'
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: 'red' }}>
                            Your account has been removed by the administrator.
                        </Text>
                        <TouchableOpacity
                            style={{ padding: 10, marginTop: 16 }}
                            onPress={() => {
                                setAccountRemovedModal(false);
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'SignIn' }],
                                });
                            }}
                        >
                            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
                    <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
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
                        
                        {/* Make the candle touchable */}
                        <TouchableOpacity
  onPress={async () => {
    await fetchCandleUsers();
    setIsCandleModalVisible(true);
  }}
  activeOpacity={0.7}
  style={{ position: 'absolute', bottom: hp('-0.1%'), left: wp('1%') }}
>
  <ImageBackground
    source={
      hasCandleBeenLit
        ? require("../assets/CandleLighted.png")
        : require("../assets/CandleLight.png")
    }
    style={styles.profileBottomLeftImage}
  >
    <View style={styles.candleCountContainer}>
      <Text style={styles.candleCountText}>{totalCandleCount}</Text>
    </View>
  </ImageBackground>
</TouchableOpacity>
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
    onPress={handleScanMemory}
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
  {/* Submit Memories Button */}
  <TouchableOpacity
    style={[styles.bottomButton, { opacity: canSubmitMemory ? 1 : 0.5 }]}
    onPress={() => {
      if (canSubmitMemory) {
        navigation.navigate("SubmitMemories", { grave });
      } else {
        Alert.alert(
          'Access Restricted',
          'You can only submit memories for graves where you are listed as the contact person.',
          [{ text: 'OK' }]
        );
      }
    }}
    disabled={!canSubmitMemory}
  >
    <Image source={require("../assets/submit-memories.png")} style={styles.memoryImage} />
    <Text style={[styles.bottomButtonText, { color: canSubmitMemory ? '#000' : '#888' }]}>Submit Memories</Text>
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
          Together we lit {totalCandleCount} candle{totalCandleCount > 1 ? 's' : ''} for{' '}
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
                  Together we lit {totalCandleCount} candle{totalCandleCount > 1 ? 's' : ''} for{' '}
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

{/* Candle Users Modal */}
<Modal
  visible={isCandleModalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setIsCandleModalVisible(false)}
>
  <View style={{
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)'
  }}>
    <View style={{
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 32,
      minHeight: 280,
    }}>
      {/* Handle */}
      <View style={{
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#e0e0e0',
        }} />
        {/* Add a close button here */}
        <TouchableOpacity
          style={{ position: 'absolute', right: 0, top: -8, padding: 8 }}
          onPress={() => setIsCandleModalVisible(false)}
        >
          <Ionicons name="close" size={28} color="#888" />
        </TouchableOpacity>
      </View>
      {/* Candle count */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Image source={require('../assets/Candle1.png')} style={{ width: 22, height: 22, marginRight: 6 }} />
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#bfa12e' }}>
          {totalCandleCount} candle{totalCandleCount !== 1 ? 's' : ''} lit
        </Text>
      </View>
      {/* Divider */}
      <View style={{
        height: 1.5,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
        width: '100%',
        alignSelf: 'center'
      }} />
      {/* User list */}
      <ScrollView>
        {candleUsers.map((user, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            <Image
              source={user.avatar ? { uri: user.avatar } : require('../assets/blankDP.jpg')}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 14, borderWidth: 1, borderColor: '#eee' }}
            />
            <Text style={{ fontSize: 16, color: '#222' }}>{user.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
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
    height: "60%",
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
  },
  prayerImage: {
    width: wp('4.5%'),
    height: hp('3%'),
    resizeMode: "contain"
  },
  memoryImage: {
    width: wp('5%'),
    height: hp('4%'),
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
  permissionModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp('5%'),
  },
  permissionModalContent: {
    width: "90%",
    borderRadius: wp('5%'),
    padding: wp('5%'),
    alignItems: "center",
    backgroundColor: "white",
    elevation: 5,
  },
  permissionModalTitle: {
    fontSize: RFValue(18, height),
    fontWeight: "bold",
    marginBottom: hp('1%'),
    textAlign: "center",
  },
  permissionModalText: {
    fontSize: RFValue(14, height),
    marginBottom: hp('2%'),
    textAlign: "center",
    color: "#333",
  },
  permissionModalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: hp('2%'),
  },
  permissionAllowButton: {
    flex: 1,
    backgroundColor: "#2E8B57",
    borderRadius: wp('2.5%'),
    paddingVertical: hp('1.5%'),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp('2%'),
  },
  permissionCancelButton: {
    flex: 1,
    backgroundColor: "#f44336",
    borderRadius: wp('2.5%'),
    paddingVertical: hp('1.5%'),
    alignItems: "center",
    justifyContent: "center",
  },
  permissionAllowButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: RFValue(16, height),
  },
  permissionCancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: RFValue(16, height),
  },
});

export default GraveInformation;