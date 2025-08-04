import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions, ScrollView, ImageBackground, Alert, SectionList, StatusBar, Modal } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import WaveCurve from '../components/WaveCurve';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Linking } from 'react-native';


const screenWidth = Dimensions.get('window').width;
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";
const { width, height } = Dimensions.get('window');

const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [accountRemovedModal, setAccountRemovedModal] = useState(false);

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
                            await AsyncStorage.removeItem("userId");
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'SignIn' }],
                            });
                        } catch (error) {
                            console.error("Error during sign out:", error);
                        }
                    },
                },
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
                .catch(error => console.error("Error fetching user:", error));
        }, [])
    );

    // Polling effect to check if user still exists
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
            } catch (error) {
                // Optionally handle network errors
            }
        };
        intervalId = setInterval(checkUserExists, 5000); // Check every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

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

            {/* Account Removed Modal */}
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


const PrayersScreen = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Prayers');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

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

    // Clear searchResults when searchQuery is empty
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleResultCardClick = async (grave) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;

            // Add to history in the backend
            await fetch(`${BASE_URL}/api/history`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, grave }),
            });

            // Add graveType if missing (based on category)
            let graveWithType = { ...grave };
            if (!graveWithType.graveType && graveWithType.category) {
                if (graveWithType.category.includes('Adult')) graveWithType.graveType = 'adult';
                else if (graveWithType.category.includes('Child')) graveWithType.graveType = 'child';
                else if (graveWithType.category.includes('Bone')) graveWithType.graveType = 'bone';
            }

            setSearchQuery('');
            setSearchResults([]);
            setHasSearched(false);

            // Navigate to GraveInformation, passing the grave object
            navigation.navigate('GraveInformation', { grave: graveWithType, origin: 'Prayers' });
        } catch (error) {
            console.error('Error updating history list:', error);
        }
    };

    return (
        <>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
        />
        <ImageBackground
            source={require('../assets/HistoryBgg.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                {/* Background & Header */}
                <View style={styles.topSection}>
                    {/* <Image source={require('../assets/11BG.png')} style={styles.bg} /> */}
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

                    {/* Search Bar */}
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
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={RFValue(20, height)} color="black" />
        </TouchableOpacity>
    </View>


    {/* Four Buttons */}
<View style={[styles.buttonRow, {
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginBottom: -hp('3%'),
    paddingHorizontal: wp('2.5%'),
    marginTop: hp('2.5%')
}]}>
    <TouchableOpacity
        style={styles.actionButton}
        onPress={() => Linking.openURL('https://wtgmaps.vercel.app/graves/office')}
    >
        <Image source={require('../assets/OfficeIcon.png')} style={styles.buttonImage} />
    </TouchableOpacity>

    <View style={styles.IconDivider} />

    <TouchableOpacity
        style={styles.actionButton}
        onPress={() => Linking.openURL('https://wtgmaps.vercel.app/graves/ComfortT%20Room')}
    >
        <Image source={require('../assets/CrIcon.png')} style={styles.buttonImage} />
    </TouchableOpacity>

    <View style={styles.IconDivider} />

    <TouchableOpacity
        style={styles.actionButton}
        onPress={() => Linking.openURL('https://wtgmaps.vercel.app/graves/Chapel')}
    >
        <Image source={require('../assets/ChapelIcon.png')} style={styles.buttonImage} />
    </TouchableOpacity>

    <View style={styles.IconDivider} />

    <TouchableOpacity
        style={styles.actionButton}
        onPress={() => Linking.openURL('https://wtgmaps.vercel.app/graves/Main%20Gate')}
    >
        <Image source={require('../assets/GateIcon.png')} style={styles.buttonImage} />
    </TouchableOpacity>

         <View style={styles.IconDivider} />
<TouchableOpacity
    style={styles.actionButton}
    onPress={() => Linking.openURL('https://wtgmaps.vercel.app/graves/Common%20Grave')}
>
    <Image source={require('../assets/CGIcon.png')} style={styles.buttonImage} />
</TouchableOpacity>

<View style={styles.IconDivider} />

<TouchableOpacity
    style={styles.actionButton}
    onPress={() => Linking.openURL('https://wtgmaps.vercel.app/graves/Abandoned%20Graves')}
>
    <Image source={require('../assets/AGIcon.png')} style={styles.buttonImage} />
</TouchableOpacity>
    </View>
</View>

                </View>

                {/* Wave Background */}
                <View style={styles.waveContainer}>
                    <WaveCurve color="#fff" />
                </View>

                {/* Content Area */}
                <View style={styles.content}>
                    {/* Only show this block if NOT searching */}
                    {searchQuery.trim().length === 0 && (
                        <>
                            <View style={styles.filterContainer}>
                                <Text style={styles.filterText}>Prayers for the Deceased</Text>
                            </View>
                            <View style={styles.divider} />

                            <View style={{ flex: 1, marginBottom: height * 0.07 }}>
                                <ScrollView
                                    contentContainerStyle={styles.scrollContent}
                                    showsVerticalScrollIndicator={false}
                                >
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
                        </>
                    )}

                    {/* Show SectionList ONLY when searching */}
                    {searchQuery.trim().length > 0 && hasSearched && (
                        <SectionList
                            style={{ marginTop: -height * 0.06 }}
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
                            contentContainerStyle={{ paddingBottom: 100 }}
                            ListEmptyComponent={() => (
                                <Text style={styles.noResultsText}>No results found.</Text>
                            )}
                        />
                    )}
                </View>
            </View>
        </ImageBackground>
        </>
    );
};

const Drawer = createDrawerNavigator();

const Prayers = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="PrayersScreen" component={PrayersScreen} />
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
    waveContainer: {
        position: 'absolute',
        top: '35%',
        width: width,
        left: 0,
        right: 0,
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        top: wp('14%'),
        borderTopLeftRadius: wp('5%'),
        borderTopRightRadius: wp('5%'),
        overflow: 'hidden',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.2%'),
        paddingHorizontal: wp('6%'),
        marginTop: hp('1%'),
    },
    filterText: {
        fontSize: RFValue(18, height),
        color: 'gray',
        marginHorizontal: wp('2.5%'),
    },
    filterButton: {
        padding: wp('2%'),
        borderRadius: wp('1.5%'),
        backgroundColor: '#fff',
    },
    divider: {
        height: 2,
        backgroundColor: 'gray',
        marginBottom: hp('2.5%'),
        marginTop: -hp('0.6%'),
        marginHorizontal: wp('9%'),
    },
    scrollContent: {
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('2.5%'),
        paddingBottom: hp('12%'),
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1.8%'),
    },
    contentImage: {
        width: '100%',
        height: hp('18%'),
        resizeMode: 'contain',
    },
    touchableImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('4%'),
        backgroundColor: '#f9f9f9',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('4%'),
        borderRadius: wp('1.5%'),
        backgroundColor: '#fff',
        marginBottom: hp('1.5%'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    cardImage: {
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp('7.5%'),
        marginRight: wp('3%'),
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: RFValue(16, height),
        fontWeight: '500',
        marginBottom: hp('0.5%'),
    },
    cardDates: {
        fontSize: RFValue(14, height),
        color: 'gray',
        marginBottom: hp('0.5%'),
    },
    cardLocation: {
        fontSize: RFValue(14, height),
        color: '#333',
    },
    noResultsText: {
        textAlign: 'center',
        color: 'gray',
        padding: hp('2%'),
        fontSize: RFValue(16, height),
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

export default Prayers;
