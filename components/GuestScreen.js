import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import RNModal from "react-native-modal";
import { LinearGradient } from 'expo-linear-gradient';
import { createDrawerNavigator, DrawerContentScrollView, DrawerActions } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const services = [
  { id: 1, name: "Yearly Grave Cleaning", image: require("../assets/YearlyIMG.png") },
  { id: 2, name: "Electricity Use", image: require("../assets/ElectricityIMG.png") },
  { id: 3, name: "Construction Permit", image: require("../assets/PermitIMG.png") },
  { id: 4, name: "Niche Demolition", image: require("../assets/DemolitionIMG.png") },
  { id: 5, name: "Lot for Lease Existing Fee", image: require("../assets/LotIMG.png") },
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
    description: "optional for Lapida\n• 5 YEARS CONTRACT\n• NON-RENEWABLE", 
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
  }
];

// Drawer Content Component
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.menuSection}>
        {/* FAQs */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.navigate('FAQsGuestScreen');
          }}
        >
          <Image source={require('../assets/aboutIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextBlue}>FAQs</Text>
        </TouchableOpacity>

        {/* Services & Maintenance */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.navigate('GuestScreen');
          }}
        >
          <Image source={require('../assets/servicesIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextYellow}>Services & Maintenance</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button at the bottom */}
      <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 40 }}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => props.navigation.navigate('SignIn')}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

// Main GuestScreen Component
const GuestScreenContent = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleServicePress = (service) => {
    const selectedDetail = MaintenanceDetails.find((detail) => detail.title === service.name);
    if (selectedDetail) {
      setSelectedService(selectedDetail);
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/ServicesBG.png')} 
      style={styles.background} 
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Drawer Toggle Button */}
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerToggle}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cemetery Services & Maintenance</Text>
        <Text style={styles.headerSubtitle}>
          Provide dignified burial options for loved ones with various choices to suit different needs.
        </Text>
      </View>

      {/* Maintenance Services */}
      <Text style={styles.sectionTitle}>Maintenance and Construction Services</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {services.map((service) => (
          <TouchableOpacity key={service.id} onPress={() => handleServicePress(service)} style={styles.serviceCard}>
            <Image source={service.image} style={styles.serviceImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Burial Services */}
      <Text style={styles.sectionTitle1}>Burial Services</Text>
      <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.mainScrollViewContent}>
        {burialOptions.map((option) => (
          <View key={option.id} style={[styles.burialCard, { backgroundColor: option.bgColor }]}>
            <Image source={option.image} style={styles.burialImage} />
            <View style={styles.burialInfo}>
              <Text style={styles.burialTitle}>{option.name}</Text>
              <Text style={styles.burialDescription}>{option.description}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate(option.route)}
              >
                <Text style={styles.buttonText}>View details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <RNModal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modal}>
        <View style={styles.modalContent}>
          {selectedService && (
            <>
              <View style={styles.divider} />
              <Image source={selectedService.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedService.title}</Text>
              <Text style={styles.modalPricing}>{selectedService.pricing}</Text>
              <Text style={styles.modalDescription}>{selectedService.description}</Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("GuestLogin");
                }} 
                style={styles.requestButton}
              >
                <LinearGradient
                  colors={["#ffef5d", "#7ed957"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.requestServiceGradient}
                >
                  <Text style={styles.requestButtonText}>Request Service</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </RNModal>
    </ImageBackground>
  );
};

// Drawer Navigator
const Drawer = createDrawerNavigator();

const GuestScreen = () => {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />} 
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="GuestScreenContent" component={GuestScreenContent} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20, 
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 60,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2D6A4F",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  drawerToggle: {
    position: "absolute",
    top: 0,
    left: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: "#2D6A4F",
    marginVertical: 2,
  },
  sectionTitle: {
    fontSize: 15,
    color: "#a6a6a6",
    marginTop: 60,
    marginLeft: 20,
  },
  sectionTitle1:{
    fontSize: 15,
    color: "#a6a6a6",
    marginLeft: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  serviceCard: {
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  serviceImage: {
    width: 124,
    height: 103,
    marginBottom: 2,
    marginRight: 5,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  burialCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 5,
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    position: "relative",
    minHeight: 100,
  },
  burialImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  burialInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  burialTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D6A4F",
  },
  burialDescription: {
    fontSize: 12,
    color: "#555",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderTopLeftRadius: 10,
  },
  button: {
    backgroundColor: "#2D6A4F",
    padding: 8,
    borderRadius: 5,
    position: "relative",
    bottom: 0,
    right: 0,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  divider: {
    width: "13%",
    height: "0.8%",
    backgroundColor: "#d9d9d9",
    bottom: 5,
    borderRadius: 10,
  },
  modalImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333333",
  },
  modalPricing: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 5,
  },
  modalDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "left",
    marginTop: 10,
  },
  requestButton: {
    borderRadius: 5,
    marginTop: 15,
    width: "80%",
    alignItems: "center",
    marginVertical: 15,
  },
  requestButtonText: {
    color: "#1a5242",
    fontSize: 14,
    fontWeight: "bold",
  },
  requestServiceGradient: { 
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10, 
    paddingVertical: 10,
  },
  mainScrollViewContent: {
    paddingBottom: 20,
  },
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  menuSection: {
    marginVertical: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  drawerTextBlue: {
    fontSize: 16,
    marginLeft: 15,
    color: '#1580c2',
  },
  drawerTextYellow: {
    fontSize: 16,
    marginLeft: 15,
    color: '#cb9717',
  },
  drawerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  signInButton: {
    backgroundColor: '#00aa13',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuestScreen;



