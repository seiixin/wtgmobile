import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Dimensions, ImageBackground} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

// Custom Drawer Content (top-level)
function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [accountRemovedModal, setAccountRemovedModal] = useState(false);

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
      } catch (error) {}
    };
    intervalId = setInterval(checkUserExists, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            await AsyncStorage.removeItem("userId");
            navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
          }
        }
      ],
      { cancelable: false }
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
        .catch(error => {});
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
                : require('../assets/blankDP.jpg')
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

        {/* <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('RequestedServices')}>
          <Image source={require('../assets/requestedServicesIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextBlue}>Requested Services</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('FAQs')}>
          <Image source={require('../assets/aboutIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextBlue}>FAQs</Text>
        </TouchableOpacity>

      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <FontAwesome name="sign-out" size={24} color="black" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// Home Screen UI
function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  const [cemeteryInfo, setCemeteryInfo] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/cemeteryinfo`)
      .then(res => res.json())
      .then(data => setCemeteryInfo(data))
      .catch(() => setCemeteryInfo(null));
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`${BASE_URL}/api/users/${userId}`);
          const data = await response.json();
          const fullName = data.name || '';
          const firstName = fullName.split(' ')[0];
          setUserName(firstName);
        }
      } catch (error) {
        setUserName('');
      }
    };
    fetchUserName();
  }, []);

  function abbreviateDays(daysStr) {
    if (!daysStr) return '';
    // Split by '-', trim, abbreviate, and join back
    return daysStr
      .split('-')
      .map(day => {
        const trimmed = day.trim();
        // Only abbreviate if it's a day name
        if (trimmed.length >= 3) {
          return trimmed.slice(0, 3) + '.';
        }
        return trimmed;
      })
      .join(' - ');
  }

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
          Welcome, <Text style={styles.name}>{userName || '...'}</Text>
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
            <Text style={styles.infoPillText}>
            {cemeteryInfo ? abbreviateDays(cemeteryInfo.officeDays) : '...'}
            </Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>
              {cemeteryInfo ? cemeteryInfo.officeHours : '...'}
            </Text>
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
            <Text style={styles.infoPillText}>
            {cemeteryInfo ? abbreviateDays(cemeteryInfo.visitingDays) : '...'}
            </Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>
              {cemeteryInfo ? cemeteryInfo.visitingHours : '...'}
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* Cemetery Details */}
      <View style={styles.cemeteryCard}>
        <Text style={styles.cemeteryTitle}>
          {cemeteryInfo ? cemeteryInfo.cemeteryName : '...'}
        </Text>
        <View style={styles.row}>
          <Ionicons name="location-sharp" size={18} color="#4CAF50" />
          <Text style={styles.cemeteryText}>
            {cemeteryInfo ? cemeteryInfo.address : '...'}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="phone" size={18} color="#4CAF50" />
          <Text style={styles.cemeteryText}>
            {cemeteryInfo ? cemeteryInfo.telephone : '...'}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="smartphone" size={18} color="#4CAF50" />
          <Text style={styles.cemeteryText}>
            {cemeteryInfo ? cemeteryInfo.mobile : '...'}
          </Text>
        </View>
      </View>

      {/* Staff */}
      <View style={styles.staffCard}>
        <View style={styles.staffCol}>
          <Text style={styles.staffTitle}>Office Head</Text>
          <View style={styles.row}>
            <Ionicons name="person" size={16} color="#4CAF50" />
            <Text style={styles.staffName}>
              {cemeteryInfo ? cemeteryInfo.officeHead : '...'}
            </Text>
          </View>
        </View>
        <View style={styles.staffCol}>
          <Text style={styles.staffTitle}>Office Assistant</Text>
          <View style={styles.row}>
            <Ionicons name="person" size={16} color="#4CAF50" />
            <Text style={styles.staffName}>
              {cemeteryInfo ? cemeteryInfo.adminAssistant : '...'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Drawer Navigator
const Drawer = createDrawerNavigator();

function Home() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
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
  subtitle: { fontSize: 16, color: '#444', marginTop: 8,width: '85%' },
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

export default Home;