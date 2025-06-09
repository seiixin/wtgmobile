import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground, Modal, TextInput, Alert, Dimensions, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";
const { width, height } = Dimensions.get('window');

function generateReferenceNumber() {
  const prefix = 'W2G';
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${dateStr}${random}`;
}

// ✅ Custom Drawer Content
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
          : require('../assets/blankDP.jpg') // fallback local image
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

// --- Main RequestedServicesScreen (your existing code) ---
const RequestedServicesScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Request Cart"); // Track the active tab
  const [requestedServices, setRequestedServices] = useState([]);
  const [paidTransactions, setPaidTransactions] = useState([]); // Store paid transactions
  const [selectedServices, setSelectedServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0); // Track total spent for paid transactions
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Bone Apartment");
  const [apartmentOpen, setApartmentOpen] = useState(false);
  const [apartmentValue, setApartmentValue] = useState(null);
  const [apartments, setApartments] = useState([
    { label: 'Bone Apartment', value: 'Bone Apartment' },
    { label: 'Child Apartment', value: 'Child Apartment' },
    { label: 'Adult Apartment', value: 'Adult Apartment' },
  ]);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [graveDetails, setGraveDetails] = useState({
    deceasedName: '',
    dateOfBurial: '',
    dateOfBirth: '',
    phaseBlk: '',
    category: '',
    apartmentNo: '',
  });
  const [isFetchingGrave, setIsFetchingGrave] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', avatar: '' });
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);
  const [burialPickerVisible, setBurialPickerVisible] = useState(false);
const [deathPickerVisible, setDeathPickerVisible] = useState(false);
const [receiptModalVisible, setReceiptModalVisible] = useState(false);
const [receiptReferenceNumbers, setReceiptReferenceNumbers] = useState([]);

const GradientNextButton = ({ onPress }) => (
  <TouchableOpacity style={{ width: '100%' }} onPress={onPress} activeOpacity={0.8}>
    <ImageBackground
      source={require('../assets/gradient-btn.png')}
      style={[modalStyles.nextButton, { width: '110%' }]} // Ensure full width
      imageStyle={{ borderRadius: 10, width: '100%', resizeMode: 'stretch' }} // Stretch image to fit
      resizeMode="stretch"
    >
      <Text style={modalStyles.nextButtonText}>Next</Text>
      <View style={modalStyles.nextButtonCircle}>
        <Text style={modalStyles.nextButtonArrow}>➔</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);
  const serviceIcons = {
    "Yearly Grave Cleaning": require("../assets/YearlyIcon.png"),
    "Electricity Use": require("../assets/ElectricityIcon.png"),
    "Construction Permit": require("../assets/PerrmitIcon.png"),
    "Niche Demolition": require("../assets/DemolitionIcon.png"),
    "Lot for Lease Existing Fee": require("../assets/LotIcon.png"),
    "Gravestone QR": require("../assets/GravestoneQRIcon.png"),
  };

  useEffect(() => {
    const fetchRequestedServices = async () => {
      const userId = await AsyncStorage.getItem('userId'); // Get user ID

      if (!userId) {
        alert('Please login first');
        return;
      }

      // Fetch requested services
      fetch(`https://walktogravemobile-backendserver.onrender.com/api/service-requests/${userId}`, {
        method: "GET",
      })
        .then(response => response.json())
        .then(data => {
          setRequestedServices(data.data);
          setSelectedServices(data.data.map(service => ({ ...service, selected: true }))); // Initially select all services
          const totalPrice = data.data.reduce((sum, service) => sum + service.price, 0);
          setTotal(totalPrice); // Calculate total price
        })
        .catch(error => {
          console.error("Error fetching requested services:", error);
          alert("An error occurred while fetching the services.");
        });
    };

    fetchRequestedServices();
  }, []); // Run the effect on component mount

  const fetchPaidTransactions = async () => {
    const userId = await AsyncStorage.getItem('userId'); // Get user ID

    if (!userId) {
      alert('Please login first');
      return;
    }

    // Fetch paid transactions
    fetch(`https://walktogravemobile-backendserver.onrender.com/api/transactions/user/${userId}`, {
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          console.error(`Error fetching transactions: ${response.status}`);
          setPaidTransactions([]); // Set to an empty array if the response is not OK
          setTotalSpent(0); // Set total spent to 0
          return;
        }
        const data = await response.json();
        setPaidTransactions(data.data || []); // Ensure it's an array even if undefined
        const totalSpentAmount = (data.data || []).reduce((sum, transaction) => sum + (transaction.total || 0), 0);
        setTotalSpent(totalSpentAmount); // Calculate total spent
      })
      .catch(error => {
        console.error("Error fetching transactions:", error);
        setPaidTransactions([]); // Set to an empty array if there's an error
      });
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "Transactions" && paidTransactions.length === 0) {
      fetchPaidTransactions(); // Fetch paid transactions only when switching to the tab
    }
  };

  const handleSelectService = (serviceId) => {
    const updatedServices = selectedServices.map(service =>
      service._id === serviceId ? { ...service, selected: !service.selected } : service
    );
    setSelectedServices(updatedServices);

    // Recalculate total price
    const newTotal = updatedServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0);
    setTotal(newTotal);
  };

  const handleProceedToPayment = () => {
    const selected = selectedServices.filter(service => service.selected);
    if (selected.length === 0) {
      alert("Please select at least one service to proceed.");
      return;
    }
    alert("Proceeding to payment...");
  };

  const handleRemoveService = async (serviceId) => {
    try {
      // Call backend to delete the service request
      const response = await fetch(`https://walktogravemobile-backendserver.onrender.com/api/service-requests/${serviceId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove from local state
        const updatedServices = selectedServices.filter(service => service._id !== serviceId);
        setSelectedServices(updatedServices);
        // Recalculate total price
        const newTotal = updatedServices
          .filter(service => service.selected)
          .reduce((sum, service) => sum + service.price, 0);
        setTotal(newTotal);
      } else {
        alert('Failed to remove service from cart.');
      }
    } catch (error) {
      console.error('Error removing service:', error);
      alert('Error removing service.');
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      fetch(`https://walktogravemobile-backendserver.onrender.com/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          console.log('Fetched user info:', data);
          setUserInfo({
            name: data.name, // <-- use data.name directly
            avatar: data.profileImage || '', // <-- use data.profileImage if that's your avatar
          });
        });
    };
    fetchUserInfo();
  }, []);

  const toggleExpand = (transactionId) => {
    setExpandedTransactionId(expandedTransactionId === transactionId ? null : transactionId);
  };

  // Fetch grave details when deceasedName is set and has a space (Firstname Lastname)
  useEffect(() => {
    const fetchGraveDetails = async () => {
      // Only fetch if there are at least two words (first and last name)
      const nameParts = graveDetails.deceasedName.trim().split(/\s+/);
      if (nameParts.length < 2) {
        return;
      }
      setIsFetchingGrave(true);
      try {
        const response = await fetch(
          `${BASE_URL}/api/graves/search?query=${encodeURIComponent(graveDetails.deceasedName.trim())}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const grave = data[0];
          let burialYear = '';
          if (grave.burial) {
            const match = grave.burial.match(/^\d{4}/);
            burialYear = match ? match[0] : grave.burial;
          }
          let dateOfBurial = '';
          if (grave.month && grave.day && burialYear) {
            dateOfBurial = `${grave.month}/${grave.day}/${burialYear}`;
          }
          setGraveDetails(prev => ({
            ...prev,
            dateOfBurial,
            dateOfBirth: formatDateMMDDYYYY(grave.dateOfBirth),
            phaseBlk: grave.phase || '',
            category: grave.category || '',
            apartmentNo: grave.aptNo || '',
          }));
        } else {
          setGraveDetails(prev => ({
            ...prev,
            dateOfBurial: '',
            dateOfBirth: '',
            phaseBlk: '',
            category: '',
            apartmentNo: '',
          }));
        }
      } catch (error) {
        console.error('Error fetching grave details:', error);
      }
      setIsFetchingGrave(false);
    };
  
    fetchGraveDetails();
  }, [graveDetails.deceasedName]);

  useEffect(() => {
    let cartIntervalId;
    let transactionsIntervalId;

    // Poll for cart updates
    const pollRequestedServices = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      fetch(`${BASE_URL}/api/service-requests/${userId}`)
        .then(response => response.json())
        .then(data => {
          setRequestedServices(data.data);
          setSelectedServices(data.data.map(service => ({ ...service, selected: true })));
          const totalPrice = data.data.reduce((sum, service) => sum + service.price, 0);
          setTotal(totalPrice);
        })
        .catch(() => {});
    };

    // Poll for transactions updates
    const pollPaidTransactions = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      fetch(`${BASE_URL}/api/transactions/user/${userId}`)
        .then(async (response) => {
          if (!response.ok) {
            setPaidTransactions([]);
            setTotalSpent(0);
            return;
          }
          const data = await response.json();
          setPaidTransactions(data.data || []);
          const totalSpentAmount = (data.data || []).reduce((sum, transaction) => sum + (transaction.total || 0), 0);
          setTotalSpent(totalSpentAmount);
        })
        .catch(() => {});
    };

    // Start polling when component mounts
    cartIntervalId = setInterval(pollRequestedServices, 7000); // every 7 seconds
    transactionsIntervalId = setInterval(pollPaidTransactions, 7000); // every 7 seconds

    // Initial fetch
    pollRequestedServices();
    pollPaidTransactions();

    return () => {
      clearInterval(cartIntervalId);
      clearInterval(transactionsIntervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Drawer Hamburger Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 100,
          borderRadius: 20,
          padding: 8,
        }}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu" size={28} color="#1a5242" />
      </TouchableOpacity>

      <ImageBackground
        source={require("../assets/RequestedBg.png")} // Background image
        style={styles.headerBackground}
        
        imageStyle={styles.headerImage} // Add this for better control of the image
      >
        <View style={styles.headerContent}>
       
          <Text style={styles.header}>Requested Services</Text>
        </View>
      </ImageBackground>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => handleTabSwitch("Request Cart")}>
          <Text style={[styles.tab, activeTab === "Request Cart" && styles.activeTab]}>
            Request Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabSwitch("Transactions")}>
          <Text style={[styles.tab, activeTab === "Transactions" && styles.activeTab]}>
            Transactions
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === "Request Cart" ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedServices.map((service) => (
            <Swipeable
              key={service._id}
              renderRightActions={() => (
<TouchableOpacity
  style={{
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('22%'), // Responsive width
    height: hp('7%'), // Responsive height
    borderRadius: wp('2.5%'),
    marginVertical: hp('0.7%'),
    marginLeft: wp('2%'),
  }}
  onPress={() => handleRemoveService(service._id)}
>
  <Text style={{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4%'), // Responsive font size
    fontFamily: 'Inter_700Bold',
  }}>
    Remove
  </Text>
</TouchableOpacity>
              )}
            >
              <View style={styles.serviceRow}>
                <TouchableOpacity
                  onPress={() => handleSelectService(service._id)}
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: service.selected ? "#fab636" : "#aaa",
                    backgroundColor: service.selected ? "#fab636" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    marginRight: 10,
                  }}
                >
                  {service.selected && (
                    <Text style={{
  color: "#fff",
  fontWeight: "bold",
  fontSize: wp('4.5%'), // Responsive
}}>
  ✓
</Text>
                  )}
                </TouchableOpacity>
                <View style={styles.serviceCard}>
                  <Image source={serviceIcons[service.serviceName]} style={styles.serviceIcon} />
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.serviceName}</Text>
                    <Text style={styles.servicePrice}>₱{service.price.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {paidTransactions.length > 0 ? (
              paidTransactions.map((transaction) => {
                const isExpanded = expandedTransactionId === transaction._id;
                return (
                  <View
                    key={transaction._id}
                    style={[
                      styles.transactionCard,
                      {
                        flexDirection: 'column',
                        position: 'relative',
                        backgroundColor: '#f9f9f9',
                        borderRadius: 12,
                        marginBottom: 12,
                        width: '100%', // Make card take full width of container
                        paddingHorizontal: 0, // Remove extra horizontal padding
                        paddingVertical: 0, // Remove extra vertical padding
                        minHeight: 65,
                        justifyContent: 'center',
                      }
                    ]}
                  >
                    {/* Collapsed Row: Icon, Name, Status */}
                    <TouchableOpacity
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 65,
    paddingHorizontal: 18,
    width: '100%',
  }}
  onPress={() => toggleExpand(transaction._id)}
  activeOpacity={0.8}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
    <Image
      source={serviceIcons[transaction.services?.[0]?.serviceName]}
      style={{ width: 40, height: 40, marginRight: 16 }}
    />
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: wp('4%'),
          color: '#333',
          flexShrink: 1,
          flexWrap: 'wrap',
          minWidth: 0,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {transaction.services?.[0]?.serviceName}
      </Text>
      {transaction.services?.length > 1 && (
        <Text
          style={{
            color: '#888',
            fontSize: wp('3.8%'),
            marginLeft: 6,
            flexShrink: 0,
          }}
          numberOfLines={1}
        >
          {`+${transaction.services.length - 1} more`}
        </Text>
      )}
    </View>
  </View>
  <Text
    style={{
      color:
        transaction.status === 'pending'
        ? '#fab636'
        : transaction.status === 'completed'
        ? '#fab636'
        : '#fab636',
      fontWeight: 'bold',
      fontSize: wp('3.5%'),
      minWidth: 90,
      textAlign: 'right',
      marginLeft: 8,
      flexShrink: 0,
    }}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {transaction.status === 'pending'
      ? 'Pending'
      : transaction.status === 'completed'
      ? 'Completed'
      : (transaction.status || 'To Process')}
  </Text>
</TouchableOpacity>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <View style={{ marginTop: 12, backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Services:</Text>
                        {transaction.services.map((service, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                            <Text style={{ color: '#333' }}>{service.serviceName}</Text>
                            <Text style={{ color: '#333' }}>₱{service.price?.toLocaleString()}</Text>
                          </View>
                        ))}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                          <Text style={{ color: '#888' }}>Payment Method</Text>
                          <Text style={{ color: '#333', fontWeight: 'bold' }}>
                            {transaction.paymentMethod === 'gcash' ? 'Gcash' : (transaction.paymentMethod || 'Cash')}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                          <Text style={{ color: '#888' }}>Order Time</Text>
                          <Text style={{ color: '#333' }}>
                            {transaction.orderTime ? new Date(transaction.orderTime).toLocaleDateString() + ' ' + new Date(transaction.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
  <Text style={{ color: '#888' }}>Payment Time</Text>
  <Text style={{ color: '#333' }}>
    {transaction.paymentTime
      ? new Date(transaction.paymentTime).toLocaleDateString() + ' ' +
        new Date(transaction.paymentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : ''}
  </Text>
</View>
                        <View style={{ borderTopWidth: 1, borderColor: '#eee', marginVertical: 8 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ color: '#333', fontWeight: 'bold' }}>Total Payment:</Text>
                          <Text style={{ fontWeight: 'bold', color: '#388e3c', fontSize: 16 }}>
                            ₱{transaction.total?.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Expand/Collapse Button */}
                    <TouchableOpacity
                      style={{ alignSelf: 'center', marginTop: isExpanded ? 8 : 0 }}
                      onPress={() => toggleExpand(transaction._id)}
                    >
                      <Text style={{
  color: '#888',
  fontSize: wp('3.5%'), // Responsive
}}>
  {isExpanded ? 'View Less  ⌃' : 'View Details  ⌄'}
</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noTransactionsText}>No transactions available.</Text>
            )}
            <View style={{ height: 80 }} /> 
          </ScrollView>
          <View style={styles.fixedFooter}>
            <Text style={styles.totalText}>Total Spent:</Text>
            <Text style={styles.totalAmount}>₱{totalSpent.toLocaleString()}</Text>
          </View>
        </View>
      )}
      {activeTab === "Request Cart" && (
        <View style={styles.footerContainer}>
         
          <View style={styles.footerTop}>
            <View style={styles.footerContent}>
              <Text style={styles.totalText}>Selected Item(s)</Text>
              <Text>
                <Text style={styles.totalText}>Total: </Text>
                <Text style={styles.totalAmount}>₱{total.toLocaleString()}</Text>
              </Text>
            </View>
          </View>

         
          <ImageBackground
            source={require("../assets/RequestedFooterBg.png")} // Footer background image
            style={styles.footerBottom}
            imageStyle={styles.footerImage}
          >
            <TouchableOpacity style={styles.paymentButton }onPress={() => setIsModalVisible(true)}>
              <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.collapseButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.collapseIcon}>⌃</Text> 
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}

      {/* Modal for Edit Grave Details */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContent}>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={modalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={modalStyles.title}>Edit Grave Details</Text>
            <View style={modalStyles.row}>
              <View style={[modalStyles.inputContainer, { flex: 1.3 }]}>
                <Text style={modalStyles.label}>Name of the Deceased *</Text>
                <TextInput
  style={modalStyles.input}
  value={graveDetails.deceasedName}
  onChangeText={text => setGraveDetails({ ...graveDetails, deceasedName: text })}
  editable={true}
/>
              </View>
              <View style={[modalStyles.inputContainer]}>
    <Text style={modalStyles.label}>Date of Burial</Text>
    <View style={modalStyles.input}>
      <Text style={{ color: graveDetails.dateOfBurial ? '#222' : '#aaa', fontSize: 15 }}>
        {graveDetails.dateOfBurial || ''}
      </Text>
    </View>
  </View>
            </View>
            <View style={modalStyles.row}>
              <View style={[modalStyles.inputContainer, { flex: 0.9 }]}>
                <Text style={modalStyles.label}>Date of Birth</Text>
                <TextInput
                  style={modalStyles.input}
                  value={graveDetails.dateOfBirth}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder=""
                />
              </View>
              <View style={modalStyles.inputContainer}>
                <Text style={modalStyles.label}>Phase / Blk</Text>
                <TextInput
                  style={modalStyles.input}
                  value={graveDetails.phaseBlk}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
            </View>
            <View style={modalStyles.row}>
              <View style={[modalStyles.inputContainer, { flex: 1.4 }]}>
                <Text style={modalStyles.label}>Category</Text>
                <View style={modalStyles.input}>
      <Text style={{
        color: graveDetails.category ? '#222' : '#aaa',
        fontSize: wp('3.8%'),
        fontFamily: 'Inter_400Regular',
      }}>
        {graveDetails.category || ''}
      </Text>
    </View>
              </View>
              <View style={modalStyles.inputContainer}>
                <Text style={modalStyles.label}>Apt. no.</Text>
                <TextInput
                  style={modalStyles.input}
                  value={graveDetails.apartmentNo}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
            </View>
            <GradientNextButton onPress={() => {
              // Prevent proceeding if no service is selected
              if (!selectedServices.some(s => s.selected)) {
                alert("Please select at least one service in your cart before proceeding.");
                return;
              }
              // Require all grave details fields
              const { deceasedName, dateOfBurial, dateOfBirth, phaseBlk, category, apartmentNo } = graveDetails;
              if (
                !deceasedName.trim() ||
                !dateOfBurial.trim() ||
                !dateOfBirth.trim() ||
                !phaseBlk.trim() ||
                !category ||
                !apartmentNo.trim()
              ) {
                alert("Please fill in all grave details before proceeding.");
                return;
              }
              setIsModalVisible(false);           // Hide Edit Grave Details modal
              setIsPaymentModalVisible(true);     // Show Payment Method modal
            }} />
          </View>
        </View>
      </Modal>

      {/* Modal for Payment Method */}
      <Modal
        visible={isPaymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPaymentModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContent}>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={() => setIsPaymentModalVisible(false)}
            >
              <Text style={modalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={{
  fontWeight: 'bold',
  fontSize: wp('4.5%'), // Responsive
  marginTop: hp('2%'),
  marginBottom: hp('2%'),
  alignSelf: 'flex-start',
  fontFamily: 'Inter_700Bold',
}}>
  Payment Method
</Text>
            <View style={{ width: '100%', marginBottom: 20 }}>
              {/* Remove Gcash option */}
              {/* 
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                onPress={() => setSelectedPayment('gcash')}
                activeOpacity={0.8}
              >
                <Image source={require('../assets/gcash.png')} style={{ width: 50, height: 50, marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Gcash</Text>
                  <Text style={{ fontSize: 12, color: '#555' }}>
                    Payment (min. ₱50) should be completed within 24 hrs. Accessible 24/7 and may entail additional 2% fee.
                  </Text>
                </View>
                <View style={{
                  width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#FFD600',
                  alignItems: 'center', justifyContent: 'center', marginLeft: 8,
                  backgroundColor: selectedPayment === 'gcash' ? '#FFD600' : '#fff'
                }}>
                  {selectedPayment === 'gcash' && (
                    <View style={{
                      width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFD600'
                    }} />
                  )}
                </View>
              </TouchableOpacity>
              */}
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setSelectedPayment('Cash')}
                activeOpacity={0.8}
              >
                <Image source={require('../assets/cash.png')} style={{ width: 50, height: 50, marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{
  fontWeight: 'bold',
  fontSize: wp('4%'), // Responsive
}}>
  Pay in Cash
</Text>
                </View>
                <View style={{
                  width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#FFD600',
                  alignItems: 'center', justifyContent: 'center', marginLeft: 8,
                  backgroundColor: selectedPayment === 'Cash' ? '#FFD600' : '#fff'
                }}>
                  {selectedPayment === 'Cash' && (
                    <View style={{
                      width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFD600'
                    }} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                borderRadius: 30,
                overflow: 'hidden',
                marginTop: 10,
              }}
             onPress={async () => {
                if (!selectedPayment) {
                  alert('Please select a payment method before proceeding.');
                  return;
                }
                if (selectedPayment !== 'Cash') {
                  alert('Only "Pay in Cash" is available at this time. Please select "Pay in Cash" to proceed.');
                  return;
                }
                setIsPaymentModalVisible(false);
                const userId = await AsyncStorage.getItem('userId');
                if (!userInfo.name) {
                  alert('User info not loaded. Please try again.');
                  return;
                }

                // --- DUPLICATE CHECK LOGIC START ---
                // Fetch all transactions for this user
                let transactions = [];
                try {
                  const res = await fetch(`${BASE_URL}/api/transactions/user/${userId}`);
                  const data = await res.json();
                  transactions = data.data || [];
                } catch (e) {
                  alert('Could not check for duplicate requests. Please try again.');
                  return;
                }

                // Find services for this deceased that are not completed
                const currentDeceased = graveDetails.deceasedName.trim().toLowerCase();
                const ongoingServices = new Set();
                transactions.forEach(tx => {
                  if (
                    tx.graveDetails &&
                    tx.graveDetails.deceasedName &&
                    tx.graveDetails.deceasedName.trim().toLowerCase() === currentDeceased &&
                    tx.status !== 'completed' // <-- FIXED: only block if not completed
                  ) {
                    (tx.services || []).forEach(s => ongoingServices.add(s.serviceName));
                  }
                });

                // Filter out services that are already ongoing for this deceased
                const selectedToRequest = selectedServices
                  .filter(s => s.selected && !ongoingServices.has(s.serviceName));

                const duplicateServices = selectedServices
                  .filter(s => s.selected && ongoingServices.has(s.serviceName))
                  .map(s => s.serviceName);

                if (selectedToRequest.length === 0) {
                  alert(
                    `You already have ongoing requests for all selected services for "${graveDetails.deceasedName}". Please wait until they are completed before requesting again.`
                  );
                  return;
                }

                if (duplicateServices.length > 0) {
                  alert(
                    `The following service(s) for "${graveDetails.deceasedName}" are still ongoing and cannot be requested again: ${duplicateServices.join(', ')}`
                  );
                }
                // --- DUPLICATE CHECK LOGIC END ---

    
                const referenceNumber = generateReferenceNumber();

const payload = {
  userId,
  userName: userInfo.name,
  userAvatar: userInfo.avatar,
  graveDetails,
  services: selectedToRequest,
  total: selectedToRequest.reduce((sum, s) => sum + s.price, 0),
  paymentMethod: selectedPayment,
  status: 'pending',
  orderTime: new Date(),
  referenceNumber, // <-- Add this line
};
                console.log('Submitting transaction:', payload);
                fetch(`${BASE_URL}/api/transactions`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
                  .then(res => res.json())
                  .then(async data => {
                    // 1. Clear the grave details fields
                    setGraveDetails({
                      deceasedName: '',
                      dateOfBurial: '',
                      dateOfBirth: '',
                      phaseBlk: '',
                      category: '',
                      apartmentNo: '',
                    });

                    fetchPaidTransactions();

                    // Remove only the requested services from the cart in local state and backend
                    // 1. Collect reference numbers before deleting


// 2. Remove only the requested services from the cart in local state and backend
await Promise.all(selectedToRequest.map(service =>
  fetch(`${BASE_URL}/api/service-requests/${service._id}`, {
    method: 'DELETE',
  })
));

// 3. Show reference number in modal
  const refNumber = data.data.referenceNumber || referenceNumber;
  if (refNumber) {
    setReceiptReferenceNumbers([refNumber]);
    setReceiptModalVisible(true);
  }

                    setSelectedServices(prev =>
                      prev.filter(service => !selectedToRequest.some(s => s._id === service._id))
                    );
                    setTotal(prev =>
                      selectedServices
                        .filter(service => !selectedToRequest.some(s => s._id === service._id))
                        .reduce((sum, s) => sum + s.price, 0)
                    );
                    setActiveTab("Transactions"); // Redirect to Transactions tab
                  })
                  .catch(err => alert('Failed to submit request'));
              }}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={require('../assets/gradient-btn.png')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 30,
                  width: '120%',
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                }}
                imageStyle={{ borderRadius: 30, resizeMode: 'stretch' }}
                resizeMode="stretch"
              >
                <Text style={{
  color: '#1a5242',
  fontWeight: 'bold',
  fontSize: wp('4.5%'), // Responsive
}}>
  Complete Request
</Text>
                <View style={{
                  backgroundColor: '#fff',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  right: 65,
                }}>
                  <Text style={{
  color: '#1a5242',
  fontWeight: 'bold',
  fontSize: wp('4.5%'), // Responsive
}}>
  ➔
</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Receipt */}
      <Modal
        visible={receiptModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReceiptModalVisible(false)}
      >
        <View style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 18,
      padding: 28,
      alignItems: 'center',
      width: '85%',
      borderWidth: 3,
      borderColor: '#fab636'
    }}>
      <View style={{
        backgroundColor: '#1a5242',
        borderRadius: 50,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 3,
        borderColor: '#fab636'
      }}>
        <Ionicons name="checkmark-done" size={38} color="#fff" />
      </View>
      <Text style={{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a5242',
        marginBottom: 10,
        textAlign: 'center'
      }}>
        Request Submitted!
      </Text>
      <Text style={{
        fontSize: 16,
        color: '#fab636',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
      }}>
        Reference Number{receiptReferenceNumbers.length > 1 ? 's' : ''}:
      </Text>
      {receiptReferenceNumbers.map((ref, idx) => (
        <Text key={idx} style={{
          fontSize: 17,
          color: '#1a5242',
          fontWeight: 'bold',
          marginBottom: 2,
          letterSpacing: 1,
          textAlign: 'center'
        }}>
          {ref}
        </Text>
      ))}
      <Text style={{
        fontSize: 15,
        color: '#222',
        marginTop: 16,
        textAlign: 'center'
      }}>
        Please proceed to the St. Joseph Cemetery office to complete payment on-site.
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 22,
          backgroundColor: '#fab636',
          borderRadius: 24,
          paddingVertical: 10,
          paddingHorizontal: 38,
        }}
        onPress={() => setReceiptModalVisible(false)}
      >
        <Text style={{
          color: '#1a5242',
          fontWeight: 'bold',
          fontSize: 17,
        }}>
          OK
        </Text>
      </TouchableOpacity>
    </View>
  </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  headerBackground: {
    width: "100%",
    height: hp('18%'), // Responsive height
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: wp('8%'),
    borderBottomRightRadius: wp('8%'),
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: "bold",
    color: "#1a5242",
    marginTop: hp('7%'),
    textAlign: "center",
    fontFamily: 'Inter_700Bold',
  },
  backButtonRequested: {
    position: "absolute",
    left: 10,
    top: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backIconRequested: {
    width: 43, // Adjust the size of the back icon
    height: 43, // Adjust the size of the back icon
    tintColor: "#333", // Optional: Change the color of the icon
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: hp('1%'),
  },
  tab: {
    fontSize: wp('4%'),
    color: "#aaa",
    paddingVertical: hp('1%'),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    fontFamily: 'Inter_400Regular',
  },
  activeTab: {
    color: "#fab636",
    borderBottomColor: "#fab636",
  },
  scrollContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp('1%'),
  },
  drawerIcon: {
  width: wp('11%'),
  height: wp('11%'),
  resizeMode: 'contain',
  marginRight: wp('2.5%'),
},
  serviceCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e2efc2",
    padding: wp('4%'),
    borderRadius: wp('3%'),
  },
  transactionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: wp('3%'),
    marginBottom: hp('1.2%'),
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: hp('8%'),
    justifyContent: 'center',
  },
  serviceIcon: {
    width: wp('10%'),
    height: wp('10%'),
    marginHorizontal: wp('2.5%'),
  },
  serviceDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: wp('4%'),
    color: "#333",
    fontFamily: 'Inter_700Bold',
  },
  servicePrice: {
    fontWeight: "bold",
    fontSize: wp('4%'),
    fontFamily: 'Inter_700Bold',
  },
  noTransactionsText: {
    textAlign: "center",
    fontSize: wp('4%'),
    color: "#aaa",
    marginTop: hp('2%'),
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    padding: wp('5%'),
    backgroundColor: "#fff",
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    elevation: 5,
  },
  footerContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  footerTop: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: wp('6%'),
    borderBottomRightRadius: wp('6%'),
    height: hp('12%'),
    padding: wp('5%'),
    elevation: 5,
    top: hp('2%'),
    zIndex: 2
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp('1%'),
  },
  footerBottom: {
    width: "100%",
    padding: wp('5%'),
    overflow: "hidden",
  },
  footerImage: {
    resizeMode: "cover",
    width: "115%",
    height: "215%",
  },
  paymentButton: {
    paddingVertical: hp('2%'),
    borderRadius: wp('12%'),
    alignItems: "center",
    marginTop: hp('1%'),
    backgroundColor: "transparent",
  },
  paymentButtonText: {
    color: "#1a5242",
    fontSize: wp('4.2%'),
    fontWeight: "bold",
    alignSelf: "flex-start",
    fontFamily: 'Inter_700Bold',
  },
  collapseButton: {
    position: "absolute",
    right: wp('5%'),
    top: hp('5%'),
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  collapseIcon: {
    fontSize: wp('4%'),
    color: "#333",
    fontWeight: "bold",
  },
  totalText: {
    fontSize: wp('4%'),
    color: "black",
    fontFamily: 'Inter_700Bold',
  },
  totalAmount: {
    fontSize: wp('5%'),
    fontWeight: "bold",
    color: "#333",
    fontFamily: 'Inter_700Bold',
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: wp('5%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    elevation: 5,
    zIndex: 10,
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
});

// Modal styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    padding: wp('6%'),
    paddingBottom: hp('5%'),
    minHeight: hp('55%'),
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -hp('3%'),
    alignSelf: 'center',
    backgroundColor: '#1a5242',
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: RFValue(24, height),
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    fontSize: RFValue(20, height),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    alignSelf: 'flex-start',
    fontFamily: 'Inter_700Bold',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: wp('2%'),
    marginBottom: hp('1%'),
    zIndex: 1000,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: RFValue(14, height),
    marginBottom: hp('0.5%'),
    color: '#222',
    fontFamily: 'Inter_700Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
    padding: wp('2%'),
    backgroundColor: '#fff',
    fontSize: RFValue(15, height),
    fontFamily: 'Inter_400Regular',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: wp('2%'),
    width: '100%',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
    marginTop: hp('3%'),
  },
  nextButtonText: {
    color: '#1a5242',
    fontWeight: 'bold',
    fontSize: RFValue(18, height),
    fontFamily: 'Inter_700Bold',
  },
  nextButtonCircle: {
    backgroundColor: '#fff',
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('2.5%'),
    right: wp('9%'),
  },
  nextButtonArrow: {
    color: '#1a5242',
    fontWeight: 'bold',
    fontSize: RFValue(18, height),
    fontFamily: 'Inter_700Bold',
  },
});

function formatDateMMDDYYYY(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}

const Drawer = createDrawerNavigator();

const RequestedServices = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="RequestedServicesScreen" component={RequestedServicesScreen} />
  </Drawer.Navigator>
);


export default RequestedServices;
