// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';

// const CustomDrawerContent = (props) => {
//   const navigation = useNavigation();
//   const [user, setUser] = useState(null);

//   const handleSignOut = async () => {
//     try {
//       await AsyncStorage.removeItem("userId");
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'GetStarted' }],
//       });
//     } catch (error) {
//       console.error("Error during sign out:", error);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       AsyncStorage.getItem("userId")
//         .then(userId => {
//           if (!userId) return Promise.reject("No user ID found");
//           return fetch(`http://192.168.0.32:8000/api/users/${userId}`);
//         })
//         .then(response => response.json())
//         .then(data => setUser(data))
//         .catch(error => console.error("Error fetching user:", error));
//     }, [])
//   );

//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
//       <View style={styles.profileSection}>
//         <Text style={styles.profileName}>{user?.name || "Loading..."}</Text>
//         <Text style={styles.profileLocation}>{user?.city || "Loading..."}</Text>
//         <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
//           <MaterialIcons name="edit" size={16} color="green" />
//           <Text style={styles.editProfileText}>Edit Profile</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.menuSection}>
//         <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('MainTabs', { screen: 'HistoryTab' })}>
//           <Image source={require('../assets/homeIcon.png')} style={styles.drawerIcon} />
//           <Text style={styles.drawerText}>Home</Text>
//         </TouchableOpacity>
//         {/* Add other menu items here */}
//       </View>

//       <View style={styles.signOutSection}>
//         <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
//           <FontAwesome name="sign-out" size={24} color="black" />
//           <Text style={styles.signOutText}>Sign out</Text>
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   drawerContainer: {
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   profileLocation: {
//     fontSize: 14,
//     color: '#555',
//   },
//   editProfileButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   editProfileText: {
//     fontSize: 14,
//     color: 'green',
//     marginLeft: 5,
//   },
//   menuSection: {
//     marginVertical: 10,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//   },
//   drawerIcon: {
//     width: 30,
//     height: 30,
//     marginRight: 10,
//   },
//   drawerText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   signOutSection: {
//     marginTop: 'auto',
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//     paddingTop: 10,
//   },
//   signOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//   },
//   signOutText: {
//     fontSize: 16,
//     marginLeft: 10,
//     color: '#333',
//   },
// });

// export default CustomDrawerContent;
