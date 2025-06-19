import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Alert, StatusBar } from "react-native";
import RNModal from "react-native-modal";  
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
const { width, height } = Dimensions.get('window');

// Services data
const services = [
  { id: 1, name: "Yearly Grave Cleaning", image: require("../assets/YearlyIMG.png") },
  { id: 2, name: "Electricity Use", image: require("../assets/ElectricityIMG.png") },
  { id: 3, name: "Construction Permit", image: require("../assets/PermitIMG.png") },
  { id: 4, name: "Niche Demolition", image: require("../assets/DemolitionIMG.png") },
  { id: 5, name: "Lot for Lease Existing Fee", image: require("../assets/LotIMG.png") },
  { id: 6, name: "Gravestone QR", image: require("../assets/GravestoneQrIMG.png") }, // Added new service
];

const burialOptions = [
  { 
    id: 1, 
    name: "ADULT (Ordinary)", 
    description: "w/ Lapida\n• 5 YEARS CONTRACT\n• RENEWABLE", 
    image: require("../assets/adult.png"),
    bgColor: "#e2efc2", // Light Red
    route: "AdultDetails",
  },
  { 
    id: 2, 
    name: "CHILD APT.", 
    description: "optional for Lapida\n• 4 YEARS CONTRACT\n• NON-RENEWABLE", 
    image: require("../assets/child.png"),
    bgColor: "#c2dfef", // Light Red
    route: "ChildAptDetails",
  },
  { 
    id: 3, 
    name: "BONE APT.", 
    description: "2 bones only\n• 5 YEARS CONTRACT\n• RENEWABLE", 
    image: require("../assets/bones.png"),
    bgColor: "#efe6c2", // Light Red
    route: "BoneAptDetails",
  },
  { 
    id: 4, 
    name: "PRIVATE LOTS", 
    description: "AVAILABLE IN:\n• UNDER GROUND\n• ABOVE GROUND", 
    image: require("../assets/private.png"),
    bgColor: "#efc2c2", // Light Red
    route: "PrivateLotDetails",
  }
];

const MaintenanceDetails = [
  { 
    id: 1, 
    image: require("../assets/YearlyCleaningLogo.png"),
    title: "Yearly Grave Cleaning", 
    pricing: "₱400.00",
    description: "• Regular cleaning to remove dirt, leaves and debris.\n• Grass trimming and general upkeep.", 
  },
  { 
    id: 2, 
    image: require("../assets/ElecticityLogo.png"),
    title: "Electricity Use", 
    pricing: "₱400.00 per day   |   ₱62.50 per hour",
    description: "\n• For lighting and power needs during construction.", 
  },
  { 
    id: 3, 
    image: require("../assets/PermitLogo.png"),
    title: "Construction Permit", 
    pricing: "₱2,000.00",
    description: "• Required for building structures like tombs or mausoleums.", 
  },
  { 
    id: 4, 
    image: require("../assets/NicheDemolitionLogo.png"),
    title: "Niche Demolition", 
    pricing: "₱3,000.00",
    description: "• For removing or restructuring existing burial niches.", 
  },
  { 
    id: 5, 
    image: require("../assets/LotforExistingFeeLogo.png"),
    title: "Lot for Lease Existing Fee", 
    pricing: "₱5,000.00 (per sqm)",
    description: "• Families can lease a burial lot instead of purchasing it permanently.\n• It may apply to pre-owned or previously used lots that are being re-leased.", 
  },
  { 
    id: 6, 
    image: require("../assets/GravestoneQRIcon.png"),
    title: "Gravestone QR", 
    pricing: "₱450.00",
    description: "• QR code for gravestone to digitally memorialize your loved one.", 
  }
];

const maintenanceServiceImages = {
  "Yearly Grave Cleaning": require("../assets/YearlyIMG.png"),
  "Electricity Use": require("../assets/ElectricityIMG.png"),
  "Construction Permit": require("../assets/PermitIMG.png"),
  "Niche Demolition": require("../assets/DemolitionIMG.png"),
  "Lot for Lease Existing Fee": require("../assets/LotIMG.png"),
  "Gravestone QR": require("../assets/GravestoneQrIMG.png"),
};

const ServicesScreen = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [requestedServices, setRequestedServices] = useState([]);
  const [burialServices, setBurialServices] = useState([]);
  const [maintenanceServices, setMaintenanceServices] = useState([]);
  const navigation = useNavigation();

  // Fetch requested services for the logged-in user in real-time
  const fetchRequestedServices = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const response = await fetch(`https://walktogravemobile-backendserver.onrender.com/api/service-requests/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRequestedServices(data.data.map(req => req.serviceName));
      }
    } catch (error) {
      console.error("Error fetching requested services:", error);
    }
  };

  useEffect(() => {
    fetchRequestedServices();
  }, [modalVisible, confirmationVisible]);

  useEffect(() => {
    fetch('https://walktogravemobile-backendserver.onrender.com/api/burial-services')
      .then(res => res.json())
      .then(data => setBurialServices(data))
      .catch(() => setBurialServices([]));

    fetch('https://walktogravemobile-backendserver.onrender.com/api/maintenance-services')
      .then(res => res.json())
      .then(data => setMaintenanceServices(data))
      .catch(() => setMaintenanceServices([]));
  }, []);

  
  // Open modal only after selectedService is set
  useEffect(() => {
    let timeout;
    if (selectedService) {
      timeout = setTimeout(() => setModalVisible(true), 0); // next tick
    }
    return () => clearTimeout(timeout);
  }, [selectedService]);

  // When closing modal, clear selectedService after animation
  const handleModalHide = () => {
    setSelectedService(null);
  };

  const handleServicePress = async (service) => {
    await fetchRequestedServices();
    setSelectedService(service);
  };

  // Add this helper function inside your ServicesScreen component (or above the return)
  const renderBullets = (description) => {
    // Split by bullet or newline, trim, and filter out empty lines
    return description
      .split(/\n|•/g)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, idx) => (
        <Text
          key={idx}
          style={[
            styles.modalDescription,
            { marginTop: idx === 0 ? hp('1.2%') : hp('1.5%') } // Add gap between bullets
          ]}
        >
          {`• ${line}`}
        </Text>
      ));
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground 
        source={require('../assets/ServicesBG.png')} 
        style={styles.background} 
        resizeMode="cover"
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons
            name="menu"
            size={24}
            color="black"
            style={{ marginLeft: width * 0.02, paddingTop: height * 0.03 }}
          />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cemetery Services & Maintenance</Text>
          <Text style={styles.headerSubtitle}>
            Provide dignified burial options for loved ones with various choices to suit different needs.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Maintenance and Construction Services</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
  {maintenanceServices.map((service) => (
    <TouchableOpacity
      key={service._id}
      onPress={() => handleServicePress(service)}
      style={styles.serviceCard}
      activeOpacity={0.85}
    >
      <View style={styles.cardShadow}>
        <Image
          source={maintenanceServiceImages[service.serviceName] || require("../assets/defaultBg.png")}
          style={styles.serviceImage}
        />
        <View style={styles.serviceNameOverlay}>
          <Text style={styles.serviceNameText}>{service.serviceName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>

        <Text style={styles.sectionTitle1}>Burial Services</Text>
        <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.mainScrollViewContent}>
          {burialServices.map((option) => (
            <View key={option._id} style={[styles.burialCard, { backgroundColor: "#e2efc2" }]}>
              <Image source={option.icon ? { uri: option.icon } : require("../assets/adult.png")} style={styles.burialImage} />
              <View style={styles.burialInfo}>
                <Text style={styles.burialTitle}>{option.serviceName}</Text>
                <Text style={styles.burialDescription}>
                  {option.contractYears ? `${option.contractYears} YEARS CONTRACT` : ''}
                  {option.renewable ? '\n• RENEWABLE' : '\n• NON-RENEWABLE'}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => navigation.navigate('AdultDetails', { burialService: option })}
                >
                  <Text style={styles.buttonText}>View details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <RNModal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          onModalHide={handleModalHide}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={350}
          animationOutTiming={250}
          style={styles.modal}
          useNativeDriver
        >
          <View style={[styles.modalContent, { alignItems: 'center', paddingTop: hp('3%'), paddingBottom: hp('2%'), height: undefined, minHeight: hp('38%') }]}>
            {/* Drag indicator */}
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: '#e0e0e0', marginBottom: hp('2%') }} />
            {/* Only render modal content if selectedService is available */}
            {selectedService ? (
              <>
                {/* Icon */}
                {selectedService.icon && (
                  <View style={{ backgroundColor: '#f6f6f6', borderRadius: 50, padding: 18, marginBottom: hp('2%') }}>
                    <Image source={{ uri: selectedService.icon }} style={{ width: 54, height: 54, resizeMode: 'contain' }} />
                  </View>
                )}
                {/* Service Name */}
                <Text style={{ fontSize: wp('5.2%'), fontWeight: 'bold', color: '#222', marginBottom: hp('1%'), textAlign: 'center', fontFamily: 'Inter_700Bold' }}>
                  {selectedService.serviceName}
                </Text>
                {/* Pricing */}
                {selectedService.price && (
                  <Text style={{ fontSize: wp('4.2%'), fontWeight: 'bold', color: '#222', marginBottom: hp('1.5%'), textAlign: 'center', fontFamily: 'Inter_700Bold' }}>
                  ₱ {selectedService.price}
                  </Text>
                )}
                {/* Maintenance Type */}
                {selectedService.maintenanceType && (
                  <Text style={{ fontSize: wp('3.8%'), color: '#888', marginBottom: hp('1%'), textAlign: 'center', fontFamily: 'Inter_400Regular' }}>
                    {selectedService.maintenanceType.charAt(0).toUpperCase() + selectedService.maintenanceType.slice(1)} Service
                  </Text>
                )}
                {/* Short Description as Bullets */}
                <View style={{ width: '100%', marginTop: hp('1%'), marginBottom: hp('2%'), paddingHorizontal: wp('2%') }}>
                  {selectedService.shortDescription
                    ? selectedService.shortDescription
                        .split('\n')
                        .filter(line => line.trim().length > 0)
                        .map((line, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                            <Text style={{ color: '#222', fontSize: wp('4.1%'), marginRight: 6, lineHeight: 22 }}>•</Text>
                            <Text style={{ color: '#222', fontSize: wp('4.1%'), flex: 1, lineHeight: 22 }}>{line.replace(/^•\s*/, '')}</Text>
                          </View>
                        ))
                    : null}
                </View>
              </>
            ) : null}
          </View>
        </RNModal>

        <ConfirmationModal
          visible={confirmationVisible}
          message="Are you sure you want to request this service?"
          onConfirm={async () => {
            try {
              const userId = await AsyncStorage.getItem('userId'); // Get the logged-in user's ID
              if (!userId) {
                Alert.alert("Error", "You must be logged in to request a service.");
                return;
              }

              // API call to add the service request to the database
              const response = await fetch('https://walktogravemobile-backendserver.onrender.com/api/service-requests', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId,
                  serviceName: selectedService.title,
                  price: parseFloat(selectedService.pricing.replace(/[^0-9.]/g, '')), // Extract numeric price
                }),
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Request Submitted", "Your service request has been submitted successfully.");
              } else {
                console.error("Error submitting request:", data.message);
                Alert.alert("Error", data.message || "Failed to submit the service request.");
              }
            } catch (error) {
              console.error("Error submitting request:", error);
              Alert.alert("Error", "An error occurred while submitting the service request.");
            }

            setConfirmationVisible(false); // Close the confirmation modal
            setModalVisible(false); // Close the service details modal
          }}
          onCancel={() => setConfirmationVisible(false)}
        />
      </ImageBackground>
    </>
  );
};

// Drawer Content
const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";
  

  const handleSignOut = () => {
    Alert.alert(
        "Are you sure?",
        "Do you really want to log out?",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Sign out canceled"),
                style: "cancel",
            },
            {
                text: "Confirm",
                onPress: async () => {
                    try {
                        // Clear user data from AsyncStorage
                        await AsyncStorage.removeItem("userId");

                        // Navigate to the SignIn screen
                        navigation.reset({
                            index: 0, // Reset stack to the SignIn screen
                            routes: [{ name: 'SignIn' }], // Navigate to SignIn
                        });
                    } catch (error) {
                        console.error("Error during sign out:", error);
                    }
                },
            },
        ],
        { cancelable: false } // Disable dismissing the alert by tapping outside
    );
};

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("userId")
        .then(userId => {
          if (!userId) return Promise.reject("No user ID found");
          return fetch(`${BASE_URL}/api/users/${userId}`);
        })
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error("Error fetching user:", error));
    }, [])
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
       {/* Profile Section */}
       <View style={styles.profileSection}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={
        user?.profileImage
          ? { uri: user.profileImage }
          : require('../assets/blankDP.jpg') // fallback local image
      }
      style={styles.profileImage}
    />
    <View style={{ marginLeft: 16 }}>
      <Text style={styles.profileName}>
        {user?.name
          ? user.name.length > 16
            ? `${user.name.slice(0, 16)}...`
            : user.name
          : "Loading..."}
      </Text>
      <Text style={styles.profileLocation}>{user?.city || "Loading..."}</Text>
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <MaterialIcons name="edit" size={16} color="green" />
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

      {/* Drawer Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/home.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextGreen}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Notifications')}>
          <Image source={require('../assets/notificationIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextGreen}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('History')}>
          <Image source={require('../assets/homeIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextGreen}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Bookmarks')}>
          <Image source={require('../assets/bookmarkIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextYellow}>Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Prayers')}>
          <Image source={require('../assets/prayersIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextYellow}>Prayers for the Deceased</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Services')}>
          <Image source={require('../assets/servicesIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextYellow}>Services & Maintenance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('FAQs')}>
          <Image source={require('../assets/aboutIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextBlue}>FAQs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <FontAwesome name="sign-out" size={24} color="black" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
const Drawer = createDrawerNavigator();

const ServicesScreenWithDrawer = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="ServicesScreen" component={ServicesScreen} />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: wp('100%'),
    height: hp('105%'),
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
    marginTop: hp('7%'),
    marginBottom: hp('1%'),
  },
  headerTitle: {
    fontSize: wp('8%'),
    fontWeight: "bold",
    color: "#2D6A4F",
    marginTop: hp('3%'),
    fontFamily: 'Inter_700Bold',
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    color: "#555",
    marginTop: hp('0.5%'),
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle: {
    fontSize: wp('4%'),
    color: "#a6a6a6",
    marginTop: hp('5%'),
    marginLeft: wp('5%'),
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle1: {
    fontSize: wp('4%'),
    color: "#a6a6a6",
    marginLeft: wp('5%'),
    fontFamily: 'Inter_400Regular',
  },
  horizontalScroll: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1.2%'),
  },
  serviceCard: {
    alignItems: "center",
    borderRadius: wp('4%'),
    marginHorizontal: wp('2%'),
    backgroundColor: "transparent",
  },
  cardShadow: {
    borderRadius: wp('4%'),
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: "#fff",
  },
  serviceImage: {
    width: wp('32%'),
    height: wp('26%'),
    resizeMode: "cover",
    justifyContent: 'flex-end',
  },
  serviceNameOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceNameText: {
    color: "#fff",
    fontSize: wp('4.2%'),
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  burialCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: wp('1.2%'),
    padding: wp('2.5%'),
    marginHorizontal: wp('5%'),
    borderRadius: wp('2.5%'),
    position: "relative",
    minHeight: hp('12%'),
  },
  burialImage: {
    width: wp('13%'),
    height: wp('13%'),
    marginRight: wp('2.5%'),
    resizeMode: "contain",
  },
  burialInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  burialTitle: {
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    color: "#2D6A4F",
    fontFamily: 'Inter_700Bold',
  },
  burialDescription: {
    fontSize: wp('3.2%'),
    color: "#555",
    fontFamily: 'Inter_400Regular',
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: wp('2.5%'),
    borderTopLeftRadius: wp('2.5%'),
  },
  button: {
    backgroundColor: "#2D6A4F",
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
    position: "relative",
    bottom: 0,
    right: 0,
  },
  buttonText: {
    color: "#FFF",
    fontSize: RFValue(15, height),
    fontWeight: "bold",
    fontFamily: 'Inter_400Regular',
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: wp('6%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    alignItems: "center",
    height: hp('40%'),
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  divider: {
    width: "25%",
    height: hp('0.6%'),
    backgroundColor: "#d9d9d9",
    bottom: 5,
    borderRadius: 10,
  },
  modalImage: {
    width: wp('18%'),
    height: wp('18%'),
    marginBottom: hp('1.2%'),
    marginTop: hp('2.5%'),
    resizeMode: "contain",
  },
  modalTitle: {
    fontSize: RFValue(22, height),
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    fontFamily: 'Inter_700Bold',
  },
  modalPricing: {
    fontSize: RFValue(16, height),
    fontWeight: "bold",
    color: "#333333",
    marginTop: hp('0.8%'),
    fontFamily: 'Inter_700Bold',
  },
  modalDescription: {
    fontSize: RFValue(15, height),
    color: "#555",
    textAlign: "left",
    marginTop: hp('1.2%'),
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: wp('5%'),
  },
  requestButton: {
    borderRadius: wp('2.5%'),
    marginTop: hp('1.8%'),
    width: "80%",
    alignItems: "center",
    marginVertical: hp('1.8%'),
  },
  requestButtonText: {
    color: "#1a5242",
    fontSize: RFValue(16, height),
    fontWeight: "bold",
    fontFamily: 'Inter_700Bold',
  },
  requestServiceGradient: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp('2.5%'),
    paddingVertical: hp('1.5%'),
  },
  mainScrollViewContent: {
    paddingBottom: hp('2.5%'),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
    top: hp('3%'),
    position: 'absolute'
  },
  navItem: {
    alignItems: 'center',
  },
  buttonRow: {
    bottom:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,

  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  IconDivider: {
    height: 45,
    width: 0.5,
    backgroundColor: 'gray',
  },
  divider3: {
    height: 0.5,
    width: '85%',
    backgroundColor: 'gray',
    marginHorizontal: 35,
    bottom: 28,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    top:12,
    backgroundColor: 'white',
  },
  searchBar: {
    flex: 1,
    padding: 10,
  },
  searchIcon: {
    padding: 10,
  },
  drawerContainer: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
    borderTopRightRadius: wp('25%'),
    borderBottomRightRadius: wp('25%'),
},
profileSection: {
    alignItems: 'center',
    marginBottom: hp('2.5%'),
},
profileImage: {
    width: wp('21%'),
    height: wp('21%'),
    borderRadius: wp('10.5%'),
    borderWidth: 1,
    borderColor: '#00aa13',
},
profileName: {
    fontSize: RFValue(19, height),
    fontWeight: 'bold',
    marginTop: hp('1.2%'),
},
profileLocation: {
    fontSize: RFValue(15, height),
    color: '#555',
},
editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.6%'),
},
editProfileText: {
    fontSize: RFValue(15, height),
    color: 'green',
    marginLeft: wp('1.2%'),
},
menuSection: {
    marginVertical: hp('1.2%'),
},
drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
},
drawerTextGreen: {
    fontSize: RFValue(18, height),
    marginLeft: wp('4%'),
    color: '#12894f',
},
drawerTextYellow: {
    fontSize: RFValue(18, height),
    marginLeft: wp('4%'),
    color: '#cb9717',
},
drawerTextBlue: {
    fontSize: RFValue(18, height),
    marginLeft: wp('4%'),
    color: '#1580c2',
},
signOutSection: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: hp('1.2%'),
    paddingBottom: hp('5%'),
},
signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.8%'),
},
signOutText: {
    fontSize: RFValue(18, height),
    marginLeft: wp('2.5%'),
    color: '#333',
},
drawerIcon: {
    width: wp('11%'),
    height: wp('11%'),
    resizeMode: 'contain',
    marginRight: wp('2.5%'),
    },
});

export default ServicesScreenWithDrawer;
