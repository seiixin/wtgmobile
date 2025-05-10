import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestedServices = () => {
  const [activeTab, setActiveTab] = useState("Request Cart"); // Track the active tab
  const [requestedServices, setRequestedServices] = useState([]);
  const [paidTransactions, setPaidTransactions] = useState([]); // Store paid transactions
  const [selectedServices, setSelectedServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0); // Track total spent for paid transactions

  const serviceIcons = {
    "Yearly Grave Cleaning": require("../assets/YearlyIcon.png"),
    "Electricity Use": require("../assets/ElectricityIcon.png"),
    "Construction Permit": require("../assets/PerrmitIcon.png"),
    "Niche Demolition": require("../assets/DemolitionIcon.png"),
    "Lot for Lease Existing Fee": require("../assets/LotIcon.png"),
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
    fetch(`https://walktogravemobile-backendserver.onrender.com/api/paid-transactions/${userId}`, {
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          console.error(`Error fetching paid transactions: ${response.status}`);
          setPaidTransactions([]); // Set to an empty array if the response is not OK
          setTotalSpent(0); // Set total spent to 0
          return;
        }
        const data = await response.json();
        setPaidTransactions(data.data || []); // Ensure it's an array even if undefined
        const totalSpentAmount = (data.data || []).reduce((sum, transaction) => sum + transaction.price, 0);
        setTotalSpent(totalSpentAmount); // Calculate total spent
      })
      .catch(error => {
        console.error("Error fetching paid transactions:", error);
        setPaidTransactions([]); // Set to an empty array if there's an error
      });
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "Paid Transactions" && paidTransactions.length === 0) {
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

  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => handleTabSwitch("Paid Transactions")}>
          <Text style={[styles.tab, activeTab === "Paid Transactions" && styles.activeTab]}>
            Paid Transactions
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === "Request Cart" ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedServices.map((service) => (
            <View key={service._id} style={styles.serviceRow}>
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
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {paidTransactions.length > 0 ? (
            paidTransactions.map((transaction) => (
              <View key={transaction._id} style={styles.transactionCard}>
                <Image source={serviceIcons[transaction.serviceName]} style={styles.serviceIcon} />
                <View style={styles.transactionDetails}>
                  <Text style={styles.serviceName}>{transaction.serviceName}</Text>
                  <Text style={styles.transactionStatus}>{transaction.status}</Text>
                  <Text style={styles.transactionInfo}>Paid by: {transaction.paymentMethod}</Text>
                  <Text style={styles.transactionInfo}>Order Time: {transaction.orderTime}</Text>
                  <Text style={styles.transactionInfo}>Payment Time: {transaction.paymentTime}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noTransactionsText}>No paid transactions available.</Text>
          )}
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total Spent:</Text>
            <Text style={styles.totalAmount}>₱{totalSpent.toLocaleString()}</Text>
          </View>
        </ScrollView>
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
            <TouchableOpacity style={styles.paymentButton} onPress={handleProceedToPayment}>
              <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.collapseButton}>
              <Text style={styles.collapseIcon}>⌃</Text> 
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
});

export default RequestedServices;
