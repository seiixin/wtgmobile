import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const faqCategories = [
    { id: "1", title: "General Questions", icon: "help-circle-outline" },
    { id: "2", title: "Account & Profile", icon: "person-outline" },
    { id: "3", title: "Grave Search & Navigation", icon: "location-outline" },
    { id: "4", title: "Virtual Tributes & Features", icon: "flame-outline" },
    { id: "5", title: "Cemetery Services & Management", icon: "business-outline" },
    { id: "6", title: "Technical Support", icon: "settings-outline" },
];

const FAQsGuestScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        if (item.title === "General Questions") {
          navigation.navigate("GuestGeneralQuestions");
        } else if (item.title === "Account & Profile") {
          navigation.navigate("GuestAccountandProfile");
        } else if (item.title === "Grave Search & Navigation") {
            navigation.navigate("GuestGraveSearch");
        } else if (item.title === "Virtual Tributes & Features") {
            navigation.navigate("GuestVirtualTributes");
        } else if (item.title === "Cemetery Services & Management") {
            navigation.navigate("GuestCemeteryServices");
        } else if (item.title === "Technical Support") {
            navigation.navigate("GuestTechnicalSupport");
        }
        else {
          alert(`Category: ${item.title}`); // Placeholder for other categories
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FAQs for Guests</Text>
        </View>

        <Text style={styles.subtitle}>Choose a Category</Text>

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

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  topBar: { flexDirection: 'row', padding: 15, alignItems: 'center' },
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
    marginHorizontal: 20,
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

export default FAQsGuestScreen;