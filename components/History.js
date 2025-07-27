import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Platform, FlatList, Dimensions, ImageBackground, Alert, ScrollView, SectionList, StatusBar, Modal, BackHandler, Button } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const { width, height } = Dimensions.get('window');

// ✅ Custom Drawer Content
const CustomDrawerContent = (props) => {
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
                    // User not found or deleted
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
  source={
    user?.profileImage
      ? { uri: user.profileImage }
      : require('../assets/blankDP.jpg') // <-- fallback local image
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

            {/* Account Removed Modal - New Feature */}
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
        </DrawerContentScrollView>
    );
};

const HISTORY_KEY = 'userHistory';

// ✅ History Screen with Search Functionality
const HistoryScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // <-- Add this line

    // Handle Android hardware back button for logout confirmation
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setShowLogoutModal(true);
            return true;
        });

        return () => backHandler.remove();
    }, []);

    // Save grave to local history (no API)
    const handleGraveClick = async (grave) => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!grave._id) {
                Alert.alert("Error", "Grave data missing _id.");
                return;
            }
            // Save to backend
            const response = await fetch(`${BASE_URL}/api/history`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, grave }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Backend error:", errorText);
                throw new Error("Failed to save history");
            }
            const updatedHistory = await response.json();
            setHistoryList(updatedHistory.map(h => h.grave));

            // Dynamically set graveType
            let graveWithType = { ...grave };
            if (!graveWithType.graveType && graveWithType.category) {
                if (graveWithType.category.includes('Adult')) graveWithType.graveType = 'adult';
                else if (graveWithType.category.includes('Child')) graveWithType.graveType = 'child';
                else if (graveWithType.category.includes('Bone')) graveWithType.graveType = 'bone';
            }

            navigation.navigate('GraveInformation', { grave: graveWithType, origin: 'History' });
        } catch (error) {
            console.error('Error updating history:', error);
        }
    };

    // Load history from local storage
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) return;
                const response = await fetch(`${BASE_URL}/api/history/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch history");
                const history = await response.json();
                setHistoryList(history.map(h => h.grave)); // Extract grave objects
            } catch (error) {
                console.error('Error loading history:', error);
            }
        };
        fetchHistory();
    }, []);

    // Clear local history
    const clearHistory = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;
            await fetch(`${BASE_URL}/api/history/${userId}`, { method: "DELETE" });
            setHistoryList([]);
            Alert.alert('History cleared');
        } catch (error) {
            Alert.alert('Error clearing history');
            console.error('Error clearing history:', error);
        }
    };

    // Function to handle search with email matching
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasSearched(false); // No search performed
            return;
        }
        try {
            // Use the web backend for search to get contact person information
            const webBaseUrl = 'https://walktograveweb-backendserver.onrender.com';
            
            const response = await fetch(`${webBaseUrl}/api/graves/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            
            setSearchResults(data);
            setHasSearched(true); // Search performed
        } catch (error) {
            console.error('Error fetching search results:', error);
            setHasSearched(true); // Even on error, mark as searched to show "No results"
        }
    };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            {/* Logout Confirmation Modal */}
            <Modal
                visible={showLogoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
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
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
                            Are you sure you want to log out?
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <TouchableOpacity
                                style={{ marginRight: 24, padding: 10 }}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={{ color: '#38b6ff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={async () => {
                                    setShowLogoutModal(false);
                                    // Remove userId and navigate to SignIn
                                    await AsyncStorage.removeItem("userId");
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'SignIn' }],
                                    });
                                }}
                            >
                                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Log out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <ImageBackground source={require('../assets/HistoryBgg.png')} style={styles.background}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.topSection}>
                        <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Ionicons
                                name="menu"
                                size={RFValue(24, height)}
                                color="black"
                                style={{ marginLeft: wp('2%'), marginTop: hp('1%') }}
                            />
                        </TouchableOpacity>
                            <View style={styles.imageContainer}></View>
                        </View>

                        {/* Search Bar & Button Row Grouped in White Background */}
                        <View style={{
    backgroundColor: 'white',
    borderRadius: wp('2.5%'),
    marginHorizontal: wp('6%'),
    marginTop: hp('2.2%'),
    marginBottom: 0,
    paddingBottom: 0
}}>
                            <View style={[styles.searchBarContainer, {
        backgroundColor: 'white',
        borderRadius: wp('2.5%'),
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingHorizontal: wp('2.5%'),
        paddingTop: hp('1.2%')
    }]}>
                                <TextInput
                                    style={styles.searchBar}
                                    placeholder="Search by Fullname or Nickname"
                                    placeholderTextColor="gray"
                                    value={searchQuery}
                                    onChangeText={text => {
                                        setSearchQuery(text);
                                        if (text.trim() === '') {
                                            setSearchResults([]);
                                            setHasSearched(false);
                                        }
                                    }}
                                    onFocus={() => setIsSearchFocused(true)}
                                    
                                />
                                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                                    <Ionicons name="search" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            

                            {/* Four Buttons (copied from Bookmarks.js) */}
                            <View style={[styles.buttonRow, {
        backgroundColor: 'transparent',
        borderRadius: 0,
        marginBottom: -hp('3%'),
        paddingHorizontal: wp('2.5%'),
        marginTop: hp('2.5%')
    }]}>
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

                                <View style={styles.IconDivider} />

                                <TouchableOpacity style={styles.actionButton}>
                                    <Image source={require('../assets/CGIcon.png')} style={styles.buttonImage} />
                                </TouchableOpacity>

                                <View style={styles.IconDivider} />

                                <TouchableOpacity style={styles.actionButton}>
                                    <Image source={require('../assets/AGIcon.png')} style={styles.buttonImage} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                            <View style={styles.filterContainer}>
            <Text style={styles.filterText}>History</Text>
        </View>
        <View style={styles.divider} />

                    <View style={{ marginTop: hp('2.2%'), flex: 1 }}>
                        {searchQuery.trim().length === 0 ? (
                            <SectionList
                                sections={[
                                    { title: '', data: historyList, type: 'historyList' }
                                ]}
                                keyExtractor={(item, index) => `${item._id}-${index}`
}
                                renderSectionHeader={({ section }) => (
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                )}
                                renderItem={({ item, section }) => {
                                    const formattedDateOfBirth = item.dateOfBirth
                                        ? new Intl.DateTimeFormat('en-US', {
                                              month: 'long',
                                              day: '2-digit',
                                              year: 'numeric',
                                      }).format(new Date(item.dateOfBirth))
                                        : 'Unknown';

                                    const formattedBurialDate = item.burial
                                        ? new Intl.DateTimeFormat('en-US', {
                                              month: 'long',
                                              day: '2-digit',
                                              year: 'numeric',
                                      }).format(new Date(item.burial))
                                        : 'Unknown';

                                    return (
                                        <TouchableOpacity
                                            style={styles.card}
                                            onPress={() => handleGraveClick(item)}
                                            activeOpacity={0.8}
                                        >
                                            <Image
                                                source={{ uri: item.image ? item.image : 'https://via.placeholder.com/70' }}
                                                style={styles.cardImage}
                                            />
                                            <View style={styles.cardContent}>
                                                <Text
                                                    style={styles.cardTitle}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {item.firstName}
                                                    {item.nickname ? ` '${item.nickname}'` : ''}
                                                    {` ${item.lastName}`}
                                                </Text>
                                                <Text style={styles.cardDates}>{formattedDateOfBirth} - {formattedBurialDate}</Text>
                                                <Text style={styles.cardLocation}>
                                                    {item.phase}, Apartment {item.aptNo}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.cardAction}
                                                onPress={() => {/* your action here */}}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name="return-up-forward" size={16} color="#fff" marginTop="18" />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    );
                                }}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                ListEmptyComponent={() => (
                                    <Text style={styles.noResultsText}>No history found.</Text>
                                )}
                            />
                        ) : hasSearched ? (
                            // Show search results only after searching
                            <SectionList
                                sections={[
                                    { title: '', data: searchResults, type: 'searchResults' }
                                ]}
                                keyExtractor={(item, index) => `${item._id}-${index}`
}
                                renderSectionHeader={({ section }) => (
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                )}
                                renderItem={({ item, section }) => {
                                    const formattedDateOfBirth = item.dateOfBirth
                                        ? new Intl.DateTimeFormat('en-US', {
                                              month: 'long',
                                              day: '2-digit',
                                              year: 'numeric',
                                      }).format(new Date(item.dateOfBirth))
                                        : 'Unknown';

                                    const formattedBurialDate = item.burial
                                        ? new Intl.DateTimeFormat('en-US', {
                                              month: 'long',
                                              day: '2-digit',
                                              year: 'numeric',
                                      }).format(new Date(item.burial))
                                        : 'Unknown';

                                    return (
                                        <TouchableOpacity
                                            style={styles.card}
                                            onPress={() => handleGraveClick(item)}
                                        >
                                            <Image
                                                source={{ uri: item.image ? item.image : 'https://via.placeholder.com/70' }}
                                                style={styles.cardImage}
                                            />
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardTitle}>{item.firstName}{item.nickname ? ` '${item.nickname}'` : ''} {item.lastName}</Text>
                                                <Text style={styles.cardDates}>{formattedDateOfBirth} - {formattedBurialDate}</Text>
                                                <Text style={styles.cardLocation}>
                                                    {item.phase}, Apartment {item.aptNo}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                ListEmptyComponent={() => (
                                    <Text style={styles.noResultsText}>No results found.</Text>
                                )}
                            />
                        ) : null}
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <TouchableOpacity onPress={clearHistory}>
                            <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 16, bottom: hp('2%') }}>
                                Clear History
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </>
    );
};

// ✅ Drawer Navigator (Keeps Layout the Same)
const Drawer = createDrawerNavigator();

const History = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="HistoryScreen" component={HistoryScreen} />
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
        paddingTop: hp('4%'),
    },
    topSection: {
        position: 'relative',
        width: '100%',
    },
    bg: {
        width: '100%',
        height: hp('130%'),
        position: 'absolute',
        top: 0,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp('2.5%'),
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: wp('40%'),
        height: hp('6%'),
        resizeMode: 'contain',
    },
    searchBarContainer: {
        marginHorizontal: wp('2.5%'),
        paddingTop: hp('1.2%'),
        marginTop: hp('2.2%'),
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: wp('1.5%'),
        paddingHorizontal: wp('2.5%'),
    },
    searchBar: {
        flex: 1,
        padding: wp('2.5%'),
        fontSize: RFValue(16, height),
    },
    searchButton: {
        padding: wp('2.5%'),
        borderRadius: wp('1.5%'),
        marginLeft: wp('1.2%'),
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.2%'),
        paddingHorizontal: wp('6%'),
        marginTop: hp('7%'),
    },
    filterText: {
        fontSize: RFValue(18, height),
        color: 'gray',
        marginHorizontal: wp('2.5%'),
    },
    divider: {
        height: 2,
        backgroundColor: 'gray',
        marginHorizontal: wp('9%'),
    },
    content: {
        flex: 1,
        top: '5%',
        paddingHorizontal: wp('4%'),
        backgroundColor: 'white',
        paddingTop: hp('1.2%'),
        
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: hp('1.2%'),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        marginHorizontal: wp('8%'),
    },
    cardImage: {
        width: wp('18%'),
        height: wp('18%'),
        marginRight: wp('2.5%'),
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: RFValue(16, height),
        fontWeight: 'bold',
        color: '#333',
        maxWidth: '95%', // or a fixed value like 180
    },
    cardDates: {
        fontSize: RFValue(11, height),
        color: '#666',
    },
    cardLocation: {
        fontSize: RFValue(9, height),
        color: '#999',
    },
    cardAction: {
        backgroundColor: 'green',
        padding: wp('2%'),
        height: '100%',
        
    },

    buttonRow: {
        bottom: hp('4%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
        marginBottom: hp('1.2%'),
        height: hp('6%'),
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('2.5%'),
        borderRadius: wp('1.5%'),
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: wp('1.2%'),
    },
    buttonImage: {
        width: wp('4.5%'),
        height: wp('4.5%'),
        resizeMode: 'contain',
    },
    IconDivider: {
        height: hp('6%'),
        width: 0.5,
        backgroundColor: 'gray',
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
    sectionTitle: {
        fontSize: RFValue(20, height),
        fontWeight: 'bold',
        color: '#12894f',
        marginVertical: hp('-1%'),
        marginLeft: wp('3%'),
    },
    noResultsText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: hp('30%'),
        fontSize: RFValue(16, height),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: RFValue(18, height),
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: RFValue(14, height),
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#12894f',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: RFValue(16, height),
        fontWeight: 'bold',
    },
    // New styles for email matching functionality
    cardActions: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: wp('2%'),
    },
    memoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('3%'),
        borderRadius: wp('2%'),
        marginTop: hp('0.5%'),
    },
    memoryButtonText: {
        fontSize: RFValue(12, height),
        fontWeight: 'bold',
        marginLeft: wp('1%'),
    },
    contactPersonText: {
        fontSize: RFValue(11, height),
        color: '#666',
        marginTop: hp('0.5%'),
        fontStyle: 'italic',
    },
});

export default History;