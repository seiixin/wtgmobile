import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, ImageBackground, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const BASE_URL = "http://192.168.0.26:8000";

const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);

    const handleSignOut = () => {
        Alert.alert(
            "Are you sure?",
            "Do you really want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm", onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("userId");
                            navigation.reset({ index: 0, routes: [{ name: 'GetStarted' }] });
                        } catch (error) {
                            console.error("Error during sign out:", error);
                        }
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
                .catch(error => console.error("Error fetching user:", error));
        }, [])
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

const faqCategories = [
  { id: "1", title: "General Questions", icon: "help-circle-outline" },
  { id: "2", title: "Account & Profile", icon: "person-outline" },
  { id: "3", title: "Grave Search & Navigation", icon: "location-outline" },
  { id: "4", title: "Virtual Tributes & Features", icon: "flame-outline" },
  { id: "5", title: "Cemetery Services & Management", icon: "business-outline" },
  { id: "6", title: "Technical Support", icon: "settings-outline" },
];

const FAQsScreen = () => {
    const navigation = useNavigation();
    const renderItem = ({ item }) => (
  <TouchableOpacity 
    style={styles.categoryItem} 
    onPress={() => {
      if (item.title === "General Questions") {
        navigation.navigate("GeneralQuestions");
      } else {
        navigation.navigate("FAQDetails", { category: item.title });
      }
    }}
  >
    <Ionicons name={item.icon} size={24} color="#34A853" />
    <Text style={styles.categoryText}>{item.title}</Text>
    <Ionicons name="chevron-forward" size={24} color="#ccc" />
  </TouchableOpacity>
);


    return (
        <ImageBackground source={require('../assets/FAQsBG.png')} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
                </View>

                <Text style={styles.subtitle}>Choose a Category</Text>

      {/* FAQ Categories List */}
      <FlatList
        data={faqCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
            </View>
        </ImageBackground>
    );
};

const Drawer = createDrawerNavigator();

const FAQs = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="FAQsScreen" component={FAQsScreen} />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
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
    background: { flex: 1, resizeMode: 'cover' },
    topBar: { flexDirection: 'row', padding: 15, alignItems: 'center' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    heading: { fontSize: 22, fontWeight: 'bold' },

    container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    marginHorizontal: 20
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
});

export default FAQs;
