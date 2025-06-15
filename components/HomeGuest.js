import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Dimensions, ImageBackground } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

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

// Home Screen UI
function HomeGuestScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#ffef5d', '#7ed597']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Image
          source={require('../assets/cemeteryinfologo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ alignSelf: 'flex-start' }}>
          <Ionicons name="menu" size={28} color="#333" style={{ marginBottom: 30 }} />
        </TouchableOpacity>
        <Text style={styles.welcome}>
          Welcome, <Text style={styles.name}>Guest</Text>
        </Text>
        <Text style={styles.subtitle}>
          This app is a sacred space to honor, remember, and navigate with ease.
        </Text>
      </LinearGradient>

      {/* Cemetery Information */}
      <Text style={styles.sectionTitle}>Cemetery Information</Text>

      {/* Office Hours */}
      <ImageBackground
        source={require('../assets/cemeteryinfobg.png')}
        style={styles.infoCard}
        imageStyle={{ borderRadius: 24 }}
      >
        <Text style={styles.infoTitle}>Cemetery Office Working Hours</Text>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>Tues - Sun</Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>8 AM - 4 PM</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Visiting Hours */}
      <ImageBackground
        source={require('../assets/cemeteryinfobg.png')}
        style={styles.infoCard}
        imageStyle={{ borderRadius: 24 }}
      >
        <Text style={styles.infoTitle}>Cemetery Visiting Hours</Text>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>Mon - Sun</Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>6 AM - 6 PM</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Cemetery Details */}
      <View style={styles.cemeteryCard}>
        <Text style={styles.cemeteryTitle}>St. Joseph Catholic Cemetery</Text>
        <View style={styles.row}>
          <Ionicons name="location-sharp" size={18} color="#4CAF50" />
          <Text style={styles.cemeteryText}>Pulang Lupa I, Las Piñas City</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="phone" size={18} color="#4CAF50" />
          <Text style={styles.cemeteryText}>8-363-23-43</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="smartphone" size={18} color="#4CAF50" />
          <Text style={styles.cemeteryText}>09694204497</Text>
        </View>
      </View>

      {/* Staff */}
      <View style={styles.staffCard}>
        <View style={styles.staffCol}>
          <Text style={styles.staffTitle}>Office Head</Text>
          <View style={styles.row}>
            <Ionicons name="person" size={16} color="#4CAF50" />
            <Text style={styles.staffName}>Conrado B. Torres</Text>
          </View>
        </View>
        <View style={styles.staffCol}>
          <Text style={styles.staffTitle}>Office Assistant</Text>
          <View style={styles.row}>
            <Ionicons name="person" size={16} color="#4CAF50" />
            <Text style={styles.staffName}>Boss Mike</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Drawer Navigator
const Drawer = createDrawerNavigator();

function HomeGuest() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeGuestScreen" component={HomeGuestScreen} />
      {/* Add other screens as needed */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#ffef5d',
    padding: 24,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    marginBottom: 16,
    paddingTop: 90,
  },
  headerLogo: {
    position: 'absolute',
    width: 250,
    height: 250,
    right: -65,
    top: 40,
  },
  welcome: { fontSize: 38, fontWeight: '400', color: '#222' },
  name: { fontWeight: '700', color: '#1e1e1e' },
  subtitle: { fontSize: 16, color: '#444', marginTop: 8, width: '85%' },
  sectionTitle: { marginLeft: 20, marginTop: 16, color: '#888', fontSize: 13 },
  infoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  infoTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSub: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoTime: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cemeteryCard: {
    backgroundColor: '#fff',
    borderColor: '#ffef5d',
    borderWidth: 1,
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  cemeteryTitle: { fontWeight: '700', fontSize: 16, color: '#222', marginBottom: 8 },
  cemeteryText: { marginLeft: 8, color: '#444', fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  staffCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 25,
    borderColor: '#ffef5d',
    borderWidth: 1,
  },
  staffCol: { flex: 1 },
  staffTitle: { fontWeight: '600', color: '#888', marginBottom: 4 },
  staffName: { marginLeft: 6, color: '#222', fontWeight: '500' },

  // --- DrawerLayout Styles from Bookmarks ---
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
    drawerIcon: {
        width: wp('11%'),
        height: wp('11%'),
        resizeMode: 'contain',
        marginRight: wp('2.5%'),
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12, // If gap doesn't work, use marginRight on the first pill
    },
    infoPill: {
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 16,
      paddingHorizontal: 22,
      paddingVertical: 6,
      marginHorizontal: 6,
    },
    infoPillText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    infoDivider: {
      width: '80%',
      height: 2,
      backgroundColor: '#fff',
      opacity: 0.5,
      alignSelf: 'center',
      marginVertical: 1,
      borderRadius: 1,
      marginBottom: 22,
    },
});

export default HomeGuest;