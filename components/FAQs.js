import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, ImageBackground, Alert, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const screenWidth = Dimensions.get('window').width;
const { height } = Dimensions.get('window');
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

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
          } else if (item.title === "Account & Profile") {
            navigation.navigate("AccountAndProfiles");
          } else if (item.title === "Grave Search & Navigation") {
              navigation.navigate("GraveSearchAndNavigation");
          } else if (item.title === "Virtual Tributes & Features") {
              navigation.navigate("VirtualTributes");
          } else if (item.title === "Cemetery Services & Management") {
              navigation.navigate("CemeteryServicesAndManagement");
          } else if (item.title === "Technical Support") {
              navigation.navigate("TechnicalSupport");
          }
          else {
            navigation.navigate("FAQDetails", { category: item.title });
          }
        }}
      >
        <Ionicons name={item.icon} size={wp('6.5%')} color="#34A853" />
        <Text style={styles.categoryText}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={wp('6.5%')} color="#ccc" />
      </TouchableOpacity>
    );

    return (
        <>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
          />
          <ImageBackground source={require('../assets/FAQsBG.png')} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={wp('7%')} color="black" />
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
                  showsVerticalScrollIndicator={false}
                />
            </View>
        </ImageBackground>
      </>
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
    background: { flex: 1, resizeMode: 'cover' },
    topBar: { flexDirection: 'row', padding: wp('4%'), alignItems: 'center' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    heading: { fontSize: RFValue(22, height), fontWeight: 'bold' },

    container: {
      flex: 1,
      paddingHorizontal: wp('5%'),
      paddingTop: hp('4%'),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp('1.2%'),
      marginTop: hp('6%'),
    },
    headerTitle: {
      fontSize: RFValue(32, height),
      fontWeight: "bold",
      marginLeft: wp('2.5%'),
    },
    subtitle: {
      fontSize: RFValue(16, height),
      color: "#666",
      marginBottom: hp('2.5%'),
      marginHorizontal: wp('5%')
    },
    listContainer: {
      paddingBottom: hp('2.5%'),
    },
    categoryItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: wp('4%'),
      borderRadius: wp('3%'),
      marginBottom: hp('1.2%'),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    categoryText: {
      flex: 1,
      fontSize: RFValue(17, height),
      fontWeight: "500",
      marginLeft: wp('2.5%'),
    },
});

export default FAQs;
