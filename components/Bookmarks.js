import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, FlatList, Dimensions, ImageBackground, Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import WaveCurve from './WaveCurve';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";


const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
// Inside the CustomDrawerContent component
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
                            routes: [{ name: 'GetStarted' }], // Navigate to SignIn
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

    // ✅ Fetch user data whenever the drawer is focused (opened)
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
        }, []) // Empty dependency ensures it re-runs when focused
    );

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Text style={styles.profileName}>{user?.name || "Loading..."}</Text>
                <Text style={styles.profileLocation}>{user?.city || "Loading..."}</Text>
                <TouchableOpacity 
                    style={styles.editProfileButton} 
                    onPress={() => navigation.navigate('EditProfile')} // Navigate to ProfileScreen
                >
                    <MaterialIcons name="edit" size={16} color="green" />
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Drawer Items */}
            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('MainTabs', { screen: 'HistoryTab' })}>
                    <Image source={require('../assets/homeIcon.png')} style={styles.drawerIcon} />
                    <Text style={styles.drawerTextGreen}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('MainTabs', { screen: 'BookmarksTab' })}>
                    <Image source={require('../assets/bookmarkIcon.png')} style={styles.drawerIcon} />
                    <Text style={styles.drawerTextYellow}>Bookmarks</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('MainTabs', { screen: 'PrayersTab' })}>
                    <Image source={require('../assets/prayersIcon.png')} style={styles.drawerIcon} />
                    <Text style={styles.drawerTextYellow}>Prayers for the Deceased</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Services')}>
                    <Image source={require('../assets/servicesIcon.png')} style={styles.drawerIcon} />
                    <Text style={styles.drawerTextYellow}>Services & Maintenance</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('RequestedServices')}>
                    <Image source={require('../assets/requestedServicesIcon.png')} style={styles.drawerIcon} />
                    <Text style={styles.drawerTextBlue}>Requested Services</Text>
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
};


const data = [
    { id: '1', name: "Leo 'Mang Boy' Solomon", date1: "January 01, 1965", date2: "December 15, 2025", dates: "January 01, 1965 - December 15, 2025", location: "Apartment 2 | Place 12 | Block 6 | Row 28", image: require('../assets/grave1.png') },
    { id: '2', name: "Maria Fe 'Mari Fe' De Leon", date1: "July 31, 1960", date2: "September 23, 2025", dates: "July 31, 1960 - September 23, 2025", location: "Apartment 2 | Place 12 | Block 6 | Row 28", image: require('../assets/grave1.png') },
];

const BookmarksScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Bookmarks'); // Add selectedTab state

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]); // Clear search results if the search bar is empty
            return;
        }

        try {
            console.log('Search Query:', searchQuery); // Log the search query
            const response = await fetch(`${BASE_URL}/api/graves/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            console.log('Search Results:', data); // Log the results
            setSearchResults(data); // Update the search results state
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const storedBookmarks = await AsyncStorage.getItem('bookmarks');
                const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
                setSearchResults(bookmarks); // Use searchResults to display bookmarks
            } catch (error) {
                console.error('Error loading bookmarks:', error);
            }
        };

        const unsubscribe = navigation.addListener('focus', loadBookmarks); // Reload bookmarks when screen is focused

        return unsubscribe; // Cleanup the listener on unmount
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/HistoryBg.png')}
                style={styles.background}
            >
                <View style={styles.container}>
                    {/* Background & Header */}
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Ionicons name="menu" size={24} color="black" />
                        </TouchableOpacity>
                        <View style={styles.imageContainer}></View>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search by Firstname or Lastname"
                            placeholderTextColor="gray"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Ionicons name="search" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider3} />

                    {/* Four Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Image source={require('../assets/OfficeIcon.png')} style={styles.buttonImage} />
                        </TouchableOpacity>

                        <View style={styles.IconDivider} />

                        <TouchableOpacity style={styles.actionButton}>
                            <Image source={require('../assets/CrIcon.png')} style={styles.buttonImage} />
                        </TouchableOpacity>

                        <View style={styles.IconDivider} />

                        <TouchableOpacity style={styles.actionButton}>
                            <Image source={require('../assets/ChapelIcon.png')} style={styles.buttonImage} />
                        </TouchableOpacity>

                        <View style={styles.IconDivider} />

                        <TouchableOpacity style={styles.actionButton}>
                            <Image source={require('../assets/GateIcon.png')} style={styles.buttonImage} />
                        </TouchableOpacity>
                    </View>

                    {/* Wave Background */}
                    <View style={styles.waveContainer}>
                        <WaveCurve color="#fff" />
                    </View>

                    {/* Content Area */}
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate('GraveInformation', { grave: item })}
                            >
                                <Image
                                    source={{ uri: item.image ? item.image : 'https://via.placeholder.com/70' }}
                                    style={styles.cardImage}
                                />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{item.firstName}{item.nickname ? ` '${item.nickname}'` : ''} {item.lastName}</Text>
                                    <Text style={styles.cardDates}>
                                        {item.dateOfBirth
                                            ? new Intl.DateTimeFormat('en-US', {
                                                  month: 'long',
                                                  day: '2-digit',
                                                  year: 'numeric',
                                              }).format(new Date(item.dateOfBirth))
                                            : 'Unknown'} - 
                                        {item.burial
                                            ? new Intl.DateTimeFormat('en-US', {
                                                  month: 'long',
                                                  day: '2-digit',
                                                  year: 'numeric',
                                              }).format(new Date(item.burial))
                                            : 'Unknown'}
                                    </Text>
                                    <Text style={styles.cardLocation}>
                                        {item.phase}, Apartment {item.aptNo}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <Text style={styles.noResultsText}>No bookmarks found.</Text>
                        )}
                        contentContainerStyle={{ paddingBottom: 60 }} // Ensure proper spacing
                    />

                    {/* Bottom Navigation */}
                    <View style={styles.bottomNav}>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => {
                                setSelectedTab('History'); // Update selectedTab state
                                navigation.navigate('MainTabs', { screen: 'HistoryTab' });
                            }}
                        >
                            <Ionicons
                                name="time"
                                size={24}
                                color={selectedTab === 'History' ? 'green' : 'gray'}
                            />
                            <Text style={{ color: selectedTab === 'History' ? 'green' : 'gray' }}>History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => {
                                setSelectedTab('Bookmarks'); // Update selectedTab state
                                navigation.navigate('MainTabs', { screen: 'BookmarksTab' });
                            }}
                        >
                            <Ionicons
                                name="bookmark"
                                size={24}
                                color={selectedTab === 'Bookmarks' ? 'green' : 'gray'}
                            />
                            <Text style={{ color: selectedTab === 'Bookmarks' ? 'green' : 'gray' }}>Bookmarks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => {
                                setSelectedTab('Prayers'); // Update selectedTab state
                                navigation.navigate('MainTabs', { screen: 'PrayersTab' });
                            }}
                        >
                            <Ionicons
                                name="heart"
                                size={24}
                                color={selectedTab === 'Prayers' ? 'green' : 'gray'}
                            />
                            <Text style={{ color: selectedTab === 'Prayers' ? 'green' : 'gray' }}>Prayers</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

// ✅ Drawer Navigator (Keeps Layout the Same)
const Drawer = createDrawerNavigator();

const Bookmarks = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Bookmarks" component={BookmarksScreen} />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute', // Ensure it stays in place
    top: 0,
    left: 0,
    resizeMode: 'cover', // Ensure it scales properly
},
container: {
    flex: 1,
    paddingTop: 20,
},
topSection: {
    position: 'relative',
    width: '100%',
},
bg: {
    width: '100%',
    height: '130%',
    position: 'absolute',
    top: 0,
},
topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
},
imageContainer: {
    flex: 1,
    alignItems: 'center',
},
image: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
},
searchBarContainer: {
    marginHorizontal: 10,
    paddingTop: 10,
    marginBottom: 40,
    marginTop: 18,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    
},
searchBar: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
},
searchButton: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    marginLeft: 10,
},
waveContainer: {
    position: 'absolute',
    top: '35%',
    width: screenWidth,
    left: 0,
    right: 0,
},
filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 25,
},
filterText: {
    fontSize: 20,
    color: 'green',
},
filterButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
},
divider: {
    height: 2,
    backgroundColor: 'green',
    marginBottom: 20,
    marginTop: -5,
},
content: {
    flex: 1,
    top: '5%',
    paddingHorizontal: 15,
    backgroundColor: 'white',
},
card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
},
cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
},
cardContent: {
    flex: 1,
},
cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
},
cardDates: {
    fontSize: 14,
    color: '#666',
},
cardLocation: {
    fontSize: 12,
    color: '#999',
},
cardAction: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 8,
},
bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: -8 }, // Shadow above the nav bar
    shadowOpacity: 0.4,
    shadowRadius: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
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
    height: 40,


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
    width: 18,
    height: 18,
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
    padding: 20,
    backgroundColor: '#fff',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100
},
profileSection: {
    alignItems: 'center',
    marginBottom: 20,
},
profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
},
profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
},
profileLocation: {
    fontSize: 14,
    color: '#555',
},
editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
},
editProfileText: {
    fontSize: 14,
    color: 'green',
    marginLeft: 5,
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
drawerTextGreen: {
    fontSize: 16,
    marginLeft: 15,
    color: '#12894f',
},
drawerTextYellow: {
    fontSize: 16,
    marginLeft: 15,
    color: '#cb9717',
},
drawerTextBlue: {
    fontSize: 16,
    marginLeft: 15,
    color: '#1580c2',
},
signOutSection: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
    paddingBottom:40
},
signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
},
signOutText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
},
drawerIcon: {
    width: 40,  // Set width
    height: 40, // Set height
    resizeMode: 'contain', // Make sure it scales properly
    marginRight: 10, // Add spacing between icon and text
},
noResultsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    fontSize: 16,
},
});

export default Bookmarks;
