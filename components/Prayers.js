import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions, ScrollView, ImageBackground, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import WaveCurve from '../components/WaveCurve';
import AsyncStorage from '@react-native-async-storage/async-storage';
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


const PrayersScreen = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Prayers'); // Default selected tab

    return (

        <ImageBackground
              source={require('../assets/HistoryBg.png')} 
              style={styles.background}
               >

        <View style={styles.container}>
            {/* Background & Header */}
            <View style={styles.topSection}>
                {/* <Image source={require('../assets/11BG.png')} style={styles.bg} /> */}
                 <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Ionicons name="menu" size={24} color="black" />
                        </TouchableOpacity>
                        <View style={styles.imageContainer}></View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBarContainer}>
                    <View style={styles.searchWrapper}>
                        <TextInput 
                            style={styles.searchBar} 
                            placeholder="Deceased Search" 
                            placeholderTextColor="gray" 
                        />
                        <TouchableOpacity style={styles.searchIcon}>
                            <Ionicons name="search" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider3} />
            </View>

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
            <View style={styles.content}>
                <View style={styles.filterContainer}>
                    <Text style={styles.filterText}>Prayers for the Deceased</Text>
                </View>

                <View style={styles.divider} />

                <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => navigation.navigate('RosaryPrayer')} style={styles.touchableImage}>
            <Image source={require('../assets/RosaryImg.png')} style={styles.contentImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NovenaPrayer')} style={styles.touchableImage}>
            <Image source={require('../assets/NovenaImg.png')} style={styles.contentImage} />
        </TouchableOpacity>
    </View>
    <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => navigation.navigate('MassIntention')} style={styles.touchableImage}>
            <Image source={require('../assets/MassImg.png')} style={styles.contentImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PsalmReading')} style={styles.touchableImage}>
            <Image source={require('../assets/ReadingsImg.png')} style={styles.contentImage} />
        </TouchableOpacity>
    </View>
    <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => navigation.navigate('SpecialIntention')} style={styles.touchableImage}>
            <Image source={require('../assets/SpecialImg.png')} style={styles.contentImage} />
        </TouchableOpacity>
    </View>
</ScrollView>


            </View>
            
            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => {
                    setSelectedTab('History');
                    navigation.navigate('History');}} >
                    <Ionicons 
                        name="time" 
                        size={24} 
                        color={selectedTab === 'History' ? 'green' : 'gray'} 
                    />
                    <Text style={{ color: selectedTab === 'History' ? 'green' : 'gray' }}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => {
                    setSelectedTab('MainTabs', { screen: 'BookmarksTab' });
                    navigation.navigate('MainTabs', { screen: 'BookmarksTab' });} }>
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
                        setSelectedTab('MainTabs', { screen: 'PrayersTab' });
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
    );
};

const Drawer = createDrawerNavigator();

const Prayers = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Prayers" component={PrayersScreen} />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',  // Ensure it stretches properly
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
    },
    searchBar: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        top:12,
        backgroundColor: '',
    },
    waveContainer: {
        position: 'absolute',
        top: '35%', // Adjust to align with the background
        width: screenWidth, // Full width
        left: 0,
        right: 0,
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        top:'7%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
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
        color: 'gray',
        marginHorizontal: 10,
    },
    filterButton: {
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    divider: {
        height: 2,
        backgroundColor: 'gray',
        marginBottom: 10,
        marginTop: -5,
        marginHorizontal: 30,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    contentImage: {
        width: '100%', // Adjusted to fit inside TouchableOpacity
        height: 150,
        resizeMode: 'contain',
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
    touchableImage: {
        flex: 1, // Ensures images don't shrink
        alignItems: 'center', // Centers the image inside TouchableOpacity
        justifyContent: 'center',
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

});

export default Prayers;
