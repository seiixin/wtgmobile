import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground, Modal, TextInput, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

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
                                              source={{
                                                  uri: user?.profileImage
                                                      ? user.profileImage
                                                      : 'https://via.placeholder.com/150'
                                              }}
                                              style={styles.profileImage}
                                          />
                                          <View style={{ marginLeft: 16 }}>
                                              <Text style={styles.profileName}>{user?.name || "Loading..."}</Text>
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
    dateOfDeath: '',
    phaseBlk: '',
    category: '',
    apartmentNo: '',
  });
  const [userInfo, setUserInfo] = useState({ name: '', avatar: '' });
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);
  const [burialPickerVisible, setBurialPickerVisible] = useState(false);
const [deathPickerVisible, setDeathPickerVisible] = useState(false);

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

    // Proceed to payment logic
    console.log("Selected services for payment:", selected);
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
                    width: 85,
                    height: '79%',
                    borderRadius: 10,
                    marginVertical: 5,
                  }}
                  onPress={() => handleRemoveService(service._id)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Remove</Text>
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
                  {service.selected && <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>}
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
                        paddingHorizontal: 18, // Add horizontal padding inside the card
                        width: '100%',
                      }}
                      onPress={() => toggleExpand(transaction._id)}
                      activeOpacity={0.8}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image
                          source={serviceIcons[transaction.services?.[0]?.serviceName]}
                          style={{ width: 40, height: 40, marginRight: 16 }}
                        />
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>
                          {transaction.services?.[0]?.serviceName}
                          {transaction.services?.length > 1 && (
                            <Text style={{ color: '#888', fontSize: 15 }}>
                              {`  +${transaction.services.length - 1} more`}
                            </Text>
                          )}
                        </Text>
                      </View>
                      <Text style={{
                        color: transaction.status === 'paid' || transaction.status === 'Completed' ? '#1976d2' : '#fab636',
                        fontWeight: 'bold',
                        fontSize: 13,
                        minWidth: 90,
                        textAlign: 'right'
                      }}>
                        {transaction.status === 'paid'
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
                          <Text style={{ color: '#888' }}>Paid in</Text>
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
                            {transaction.paymentTime ? new Date(transaction.paymentTime).toLocaleDateString() + ' ' + new Date(transaction.paymentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
                      <Text style={{ color: '#888', fontSize: 13 }}>
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
                />
              </View>
              <View style={[modalStyles.inputContainer, { flex: 0.7 }]}>
                <Text style={modalStyles.label}>Date of Burial *</Text>
                <TouchableOpacity onPress={() => setBurialPickerVisible(true)}>
                  <TextInput
                    style={modalStyles.input}
                    value={graveDetails.dateOfBurial}
                    placeholder="Select Date"
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {burialPickerVisible && (
                  <DateTimePicker
                    value={graveDetails.dateOfBurial ? new Date(graveDetails.dateOfBurial) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setBurialPickerVisible(false);
                      if (selectedDate) {
                        const d = selectedDate;
                        const formatted = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
                        setGraveDetails({ ...graveDetails, dateOfBurial: formatted });
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            </View>
            <View style={modalStyles.row}>
              <View style={[modalStyles.inputContainer, { flex: 0.9 }]}>
                <Text style={modalStyles.label}>Date of Death *</Text>
                <TouchableOpacity onPress={() => setDeathPickerVisible(true)}>
                  <TextInput
                    style={modalStyles.input}
                    value={graveDetails.dateOfDeath}
                    placeholder="Select Date"
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {deathPickerVisible && (
                  <DateTimePicker
                    value={graveDetails.dateOfDeath ? new Date(graveDetails.dateOfDeath) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setDeathPickerVisible(false);
                      if (selectedDate) {
                        // Format as MM/DD/YYYY
                        const d = selectedDate;
                        const formatted = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
                        setGraveDetails({ ...graveDetails, dateOfDeath: formatted });
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}
              </View>
              <View style={modalStyles.inputContainer}>
                <Text style={modalStyles.label}>Phase / Blk *</Text>
                <TextInput
                  style={modalStyles.input}
                  value={graveDetails.phaseBlk}
                  onChangeText={text => setGraveDetails({ ...graveDetails, phaseBlk: text })}
                />
              </View>
            </View>
            <View style={modalStyles.row}>
              <View style={[modalStyles.inputContainer, { flex: 1.4 }]}>
                <Text style={modalStyles.label}>Select Category *</Text>
                <DropDownPicker
                  open={apartmentOpen}
                  value={graveDetails.category}
                  setValue={val => setGraveDetails({ ...graveDetails, category: val() })}
                  items={apartments}
                  setOpen={setApartmentOpen}
                  
                  setItems={setApartments}
                  placeholder="Select Apartment"
                  style={{
                    height: 38, // Set your desired height here
                    borderColor: '#ccc',
                    backgroundColor: '#f9f9f9',
                    minHeight: 38, // Ensures minimum height
                    paddingVertical: 0, // Remove extra padding
                  }}
                  containerStyle={{
                    height: 38, // Match the height here as well
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                  }}
                  zIndex={1000}
                  
                />
              </View>
              <View style={modalStyles.inputContainer}>
                <Text style={modalStyles.label}>Apt. no.</Text>
                <TextInput
                  style={modalStyles.input}
                  value={graveDetails.apartmentNo}
                  onChangeText={text => setGraveDetails({ ...graveDetails, apartmentNo: text })}
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
              const { deceasedName, dateOfBurial, dateOfDeath, phaseBlk, category, apartmentNo } = graveDetails;
              if (
                !deceasedName.trim() ||
                !dateOfBurial.trim() ||
                !dateOfDeath.trim() ||
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
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 20, marginBottom: 24, alignSelf: 'flex-start' }}>Payment Method</Text>
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
                onPress={() => setSelectedPayment('cash')}
                activeOpacity={0.8}
              >
                <Image source={require('../assets/cash.png')} style={{ width: 50, height: 50, marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Pay in Cash</Text>
                </View>
                <View style={{
                  width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#FFD600',
                  alignItems: 'center', justifyContent: 'center', marginLeft: 8,
                  backgroundColor: selectedPayment === 'cash' ? '#FFD600' : '#fff'
                }}>
                  {selectedPayment === 'cash' && (
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
                if (selectedPayment !== 'cash') {
                  alert('Only "Pay in Cash" is available at this time. Please select "Pay in Cash" to proceed.');
                  return;
                }
                setIsPaymentModalVisible(false);
                const userId = await AsyncStorage.getItem('userId');
                if (!userInfo.name) {
                  alert('User info not loaded. Please try again.');
                  return;
                }
                const payload = {
                  userId,
                  userName: userInfo.name,
                  userAvatar: userInfo.avatar,
                  graveDetails,
                  services: selectedServices.filter(s => s.selected),
                  total,
                  paymentMethod: selectedPayment,
                  status: 'pending',
                  orderTime: new Date(),
                };
                console.log('Submitting transaction:', payload);
                fetch('https://walktogravemobile-backendserver.onrender.com/api/transactions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
                  .then(res => res.json())
                  .then(async data => {
                    console.log('Transaction response:', data);
                    if (selectedPayment === 'cash') {
    alert('Service successfully requested! Please proceed to the St. Joseph Cemetery office to complete payment on-site.');
  } else {
    alert('Request submitted!');
  }
  // 1. Clear the grave details fields
  setGraveDetails({
    deceasedName: '',
    dateOfBurial: '',
    dateOfDeath: '',
    phaseBlk: '',
    category: '',
    apartmentNo: '',
  });

  fetchPaidTransactions();

  // Remove selected services from the database
  const selectedToDelete = selectedServices.filter(service => service.selected);
  await Promise.all(selectedToDelete.map(service =>
    fetch(`https://walktogravemobile-backendserver.onrender.com/api/service-requests/${service._id}`, {
      method: 'DELETE',
    })
  ));

  // Remove only the selected services from the cart in local state
  setSelectedServices(prev =>
    prev.filter(service => !service.selected)
  );
  setTotal(prev =>
    selectedServices.filter(service => !service.selected).reduce((sum, s) => sum + s.price, 0)
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
                <Text style={{ color: '#1a5242', fontWeight: 'bold', fontSize: 18 }}>Complete Request</Text>
                <View style={{
                  backgroundColor: '#fff',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  right: 65,
                }}>
                  <Text style={{ color: '#1a5242', fontWeight: 'bold', fontSize: 18 }}>➔</Text>
                </View>
              </ImageBackground>
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
    width: "100%", // Ensure it spans the full width of the screen
    height: 150, // Adjust height to match the design
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    resizeMode: "cover", // Ensure the image covers the area
    width: "100%", // Match the width of the container
    height: "100%", // Match the height of the container
    borderBottomLeftRadius: 30, // Add curve to the bottom-left corner
    borderBottomRightRadius: 30, // Add curve to the bottom-right corner
    overflow: "hidden", // Ensure the curve is visible
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a5242",
    marginTop: 30,
    textAlign: "center",
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
    marginBottom: 10,
  },
  tab: {
    fontSize: 16,
    color: "#aaa",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    color: "#fab636",
    borderBottomColor: "#fab636",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e2efc2",
    padding: 15,
    borderRadius: 10,
  },
  transactionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 65,
    justifyContent: 'center',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  serviceDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  serviceName: {
    fontSize: 16,
    color: "#333",
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fab636",
    marginTop: 5,
  },
  transactionInfo: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  servicePrice: {
    fontWeight: "bold",

  },
  noTransactionsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
    marginTop: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  footerContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  footerTop: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 25, // Add curve to the bottom-left corner
    borderBottomRightRadius: 25, // Add curve to the bottom-right corner
    height: 90,
    padding: 20,
    elevation: 5,
    top: 15,
    zIndex: 2
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  footerBottom: {
    width: "100%",
    padding: 20,
    overflow: "hidden", // Ensure the rounded corners are visible
  },
  footerImage: {
    resizeMode: "cover", 
    width: "111%", // Match the width of the container
  },
  paymentButton: {
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "transparent", // Remove solid color
  },
  paymentButtonText: {
    color: "#1a5242", // Adjust text color for visibility
    fontSize: 16,
    fontWeight: "bold",
    alignSelf:"flex-start"
  },
  collapseButton: {
    position: "absolute",
    right: 20,
    top: 40,
    width: 30,
    height: 30,
    borderRadius: 15,
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
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 16,
    color: "black",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    minHeight: 420, // Set your desired fixed height here
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    backgroundColor: '#1a5242',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 10,
    zIndex: 1000, // Add this line
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 2,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 2,
    padding: 8,
    backgroundColor: '#fff', // <-- Make input field white
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 30,
  },
  nextButtonText: {
    color: '#1a5242',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nextButtonCircle: {
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    right: 35,
  },
  nextButtonArrow: {
    color: '#1a5242',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

const Drawer = createDrawerNavigator();

const RequestedServices = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="RequestedServicesScreen" component={RequestedServicesScreen} />
  </Drawer.Navigator>
);


export default RequestedServices;
