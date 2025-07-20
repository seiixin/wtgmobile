import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Dimensions, ImageBackground, RefreshControl} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";
// Backend URL for notifications - now using web backend for service/FAQ notifications
const NOTIFICATION_BASE_URL = "https://walktograveweb-backendserver.onrender.com/api";

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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Function to format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Function to fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Get user data for potential filtering
      const userId = await AsyncStorage.getItem("userId");
      let userEmail = null;
      let userData = null;
      
      console.log('📱 Fetching notifications for user ID:', userId);
      
      if (userId) {
        try {
          const userResponse = await fetch(`${BASE_URL}/api/users/${userId}`);
          if (userResponse.ok) {
            userData = await userResponse.json();
            userEmail = userData.email;
            console.log('👤 User data fetched:', { 
              id: userData._id, 
              name: userData.name, 
              email: userEmail,
              allFields: Object.keys(userData)
            });
          } else {
            console.warn('⚠️ Could not fetch user data, response not ok:', userResponse.status);
          }
        } catch (userError) {
          console.error('❌ Error fetching user data:', userError);
        }
      } else {
        console.warn('⚠️ No user ID found in storage');
      }
      
      console.log('🔔 Fetching notifications from:', `${NOTIFICATION_BASE_URL}/notifications/recent?limit=50`);
      const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications/recent?limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Raw notification response:', data);
        
        // Extract notifications from the response structure
        let notificationsList = data.notifications || data || [];
        console.log('📋 Total notifications received:', notificationsList.length);
        
        // Log each notification for debugging
        notificationsList.forEach((notif, index) => {
          console.log(`📬 Notification ${index + 1}:`, {
            id: notif._id,
            title: notif.title,
            type: notif.type,
            targetUsers: notif.targetUsers,
            contactPersonEmail: notif.contactPersonEmail,
            lotInfo: notif.lotInfo,
            createdAt: notif.createdAt
          });
        });
        
        // TEMPORARY: Show all notifications for debugging
        const DEBUG_MODE = false;
        if (DEBUG_MODE) {
          console.log('🐛 DEBUG MODE: Showing all notifications without filtering');
          setNotifications(notificationsList);
          await AsyncStorage.setItem('notifications', JSON.stringify(notificationsList));
          return;
        }
        
        // Filter notifications for current user
        if (userEmail) {
          console.log('🔍 Filtering notifications for user email:', userEmail);
          
          const originalCount = notificationsList.length;
          notificationsList = notificationsList.filter(notif => {
            // For grave-related notifications, only show if user is the specific contact person
            if (notif.type && notif.type.includes('grave')) {
              // Check if user is the contact person (root level)
              if (notif.contactPersonEmail && notif.contactPersonEmail.toLowerCase() === userEmail.toLowerCase()) {
                console.log(`✅ Including grave notification for contact person (root): ${notif.title} (${notif.contactPersonEmail})`);
                return true;
              }
              
              // Check if user is the contact person (in graveInfo)
              if (notif.graveInfo && notif.graveInfo.contactPersonEmail && notif.graveInfo.contactPersonEmail.toLowerCase() === userEmail.toLowerCase()) {
                console.log(`✅ Including grave notification for contact person (graveInfo): ${notif.title} (${notif.graveInfo.contactPersonEmail})`);
                return true;
              }
              
              // Exclude grave notifications not meant for this specific user
              console.log(`❌ Excluding grave notification not for this user: ${notif.title} (contactEmail: ${notif.contactPersonEmail || notif.graveInfo?.contactPersonEmail})`);
              return false;
            }
            
            // For private lot notifications, only show if user is the specific owner
            if (notif.type && notif.type.includes('lot')) {
              if (notif.lotInfo && notif.lotInfo.email && notif.lotInfo.email.toLowerCase() === userEmail.toLowerCase()) {
                console.log(`✅ Including lot notification for owner: ${notif.title} (${notif.lotInfo.email})`);
                return true;
              }
              
              // Check root level contactPersonEmail for lot notifications too
              if (notif.contactPersonEmail && notif.contactPersonEmail.toLowerCase() === userEmail.toLowerCase()) {
                console.log(`✅ Including lot notification for contact person (root): ${notif.title} (${notif.contactPersonEmail})`);
                return true;
              }
              
              // Exclude lot notifications not meant for this specific user
              console.log(`❌ Excluding lot notification not for this user: ${notif.title} (ownerEmail: ${notif.lotInfo?.email || notif.contactPersonEmail})`);
              return false;
            }
            
            // For memorial notifications, only show if user is the one who submitted the memorial
            if (notif.type && notif.type.includes('memorial')) {
              if (notif.contactPersonEmail && notif.contactPersonEmail.toLowerCase() === userEmail.toLowerCase()) {
                console.log(`✅ Including memorial notification for submitter: ${notif.title} (${notif.contactPersonEmail})`);
                return true;
              }
              
              // Exclude memorial notifications not meant for this specific user
              console.log(`❌ Excluding memorial notification not for this user: ${notif.title} (submitterEmail: ${notif.contactPersonEmail})`);
              return false;
            }
            
            // For service and FAQ notifications, show only general ones (targetUsers: 'all')
            if (notif.type && (notif.type.includes('service') || notif.type.includes('faq'))) {
              if (notif.targetUsers === 'all') {
                console.log(`✅ Including general service/FAQ notification: ${notif.title}`);
                return true;
              } else {
                console.log(`❌ Excluding specific service/FAQ notification: ${notif.title}`);
                return false;
              }
            }
            
            // For other general notifications, show only those marked for all users
            if (notif.targetUsers === 'all') {
              console.log(`✅ Including general notification: ${notif.title}`);
              return true;
            }
            
            // Default: don't show specific notifications not meant for this user
            console.log(`❌ Excluding specific notification: ${notif.title} (targetUsers: ${notif.targetUsers})`);
            return false;
          });
          
          console.log(`🎯 Filtered notifications: ${originalCount} → ${notificationsList.length}`);
        } else {
          console.log('⚠️ No user email available, showing all notifications');
          // If no user email, still show general notifications and log what we're missing
          notificationsList = notificationsList.filter(notif => {
            if (notif.targetUsers === 'all') {
              return true;
            }
            console.log(`❌ Cannot show specific notification without user email: ${notif.title}`);
            return false;
          });
        }
        
        setNotifications(notificationsList);
        console.log('💾 Notifications set in state:', notificationsList.length);
        
        // Store notifications locally
        await AsyncStorage.setItem('notifications', JSON.stringify(notificationsList));
      } else {
        console.error('❌ Failed to fetch notifications, status:', response.status);
        // Fallback to local storage
        const localNotifications = await AsyncStorage.getItem('notifications');
        if (localNotifications) {
          const parsed = JSON.parse(localNotifications);
          setNotifications(parsed);
          console.log('📂 Loaded from local storage:', parsed.length);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      // Fallback to local storage
      try {
        const localNotifications = await AsyncStorage.getItem('notifications');
        if (localNotifications) {
          const parsed = JSON.parse(localNotifications);
          setNotifications(parsed);
          console.log('📂 Fallback to local storage:', parsed.length);
        }
      } catch (storageError) {
        console.error('❌ Error loading local notifications:', storageError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Function to get notification icon based on type
  const getNotificationIcon = (type, category) => {
    // Handle both web backend types (service_added, service_updated) and mobile types (service)
    if (type?.includes('service') || category?.includes('Services')) {
      return require('../assets/servicesIcon.png');
    }
    if (type?.includes('faq') || category?.includes('FAQ')) {
      return require('../assets/aboutIcon.png');
    }
    if (type?.includes('grave') || category?.includes('Grave Management')) {
      return require('../assets/CrIcon.png'); // Use cemetery/grave icon
    }
    if (type?.includes('lot') || category?.includes('Private Lot Management')) {
      return require('../assets/CrIcon.png'); // Use cemetery icon for private lots too
    }
    if (type === 'system') {
      return require('../assets/notificationIcon.png');
    }
    return require('../assets/notificationIcon.png');
  };

  // Function to get notification color based on type
  const getNotificationColor = (type) => {
    // Handle both web backend types (service_added, service_updated) and mobile types (service)
    if (type?.includes('service')) {
      return '#cb9717'; // Yellow
    }
    if (type?.includes('faq')) {
      return '#1580c2'; // Blue
    }
    if (type?.includes('grave')) {
      return '#8B4513'; // Brown for grave management
    }
    if (type?.includes('lot')) {
      return '#8B4513'; // Brown for private lot management
    }
    if (type === 'system') {
      return '#12894f'; // Green
    }
    return '#888'; // Gray
  };

  // Load notifications on component mount and when focused
  useEffect(() => {
    fetchNotifications();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // Fallback static notifications if no backend notifications available
  const staticNotifications = [
    {
      id: 1,
      type: 'prayer',
      avatar: require('../assets/blankDP.jpg'),
      name: 'Mary Febe',
      message: 'has offered a prayer for Erica Coles.',
      time: '10 minutes ago',
    },
    {
      id: 2,
      type: 'candle',
      avatar: require('../assets/blankDP.jpg'),
      name: 'Shane Doe',
      message: 'has lit a virtual candle for Maxeen Perez',
      time: '10 minutes ago',
    },
    {
      id: 3,
      type: 'warning',
      icon: require('../assets/blankDP.jpg'),
      message: (
        <>
          The burial of <Text style={{ fontWeight: 'bold' }}>Erica Coles</Text> is nearing its expiration date. Kindly visit the office on-site to process the renewal and avoid removal.
        </>
      ),
      time: '10 minutes ago',
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : staticNotifications;

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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#12894f']}
            tintColor="#12894f"
          />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : displayNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-none" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>Check back later for updates</Text>
          </View>
        ) : (
          displayNotifications.map((notif, idx) => (
            <View key={notif._id || notif.id} style={styles.card}>
              <View style={styles.cardRow}>
                {/* Backend notifications */}
                {notif._id ? (
                  <>
                    <View style={styles.iconContainer}>
                      <Image 
                        source={getNotificationIcon(notif.type, notif.category)} 
                        style={[styles.notificationIcon, { borderColor: getNotificationColor(notif.type) }]} 
                      />
                      {/* High priority indicator */}
                      {notif.priority === 'high' && (
                        <View style={styles.priorityBadge}>
                          <MaterialIcons name="priority-high" size={12} color="#fff" />
                        </View>
                      )}
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{notif.title}</Text>
                      <Text style={styles.cardText}>{notif.message}</Text>
                      
                      {/* Show grave information for grave notifications */}
                      {notif.graveInfo && (
                        <View style={styles.graveInfoContainer}>
                          <Text style={styles.graveInfoText}>
                            <Text style={styles.boldName}>Grave:</Text> {notif.graveInfo.firstName} {notif.graveInfo.lastName}
                          </Text>
                          {notif.graveInfo.phase && notif.graveInfo.aptNo && (
                            <Text style={styles.graveInfoText}>
                              <Text style={styles.boldName}>Location:</Text> {notif.graveInfo.phase} {notif.graveInfo.aptNo}
                            </Text>
                          )}
                          {notif.graveInfo.category && (
                            <Text style={styles.graveInfoText}>
                              <Text style={styles.boldName}>Category:</Text> {notif.graveInfo.category.charAt(0).toUpperCase() + notif.graveInfo.category.slice(1)}
                            </Text>
                          )}
                        </View>
                      )}
                      
                      {/* Show private lot information for lot notifications */}
                      {notif.lotInfo && (
                        <View style={styles.graveInfoContainer}>
                          <Text style={styles.graveInfoText}>
                            <Text style={styles.boldName}>Owner:</Text> {notif.lotInfo.ownerFullName}
                          </Text>
                          {notif.lotInfo.phaseBlock && notif.lotInfo.lotNo && (
                            <Text style={styles.graveInfoText}>
                              <Text style={styles.boldName}>Location:</Text> {notif.lotInfo.phaseBlock} {notif.lotInfo.lotNo}
                            </Text>
                          )}
                          {notif.lotInfo.email && (
                            <Text style={styles.graveInfoText}>
                              <Text style={styles.boldName}>Contact:</Text> {notif.lotInfo.email}
                            </Text>
                          )}
                        </View>
                      )}
                      
                      {/* Show contact person email for grave notifications */}
                      {(notif.contactPersonEmail || notif.graveInfo?.contactPersonEmail) && notif.type?.includes('grave') && (
                        <Text style={styles.contactPersonText}>
                          <Text style={styles.boldName}>Contact Person:</Text> {notif.contactPersonEmail || notif.graveInfo?.contactPersonEmail}
                        </Text>
                      )}
                      
                      {(notif.adminId?.fullName || notif.adminName) && (
                        <Text style={styles.adminText}>
                          Updated by: <Text style={styles.boldName}>{notif.adminId?.fullName || notif.adminName}</Text>
                        </Text>
                      )}
                      <Text style={styles.timeText}>{formatTimeAgo(notif.createdAt)}</Text>
                    </View>
                  </>
                ) : (
                  /* Static notifications fallback */
                  <>
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
                  </>
                )}
              </View>
              {idx !== displayNotifications.length - 1 && <View style={styles.divider} />}
            </View>
          ))
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    padding: 8,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  priorityBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  adminText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  graveInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#8B4513',
  },
  graveInfoText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  contactPersonText: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '500',
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