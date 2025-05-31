import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, FlatList, Dimensions, SectionList, ImageBackground, Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, ScrollView, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import WaveCurve from './WaveCurve';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');
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
                              : require('../assets/blankDP.jpg') // fallback local image
                          }
                        style={styles.profileImage}
                    />
                    <View style={{ marginLeft: wp('4%') }}>
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
                            <MaterialIcons name="edit" size={RFValue(16, height)} color="green" />
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    const [hasSearched, setHasSearched] = useState(false); // Add this state
    const [bookmarks, setBookmarks] = useState([]); // Add bookmarks state

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasSearched(false); // No search performed
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/graves/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data);
            setHasSearched(true); // Search performed
        } catch (error) {
            console.error('Error fetching search results:', error);
            setHasSearched(true); // Even on error, mark as searched to show "No results"
        }
    };

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const storedBookmarks = await AsyncStorage.getItem('bookmarks');
                const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
                setBookmarks(bookmarks); // Set bookmarks state
                setSearchResults(bookmarks); // Use searchResults to display bookmarks
            } catch (error) {
                console.error('Error loading bookmarks:', error);
            }
        };

        const unsubscribe = navigation.addListener('focus', loadBookmarks); // Reload bookmarks when screen is focused

        return unsubscribe; // Cleanup the listener on unmount
    }, [navigation]);

    const handleResultCardClick = async (grave) => {
        try {
            // Get current history list from AsyncStorage
            const data = await AsyncStorage.getItem('historyList');
            let historyList = data ? JSON.parse(data) : [];

            // Remove if already exists, then add to top
            historyList = historyList.filter(item => item._id !== grave._id);
            historyList = [grave, ...historyList];

            // Save updated history list
            await AsyncStorage.setItem('historyList', JSON.stringify(historyList));
        } catch (error) {
            console.error('Error updating history list:', error);
        }

        // Reset search state
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);

        navigation.navigate('GraveInformation', { grave });
    };

    return (
        <ImageBackground source={require('../assets/HistoryBgg.png')} style={styles.background}>
                <View style={styles.container}>
                    {/* Background & Header */}
                    <View style={styles.topSection}>
    <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons
                name="menu"
                size={24}
                color="black"
                style={{ marginLeft: width * 0.02, marginTop: height * 0.01 }}
            />
        </TouchableOpacity>
        <View style={styles.imageContainer}></View>
    </View>

    {/* Search Bar & Button Row Grouped in White Background */}
    <View style={{ backgroundColor: 'white', borderRadius: 10, marginHorizontal: 10, marginTop: 18, marginBottom: 0, paddingBottom: 0 }}>
        <View style={[styles.searchBarContainer, { backgroundColor: 'white', borderRadius: 10, marginHorizontal: 0, marginTop: 0, marginBottom: 0, paddingHorizontal: 10, paddingTop: 10 }]}>
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
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
        </View>
        <View style={styles.divider3} />

        {/* Four Buttons */}
        <View style={[styles.buttonRow, { backgroundColor: 'transparent', borderRadius: 0, marginBottom: -20, paddingHorizontal: 10, marginTop: 25 }]}>
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
    </View>
</View>


{searchQuery.trim().length === 0 ? (
    // Show bookmarks list when search bar is empty
    <SectionList
        style={{ marginTop: 26 }}
        sections={[
            { title: '', data: [...bookmarks].reverse(), type: 'bookmarks' } // Reverse for latest first
        ]}
        keyExtractor={(item, index) => `${item._id || item.id}-${index}`}
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
                    onPress={() => navigation.navigate('GraveInformation', { grave: item })}
                >
                    <Image
                        source={{ uri: item.image ? item.image : 'https://via.placeholder.com/70' }}
                        style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>
                            {item.firstName}{item.nickname ? ` '${item.nickname}'` : ''} {item.lastName}
                        </Text>
                        <Text style={styles.cardDates}>
                            {formattedDateOfBirth} - {formattedBurialDate}
                        </Text>
                        <Text style={styles.cardLocation}>
                            {item.phase}, Apartment {item.aptNo}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
            <Text style={styles.noResultsText}>No bookmarks found.</Text>
        )}
    />
) : hasSearched ? (
    // Show search results only after searching
    <SectionList
        style={{ marginTop: 26 }}
        sections={[
            { title: '', data: searchResults, type: 'searchResults' }
        ]}
        keyExtractor={(item, index) => `${item._id || item.id}-${index}`}
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
                    onPress={() => handleResultCardClick(item)}
                >
                    <Image
                        source={{ uri: item.image ? item.image : 'https://via.placeholder.com/70' }}
                        style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>
                            {item.firstName}{item.nickname ? ` '${item.nickname}'` : ''} {item.lastName}
                        </Text>
                        <Text style={styles.cardDates}>
                            {formattedDateOfBirth} - {formattedBurialDate}
                        </Text>
                        <Text style={styles.cardLocation}>
                            {item.phase}, Apartment {item.aptNo}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }}
        contentContainerStyle={{ paddingBottom: 100 }} // Match History.js
        ListEmptyComponent={() => (
            <Text style={styles.noResultsText}>No results found.</Text>
        )}
    />
) : null}
                </View>
            </ImageBackground>
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
        backgroundColor: 'green',
        borderRadius: wp('1.5%'),
        marginLeft: wp('1.2%'),
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.2%'),
        paddingHorizontal: wp('6%'),
    },
    filterText: {
        fontSize: RFValue(18, height),
        color: 'green',
    },
    filterButton: {
        padding: wp('2%'),
        borderRadius: wp('1.5%'),
        backgroundColor: '#fff',
    },
    divider: {
        height: 2,
        backgroundColor: 'green',
        marginBottom: hp('2.5%'),
        marginTop: -hp('0.6%'),
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
        borderRadius: wp('2.5%'),
        marginBottom: hp('1.2%'),
        padding: wp('2.5%'),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cardImage: {
        width: wp('18%'),
        height: wp('18%'),
        borderRadius: wp('2.5%'),
        marginRight: wp('2.5%'),
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: RFValue(18, height),
        fontWeight: 'bold',
        color: '#333',
    },
    cardDates: {
        fontSize: RFValue(15, height),
        color: '#666',
    },
    cardLocation: {
        fontSize: RFValue(13, height),
        color: '#999',
    },
    cardAction: {
        backgroundColor: 'green',
        padding: wp('2%'),
        borderRadius: wp('2%'),
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
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
    },
    IconDivider: {
        height: hp('6%'),
        width: 0.5,
        backgroundColor: 'gray',
    },
    divider3: {
        height: 0.5,
        width: '85%',
        backgroundColor: 'gray',
        marginHorizontal: wp('9%'),
        bottom: hp('3.5%'),
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
        marginVertical: hp('1%'),
        marginLeft: wp('3%'),
    },
    noResultsText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: hp('30%'),
        fontSize: RFValue(16, height),
    },
});

export default Bookmarks;
