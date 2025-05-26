import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
// FAQ Categories
const faqCategories = [
  { id: "1", title: "General Questions", icon: "help-circle-outline" },
  { id: "2", title: "Account & Profile", icon: "person-outline" },
  { id: "3", title: "Grave Search & Navigation", icon: "location-outline" },
  { id: "4", title: "Virtual Tributes & Features", icon: "flame-outline" },
  { id: "5", title: "Cemetery Services & Management", icon: "business-outline" },
  { id: "6", title: "Technical Support", icon: "settings-outline" },
];

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.menuSection}>
        {/* FAQs */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.navigate('FAQsGuestScreenContent');
          }}
        >
          <Image source={require('../assets/aboutIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextBlue}>FAQs</Text>
        </TouchableOpacity>

        {/* Services & Maintenance */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.navigate('GuestScreen');
          }}
        >
          <Image source={require('../assets/servicesIcon.png')} style={styles.drawerIcon} />
          <Text style={styles.drawerTextYellow}>Services & Maintenance</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button at the bottom */}
      <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 40 }}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => props.navigation.navigate('SignIn')}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

// Main FAQs Content Component
const FAQsGuestScreenContent = () => {
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
        } else {
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
        {/* Header with Hamburger Menu */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerToggle}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>FAQs for Guests</Text>
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

// Drawer Navigator
const Drawer = createDrawerNavigator();

const FAQsGuestScreen = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="FAQsGuestScreenContent" component={FAQsGuestScreenContent} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.04,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.012,
    marginTop: height * 0.06,
  },
  drawerToggle: {
    marginRight: width * 0.04,
    marginBottom: height * 0.05,
  },
  headerTitle: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginTop: height * 0.01,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.045,
    color: "#666",
    marginBottom: height * 0.025,
    marginHorizontal: width * 0.05,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: height * 0.03,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.012,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    flex: 1,
    fontSize: width * 0.045,
    fontWeight: "500",
    marginLeft: width * 0.03,
  },
  drawerContainer: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  menuSection: {
    marginVertical: height * 0.012,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.025,
  },
  drawerTextBlue: {
    fontSize: width * 0.045,
    marginLeft: width * 0.04,
    color: '#1580c2',
  },
  drawerTextYellow: {
    fontSize: width * 0.045,
    marginLeft: width * 0.04,
    color: '#cb9717',
  },
  drawerIcon: {
    width: width * 0.11,
    height: width * 0.11,
    resizeMode: 'contain',
    marginRight: width * 0.025,
  },
  signInButton: {
    backgroundColor: "#00aa13",
    paddingVertical: height * 0.018,
    borderRadius: width * 0.025,
    alignItems: "center",
    marginHorizontal: width * 0.04,
    marginTop: height * 0.025,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default FAQsGuestScreen;