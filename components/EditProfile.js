import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, ImageBackground, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [imageCacheBuster, setImageCacheBuster] = useState(Date.now()); // Add this line
  const [newValue, setNewValue] = useState(""); // New state for updated field value
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const navigation = useNavigation();
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";  

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then(userId => {
        if (!userId) return Promise.reject("No user ID found");
        return fetch(`${BASE_URL}/api/users/${userId}`);
      })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setFormData(data);
        setNewValue(data.name);
        setImage(data.profileImage); // Use Cloudinary URL directly
      })
      .catch(error => console.error("Error fetching user:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00aa13" />;
  }

  const handleChange = (field, value) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));

    AsyncStorage.getItem("userId").then(userId => {
      fetch(`${BASE_URL}/api/users/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === "Profile updated successfully") {
            setUser(prevUser => ({ ...prevUser, [field]: value }));
          } else {
            alert("Update failed!");
          }
        })
        .catch(error => console.error("Error updating profile:", error));
    });
  };

  const renderInfoItem = (label, field, editable = true) => {
    const isFieldEmpty = !formData[field]; // Check if the field is empty
    return (
      <View style={styles.infoItem}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.infoRow}>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => {
              if (!editable) return; // Disable editing for non-editable fields
              setEditingField(field);
              setNewValue(formData[field] || ""); // Set current value for editing
              setModalVisible(true); // Show modal when editing
            }}
            disabled={!editable} // Disable touch for non-editable fields
          >
            <Text style={[styles.value, !editable && styles.disabledText]}>
              {field === "email" && formData[field]
                ? (() => {
                    const [name, domain] = formData[field].split("@");
                    if (!domain) return formData[field];
                    return `${name}@${domain.slice(0, 2)}...`;
                  })()
                : field === "name" && formData[field]
                  ? formData[field].length > 16
                    ? `${formData[field].slice(0, 16)}...`
                    : formData[field]
                  : formData[field] || "Add"}
            </Text> 
             {/* Add green checkmark for verified email */}
          {field === "email" && (
            <Ionicons name="checkmark-circle" size={RFValue(20, height)} color="green" style={styles.verifiedIcon} />
          )}
            {/* Show right arrow only for editable fields */}
            {editable && <Ionicons name="chevron-forward" size={RFValue(20, height)} color="gray" style={styles.arrowIcon} />}
          </TouchableOpacity>
         
        </View>
      </View>
    );
  };

  const handleUpdate = () => {
    if (editingField === "name") {
      const nameRegex = /^[A-Za-z\s]{5,45}$/;
      if (!nameRegex.test(newValue.trim())) {
        alert("Name must be 5-45 characters only (no numbers or symbols).");
        return;
      }
    }
    if (editingField === "mobile") {
      const mobileRegex = /^\d{11}$/;
      if (!mobileRegex.test(newValue.trim())) {
        alert("Mobile number must be exactly 11 digits and contain only numbers.");
        return;
      }
    }
    handleChange(editingField, newValue); // Update the field based on current selection
    setModalVisible(false); // Close the modal after update
  };

  const handlePickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    const selectedImage = result.assets[0].uri;
    setImage(selectedImage);
    setImageCacheBuster(Date.now()); // Update cache buster only when image changes
    setUser((prevUser) => ({ ...prevUser, profileImage: selectedImage }));

    // Upload image to the server
    uploadImage(selectedImage);
  }
};


const uploadImage = async (imageUri) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      alert("Error: User ID not found.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", {
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    console.log("Uploading to:", `${BASE_URL}/api/users/upload-image/${userId}`);

    const response = await fetch(`${BASE_URL}/api/users/upload-image/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    const text = await response.text();
    console.log("Server response:", text);

    const data = JSON.parse(text);
    if (data.imageUrl) {
      alert("Profile image updated successfully!");
      setImage(data.imageUrl);
      setImageCacheBuster(Date.now()); // Update cache buster only when image changes
      setUser((prevUser) => ({ ...prevUser, profileImage: data.imageUrl }));
    } else {
      alert("Failed to update profile image.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("An error occurred while uploading the image.");
  }
};



  return (
    <>
    <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground source={require('../assets/ProfileBG.png')} style={styles.background}>
        <View style={styles.outerContainer}>
          <View style={styles.back}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Image source={require('../assets/BackButton.png')} style={styles.backImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
          <View style={styles.imageContainer}>
  <View style={{ position: 'relative' }}>
    <Image
      source={
        image
          ? { uri: `${image}?t=${imageCacheBuster}` } // Use cache buster from state
          : require('../assets/blankDP.jpg') // fallback local image
      }
      style={styles.profileImage}
    />
    <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
      <Ionicons name="camera" size={RFValue(28, height)} color="black" />
    </TouchableOpacity>
  </View>
</View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.name}>
                {formData?.name
                  ? formData.name.length > 16
                    ? `${formData.name.slice(0, 16)}...`
                    : formData.name
                  : 'Full Name'}
              </Text>
              <Text style={styles.location}>{formData?.city || 'Province, City'}</Text>
            </View>
              <View style={styles.separator}></View>
              {/* Personal Information */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Personal Information</Text>
                {renderInfoItem('Name', 'name')}
                {renderInfoItem('Mobile Number', 'mobile')}
                {renderInfoItem('Email', 'email', false)}
                {renderInfoItem('Nationality', 'nationality', false)}
                {renderInfoItem('Gender', 'gender', false)}
              </View>
              <View style={styles.separator}></View>
              {/* Account & Security */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Account & Security</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")} style={styles.infoRow}>
                  <Text style={styles.linkText}>Change Password</Text>
                  <Ionicons name="chevron-forward" size={RFValue(20, height)} color="gray" style={styles.arrowIcon} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
        {/* Modal for Editing Fields */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <KeyboardAvoidingView
                style={styles.modalContent}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              >
                <Text style={styles.modalHeader}>{editingField?.charAt(0).toUpperCase() + editingField?.slice(1)}</Text>
                <TextInput
                  style={styles.input}
                  value={newValue}
                  onChangeText={setNewValue}
                  placeholder={`Enter your ${editingField}`}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                  <Text style={styles.updateText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', resizeMode: 'cover' },
  outerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: wp('8%'),
    padding: wp('4.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignSelf: 'center',
    maxHeight: '80%',
    top: hp('4%'),
  },
  imageContainer: {
    position: 'absolute',
    top: -hp('7%'),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  profileImage: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    borderWidth: 2,
    borderColor: '#00aa13',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: wp('6%'),
    padding: wp('1.5%'),
  },
  header: { alignItems: 'center', marginTop: hp('9%') },
  name: { fontSize: RFValue(22, height), fontWeight: 'bold', marginTop: hp('1.2%') },
  location: { fontSize: RFValue(15, height), color: '#6d6d6d' },
  sectionContainer: { padding: wp('5%') },
  sectionHeader: { fontSize: RFValue(15, height), fontWeight: 'bold', marginBottom: hp('1.2%'), color: '#00aa13' },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1.2%') },
  label: { color: 'gray', fontSize: RFValue(13, height) },
  infoRow: { flexDirection: 'row', alignItems: 'center',  },
  value: { color: 'black', fontSize: RFValue(15, height) },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: hp('1.2%'),
    width: '100%',
    fontSize: RFValue(15, height),
    borderWidth: 1,
    borderRadius: wp('2.5%'),
    padding: wp('3%'),
    marginBottom: hp('1.2%'),
    backgroundColor: '#fff',
  },
  icon: { marginLeft: wp('1.2%') },
  arrowIcon: { left: wp('3%'), marginLeft: -wp('2%') },
  separator: {
    marginTop: hp('1.8%'),
    height: 1,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#ddd',
  },
  modalContainer: {
    position: 'absolute', // changed from flex: 1
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: wp('7%'),
    width: '100%',
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: RFValue(16, height),
    marginBottom: hp('1.2%'),
    color: 'gray',
    alignSelf: 'flex-start',
  },
  updateButton: {
    backgroundColor: '#fab636',
    padding: hp('1.8%'),
    borderRadius: wp('4.5%'),
    width: '100%',
    marginBottom: hp('0.8%'),
    marginTop: hp('2.5%'),
  },
  updateText: { color: 'white', textAlign: 'center', fontSize: RFValue(15, height) },
  closeButton: { padding: hp('1.2%'), alignItems: 'center' },
  closeButtonText: { color: 'gray', fontSize: RFValue(15, height) },
  back: {
    alignSelf: 'flex-start',
    bottom: hp('8%'),
    left: wp('7%'),
  },
  backButton: {},
  backImage: {
    width: wp('12%'),
    height: wp('12%'),
  },
  disabledText: {
    color: "gray",
  },
  verifiedIcon: {
    marginLeft: wp('1.2%'),
    marginRight: -wp('2.5%'),
  },
  linkText: {
    fontSize: RFValue(15, height),
    marginTop: hp('1%'),
    color: 'gray',
    bottom: hp('0.6%'),
  },
});

export default EditProfile;
