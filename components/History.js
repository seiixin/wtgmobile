import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, FlatList, Dimensions, ImageBackground, Alert, ScrollView, SectionList } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

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

// ✅ History Screen with Search Functionality
const HistoryScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [historyList, setHistoryList] = useState([]); // Ensure this is initialized as an empty array

    const handleGraveClick = (grave) => {
        console.log('Clicked Grave:', {
            ...grave,
            image: grave.image ? grave.image.substring(0, 50) + '...' : 'No image',
        });

        setHistoryList((prevHistory) => {
            // Check if the grave already exists in the historyList
            if (prevHistory.some((item) => item._id === grave._id)) {
                console.log('Grave already exists in history:', grave._id);
                return prevHistory; // Return the existing list without changes
            }
            const updatedHistory = [...prevHistory, grave];
            console.log('Updated History List:', updatedHistory.map(item => ({
                ...item,
                image: item.image ? item.image.substring(0, 50) + '...' : 'No image',
            })));
            // Save the updated history list to AsyncStorage
            AsyncStorage.setItem('historyList', JSON.stringify(updatedHistory))
                .then(() => console.log('History saved to AsyncStorage'))
                .catch((error) => console.error('Error saving history:', error));
            return updatedHistory;
        });

        navigation.navigate('GraveInformation', { grave });
    };

    // Function to handle search
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
        <ImageBackground source={require('../assets/HistoryBg.png')} style={styles.background}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.topSection}>
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
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Ionicons name="search" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider3} />
                </View>

                {/* SectionList */}
                <SectionList
                    sections={[
                        { title: 'Search Results', data: searchResults, type: 'searchResults' },
                        { title: 'Recently Viewed', data: historyList, type: 'historyList' },
                    ]}
                    keyExtractor={(item, index) => `${item._id}-${index}`} // Ensure unique keys
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
                                onPress={() =>
                                    section.type === 'searchResults'
                                        ? handleGraveClick(item)
                                        : navigation.navigate('GraveInformation', { grave: item })
                                }
                            >
                                <Image
                                    source={{ uri: item.image ? item.image : 'https://via.placeholder.com/70' }}
                                    style={styles.cardImage}
                                />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{item.firstName} {item.lastName}</Text>
                                    <Text style={styles.cardDates}>{formattedDateOfBirth} - {formattedBurialDate}</Text>
                                    <Text style={styles.cardLocation}>
                                        {item.phase}, Apartment {item.aptNo}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    contentContainerStyle={{ paddingBottom: 60 }} // Ensure proper spacing
                />

                {/* Bottom Navigation */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => {
                            navigation.navigate('MainTabs', { screen: 'HistoryTab' });
                        }}
                    >
                        <Ionicons name="time" size={24} color="green" />
                        <Text style={{ color: 'green' }}>History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => {
                            navigation.navigate('MainTabs', { screen: 'BookmarksTab' });
                        }}
                    >
                        <Ionicons name="bookmark" size={24} color="gray" />
                        <Text style={{ color: 'gray' }}>Bookmarks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => {
                            navigation.navigate('MainTabs', { screen: 'PrayersTab' });
                        }}
                    >
                        <Ionicons name="heart" size={24} color="gray" />
                        <Text style={{ color: 'gray' }}>Prayers</Text>
                    </TouchableOpacity>
                </View>
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
        resizeMode: 'cover', // Ensure it stretches properly
    },
    container: {
        flex: 1,
        paddingTop: 40,
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
        marginHorizontal: 20,
        paddingTop: 10,
        marginBottom: 40,
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
    },
    searchButton: {
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
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
        bottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
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
        width: 20,
        height: 20,
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
    drawerContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
        paddingBottom: 40,
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
        width: 40, // Set width
        height: 40, // Set height
        resizeMode: 'contain', // Make sure it scales properly
        marginRight: 10, // Add spacing between icon and text
    },
});

export default History;