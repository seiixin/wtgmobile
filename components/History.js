import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Platform, FlatList, Dimensions, ImageBackground, Alert, ScrollView, SectionList } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const { width, height } = Dimensions.get('window');

// ✅ Custom Drawer Content
const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);

    

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

// ✅ History Screen with Search Functionality
const HistoryScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [historyList, setHistoryList] = useState([]); // Ensure this is initialized as an empty array
    const [hasSearched, setHasSearched] = useState(false); // Add this state
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    
    const handleGraveClick = async (grave) => {
        try {
            // Get current history list from AsyncStorage
            const data = await AsyncStorage.getItem('historyList');
            let historyList = data ? JSON.parse(data) : [];

            // Remove if already exists, then add to top
            historyList = historyList.filter(item => item._id !== grave._id);
            historyList = [grave, ...historyList];

            // Save updated history list
            await AsyncStorage.setItem('historyList', JSON.stringify(historyList));
            setHistoryList(historyList); // Update local state
        } catch (error) {
            console.error('Error updating history list:', error);
        }

        // Reset search state after clicking a result
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);

        navigation.navigate('GraveInformation', { grave });
    };

    // Function to handle search
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
        AsyncStorage.getItem('historyList')
            .then((data) => {
                if (data) {
                    const parsedData = JSON.parse(data);
                    // Remove duplicates based on `_id`
                    const uniqueData = parsedData.filter(
                        (item, index, self) =>
                            index === self.findIndex((t) => t._id === item._id)
                    );
                    console.log('Cleaned History Data:', uniqueData);
                    setHistoryList(uniqueData);
                    // Save the cleaned data back to AsyncStorage
                    AsyncStorage.setItem('historyList', JSON.stringify(uniqueData));
                }
            })
            .catch((error) => console.error('Error loading history:', error));
    }, []);

    useEffect(() => {
        console.log('History List Updated:', historyList.map(item => ({
            ...item,
            image: item.image ? item.image.substring(0, 50) + '...' : 'No image',
        })));
    }, [historyList]);

    return (
        <ImageBackground source={require('../assets/HistoryBgg.png')} style={styles.background}>
            <View style={styles.container}>
                {/* Header */}
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
                                onFocus={() => setIsSearchFocused(true)}
                                
                            />
                            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                                <Ionicons name="search" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        

                        {/* Four Buttons (copied from Bookmarks.js) */}
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

                {/* Only show SectionList if search bar is empty OR search has been performed */}
                {searchQuery.trim().length === 0 ? (
                    // Show history list when search bar is not focused or empty
                    <SectionList
                        style={{ marginTop: 26 }}
                        sections={[
                            { title: '', data: historyList, type: 'historyList' }
                        ]}
                        keyExtractor={(item, index) => `${item._id}-${index}`}
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
                            <Text style={styles.noResultsText}>No history found.</Text>
                        )}
                    />
                ) : hasSearched ? (
                    // Show search results only after searching
                    <SectionList
                        style={{ marginTop: 26 }}
                        sections={[
                            { title: '', data: searchResults, type: 'searchResults' }
                        ]}
                        keyExtractor={(item, index) => `${item._id}-${index}`}
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
                                    onPress={() => handleGraveClick(item)} // <-- Use the same handler as historyList
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
        </ImageBackground>
    );
};

// ✅ Drawer Navigator (Keeps Layout the Same)
const Drawer = createDrawerNavigator();

const History = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="History" component={HistoryScreen} />
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
        paddingTop: height * 0.04,
    },
    topSection: {
        position: 'relative',
        width: '100%',
    },
    bg: {
        width: '100%',
        height: height * 1.3,
        position: 'absolute',
        top: 0,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: width * 0.025,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: width * 0.4,
        height: height * 0.06,
        resizeMode: 'contain',
    },
    searchBarContainer: {
        marginHorizontal: width * 0.025,
        paddingTop: height * 0.012,
        marginTop: height * 0.022,
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: width * 0.015,
        paddingHorizontal: width * 0.025,
    },
    searchBar: {
        flex: 1,
        padding: width * 0.025,
        fontSize: width * 0.04,
    },
    searchButton: {
        padding: width * 0.025,
        backgroundColor: 'green',
        borderRadius: width * 0.015,
        marginLeft: width * 0.012,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.012,
        paddingHorizontal: width * 0.06,
    },
    filterText: {
        fontSize: width * 0.05,
        color: 'green',
    },
    filterButton: {
        padding: width * 0.02,
        borderRadius: width * 0.015,
        backgroundColor: '#fff',
    },
    divider: {
        height: 2,
        backgroundColor: 'green',
        marginBottom: height * 0.025,
        marginTop: -height * 0.006,
    },
    content: {
        flex: 1,
        top: '5%',
        paddingHorizontal: width * 0.04,
        backgroundColor: 'white',
        paddingTop: height * 0.012,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: width * 0.025,
        marginBottom: height * 0.012,
        padding: width * 0.025,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cardImage: {
        width: width * 0.18,
        height: width * 0.18,
        borderRadius: width * 0.025,
        marginRight: width * 0.025,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
    },
    cardDates: {
        fontSize: width * 0.038,
        color: '#666',
    },
    cardLocation: {
        fontSize: width * 0.032,
        color: '#999',
    },
    cardAction: {
        backgroundColor: 'green',
        padding: width * 0.02,
        borderRadius: width * 0.02,
    },

    navItem: {
        alignItems: 'center',
    },
    buttonRow: {
        bottom: height * 0.04,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.012,
        height: height * 0.06,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.025,
        borderRadius: width * 0.015,
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: width * 0.012,
    },
    buttonImage: {
        width: width * 0.05,
        height: width * 0.05,
        resizeMode: 'contain',
    },
    IconDivider: {
        height: height * 0.06,
        width: 0.5,
        backgroundColor: 'gray',
    },
    drawerContainer: {
        flex: 1,
        padding: width * 0.05,
        backgroundColor: '#fff',
        borderTopRightRadius: width * 0.25,
        borderBottomRightRadius: width * 0.25,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: height * 0.025,
    },
    profileImage: {
        width: width * 0.21,
        height: width * 0.21,
        borderRadius: width * 0.105,
    },
    profileName: {
        fontSize: width * 0.048,
        fontWeight: 'bold',
        marginTop: height * 0.012,
    },
    profileLocation: {
        fontSize: width * 0.038,
        color: '#555',
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.006,
    },
    editProfileText: {
        fontSize: width * 0.038,
        color: 'green',
        marginLeft: width * 0.012,
    },
    menuSection: {
        marginVertical: height * 0.012,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.04,
        borderRadius: width * 0.025,
    },
    drawerTextGreen: {
        fontSize: width * 0.045,
        marginLeft: width * 0.04,
        color: '#12894f',
    },
    drawerTextYellow: {
        fontSize: width * 0.045,
        marginLeft: width * 0.04,
        color: '#cb9717',
    },
    drawerTextBlue: {
        fontSize: width * 0.045,
        marginLeft: width * 0.04,
        color: '#1580c2',
    },
    signOutSection: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: height * 0.012,
        paddingBottom: height * 0.05,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.018,
    },
    signOutText: {
        fontSize: width * 0.045,
        marginLeft: width * 0.025,
        color: '#333',
    },
    drawerIcon: {
        width: width * 0.11,
        height: width * 0.11,
        resizeMode: 'contain',
        marginRight: width * 0.025,
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#12894f',
        marginVertical: height * 0.01,
        marginLeft: width * 0.03,
    },
    noResultsText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: height * 0.3,
        fontSize: width * 0.04,
    },
});

export default History;