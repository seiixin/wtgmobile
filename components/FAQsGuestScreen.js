import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
      <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: hp('5%') }}>
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
          {/* Header with Hamburger Menu */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerToggle}>
              <Ionicons name="menu" size={wp('7%')} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>FAQs for Guests</Text>
          <Text style={styles.subtitle}>Choose a Category</Text>

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
    resizeMode: 'cover',
  },
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
  drawerToggle: {
    marginRight: wp('4%'),
    marginBottom: hp('5%'),
    bottom: hp('2%'),
  },
  headerTitle: {
    fontSize: wp('8%'),
    fontWeight: "bold",
    marginTop: hp('1%'),
    textAlign: "center",
  },
  subtitle: {
    fontSize: wp('4%'),
    color: "#666",
    marginBottom: hp('2.5%'),
    marginHorizontal: wp('5%'),
    textAlign: "center",
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
    fontSize: wp('4.2%'),
    fontWeight: "500",
    marginLeft: wp('2.5%'),
  },
  drawerContainer: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  menuSection: {
    marginVertical: hp('1.2%'),
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3.5%'),
    borderRadius: wp('2.5%'),
  },
  drawerTextBlue: {
    fontSize: wp('4%'),
    marginLeft: wp('3.5%'),
    color: '#1580c2',
  },
  drawerTextYellow: {
    fontSize: wp('4%'),
    marginLeft: wp('3.5%'),
    color: '#cb9717',
  },
  drawerIcon: {
    width: wp('10%'),
    height: wp('10%'),
    resizeMode: 'contain',
    marginRight: wp('2.5%'),
  },
  signInButton: {
    backgroundColor: "#00aa13",
    paddingVertical: hp('1.8%'),
    borderRadius: wp('2.5%'),
    alignItems: "center",
    marginHorizontal: wp('4%'),
    marginTop: hp('2.5%'),
  },
  signInButtonText: {
    color: "#fff",
    fontSize: wp('4.5%'),
    fontWeight: "bold",
  },
});

export default FAQsGuestScreen;