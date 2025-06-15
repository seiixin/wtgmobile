import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Dimensions } from "react-native";
import RNModal from "react-native-modal";
import { LinearGradient } from 'expo-linear-gradient';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");

const services = [
  { id: 1, name: "Yearly Grave Cleaning", image: require("../assets/YearlyIMG.png") },
  { id: 2, name: "Electricity Use", image: require("../assets/ElectricityIMG.png") },
  { id: 3, name: "Construction Permit", image: require("../assets/PermitIMG.png") },
  { id: 4, name: "Niche Demolition", image: require("../assets/DemolitionIMG.png") },
  { id: 5, name: "Lot for Lease Existing Fee", image: require("../assets/LotIMG.png") },
  { id: 6, name: "Gravestone QR", image: require("../assets/GravestoneQrIMG.png") },
];

const burialOptions = [
  { 
    id: 1, 
    name: "ADULT (Ordinary)", 
    description: "w/ Lapida\n• 5 YEARS CONTRACT\n• RENEWABLE", 
    image: require("../assets/adult.png"),
    bgColor: "#e2efc2",
    route: "AdultDetails",
  },
  { 
    id: 2, 
    name: "CHILD APT.", 
    description: "optional for Lapida\n• 4 YEARS CONTRACT\n• NON-RENEWABLE", 
    image: require("../assets/child.png"),
    bgColor: "#c2dfef",
    route: "ChildAptDetails",
  },
  { 
    id: 3, 
    name: "BONE APT.", 
    description: "2 bones only\n• 5 YEARS CONTRACT\n• RENEWABLE", 
    image: require("../assets/bones.png"),
    bgColor: "#efe6c2",
    route: "BoneAptDetails",
  },
  { 
    id: 4, 
    name: "PRIVATE LOTS", 
    description: "AVAILABLE IN:\n• UNDER GROUND\n• ABOVE GROUND", 
    image: require("../assets/private.png"),
    bgColor: "#efc2c2",
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

// Drawer Content Component
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.menuSection}>

        <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={() => {
                    props.navigation.navigate('HomeGuest');
                  }}
                >
                  <Image source={require('../assets/home.png')} style={styles.drawerIcon} />
                  <Text style={styles.drawerTextBlue}>Home</Text>
                </TouchableOpacity>
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
          <View
            style={[
              styles.modalContent,
              selectedService && selectedService.description && selectedService.description.length > 120
                ? { height: hp('50%') }
                : { height: hp('45%') }
            ]}
          >
            {selectedService && (
              <>
                <View style={styles.divider} />
                <Image source={selectedService.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedService.title}</Text>
                <Text style={styles.modalPricing}>{selectedService.pricing}</Text>
                <ScrollView
                  style={{ width: '100%', flex: 1 }}
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center', // Center vertically
                  }}
                >
                  {selectedService.description
                    .split(/\n|•/g)
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .map((line, idx) => (
                      <Text
                        key={idx}
                        style={[
                          styles.modalDescription,
                          { marginTop: idx === 0 ? hp('1.2%') : hp('1.5%') }
                        ]}
                      >
                        {`• ${line}`}
                      </Text>
                    ))}
                </ScrollView>
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
    </>
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
  drawerToggle: {
    position: "absolute",
    top: 0,
    left: wp('5%'),
    width: wp('8%'),
    height: wp('8%'),
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: wp('6%'),
    height: 2,
    backgroundColor: "#2D6A4F",
    marginVertical: 2,
  },
  sectionTitle: {
    fontSize: wp('4%'),
    color: "#a6a6a6",
    marginTop: hp('7%'),
    marginLeft: wp('5%'),
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle1: {
    fontSize: wp('4%'),
    color: "#a6a6a6",
    marginLeft: wp('5%'),
    marginTop: hp('3%'),
    fontFamily: 'Inter_400Regular',
  },
  horizontalScroll: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1.2%'),
  },
  serviceCard: {
    alignItems: "center",
    borderRadius: wp('2.5%'),
    marginHorizontal: wp('2.5%'),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: wp('2.5%'),
    elevation: 5,
  },
  serviceImage: {
    width: wp('32%'),
    height: wp('28%'),
    marginBottom: hp('3%'),
    marginRight: wp('1%'),
    resizeMode: "contain",
  },
  serviceText: {
    fontSize: wp('3%'),
    fontWeight: "bold",
    textAlign: "center",
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
    fontSize: wp('3.2%'),
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
    fontSize: wp('6.5%'),
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    fontFamily: 'Inter_700Bold',
  },
  modalPricing: {
    fontSize: wp('4%'),
    fontWeight: "bold",
    color: "#333333",
    marginTop: hp('0.8%'),
    fontFamily: 'Inter_400Regular',
  },
  modalDescription: {
    fontSize: wp('3.7%'),
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
    fontSize: wp('4%'),
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
  drawerContainer: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: "#fff",
  },
  menuSection: {
    marginVertical: hp('1.2%'),
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
  },
  drawerTextBlue: {
    fontSize: wp('4%'),
    marginLeft: wp('4%'),
    color: "#1580c2",
    fontFamily: 'Inter_400Regular',
  },
  drawerTextYellow: {
    fontSize: wp('4%'),
    marginLeft: wp('4%'),
    color: "#cb9717",
    fontFamily: 'Inter_400Regular',
  },
  drawerIcon: {
    width: wp('11%'),
    height: wp('11%'),
    resizeMode: "contain",
    marginRight: wp('2.5%'),
  },
  signInButton: {
    backgroundColor: "#00aa13",
    paddingVertical: hp('1.8%'),
    borderRadius: wp('2.5%'),
    alignItems: "center",
    marginHorizontal: wp('4%'),
    marginTop: hp('2.5%'),
  },
  signInButtonText: {
    color: "#fff",
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    fontFamily: 'Inter_700Bold',
  },
});

export default GuestScreen;



