import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestedServices = () => {
  const [requestedServices, setRequestedServices] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchRequestedServices = async () => {
      const token = await AsyncStorage.getItem('token');  // Get token

      if (!token) {
        alert('Please login first');
        return;
      }

      fetch("http://192.168.0.26:8000/api/service-request", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  // Pass token in header
        },
      })
      .then(response => response.json())
      .then(data => {
        setRequestedServices(data.data);
        const totalPrice = data.data.reduce((sum, service) => sum + service.price, 0);
        setTotal(totalPrice);  // Calculate total price
      })
      .catch(error => {
        console.error("Error fetching requested services:", error);
        alert("An error occurred while fetching the services.");
      });
    };

    fetchRequestedServices();
  }, []);  // Run the effect on component mount

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Requested Services</Text>
      {requestedServices.map((service) => (
        <View key={service._id} style={styles.serviceCard}>
          <Text style={styles.serviceName}>{service.serviceName}</Text>
          <Text style={styles.servicePrice}>₱{service.price.toLocaleString()}</Text>
        </View>
      ))}
      <Text style={styles.totalText}>Total: ₱{total.toLocaleString()}</Text>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  serviceCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 16,
    color: 'green',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 20,
  },
});

export default RequestedServices;
