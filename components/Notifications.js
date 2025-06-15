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

function NotificationsScreen() {
  const navigation = useNavigation();

  const notifications = [
    {
      id: 1,
      type: 'prayer',
      avatar: require('../assets/blankDP.jpg'), // Replace with your avatar image
      name: 'Mary Febe',
      message: 'has offered a prayer for Erica Coles.',
      time: '10 minutes ago',
    },
    {
      id: 2,
      type: 'candle',
      avatar: require('../assets/blankDP.jpg'), // Replace with your avatar image
      name: 'Shane Doe',
      message: 'has lit a virtual candle for Maxeen Perez',
      time: '10 minutes ago',
    },
    {
      id: 3,
      type: 'warning',
      icon: require('../assets/blankDP.jpg'), // Replace with your warning icon
      message: (
        <>
          The burial of <Text style={{ fontWeight: 'bold' }}>Erica Coles</Text> is nearing its expiration date. Kindly visit the office on-site to process the renewal and avoid removal.
        </>
      ),
      time: '10 minutes ago',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ffef5d', '#7ed597']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBg}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Notifications</Text>
          <TouchableOpacity>
            <MaterialIcons name="tune" size={28} color="#222" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.map((notif, idx) => (
          <View key={notif.id} style={styles.card}>
            <View style={styles.cardRow}>
              {notif.type === 'warning' ? (
                <Image source={notif.icon} style={styles.warningIcon} />
              ) : (
                <Image source={notif.avatar} style={styles.avatar} />
              )}
              <View style={styles.cardContent}>
                {notif.type === 'warning' ? (
                  <Text style={styles.warningText}>{notif.message}</Text>
                ) : (
                  <Text style={styles.cardText}>
                    <Text style={styles.boldName}>{notif.name}</Text> {notif.message}
                  </Text>
                )}
                <Text style={styles.timeText}>{notif.time}</Text>
              </View>
            </View>
            {idx !== notifications.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// --- Drawer Navigator wrapper ---
const Drawer = createDrawerNavigator();

function Notifications() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="NotificationsScreen" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBg: {
    width: '100%',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingTop: 18,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 2,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#fffbe6',
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  boldName: {
    fontWeight: 'bold',
    color: '#222',
  },
  warningText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 12,
    marginLeft: 56,
  },
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
});

export default Notifications;