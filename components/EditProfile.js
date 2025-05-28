import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Dimensions, ScrollView, StyleSheet, ImageBackground, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
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
        setNewValue(data.name); // Initialize with user's current name
        setImage(`${BASE_URL}${data.profileImage}`);  // Initialize image state
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
                : formData[field] || "Add"}
            </Text> 
             {/* Add green checkmark for verified email */}
          {field === "email" && (
            <Ionicons name="checkmark-circle" size={20} color="green" style={styles.verifiedIcon} />
          )}
            {/* Show right arrow only for editable fields */}
            {editable && <Ionicons name="chevron-forward" size={20} color="gray" style={styles.arrowIcon} />}
          </TouchableOpacity>
         
        </View>
      </View>
    );
  };

  const handleUpdate = () => {
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
    setImage(selectedImage);  // ✅ Save image locally
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
    if (data.success) {
      alert("Profile image updated successfully!");
      setImage(imageUri); // ✅ Update image in state after successful upload
      setUser((prevUser) => ({ ...prevUser, profileImage: imageUri }));
    } else {
      alert("Failed to update profile image.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("An error occurred while uploading the image.");
  }
};



  return (
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
    <Image source={{ uri: `${image}?t=${new Date().getTime()}` }} style={styles.profileImage} />
    <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
      <Ionicons name="camera" size={40} color="black" />
    </TouchableOpacity>
  </View>
</View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.name}>{formData?.name || 'Full Name'}</Text>
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
              <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
                <Text style={styles.linkText}>Change Password</Text>
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
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', resizeMode: 'cover' },
  outerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: width * 0.08,
    padding: width * 0.045,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignSelf: 'center',
    maxHeight: '80%',
    top: height * 0.04,
  },
  imageContainer: {
  position: 'absolute',
  top: -height * 0.07,
  left: 0,
  right: 0,
  alignItems: 'center',
  zIndex: 2,
},
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 2,
    borderColor: '#00aa13',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: width * 0.06,
    padding: width * 0.015,
  },
  header: { alignItems: 'center', marginTop: height * 0.09 },
  name: { fontSize: width * 0.065, fontWeight: 'bold', marginTop: height * 0.012 },
  location: { fontSize: width * 0.045, color: '#6d6d6d' },
  sectionContainer: { padding: width * 0.05 },
  sectionHeader: { fontSize: width * 0.045, fontWeight: 'bold', marginBottom: height * 0.012, color: '#00aa13' },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.012 },
  label: { color: 'gray', fontSize: width * 0.04 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  value: { color: 'black', fontSize: width * 0.045 },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: height * 0.012,
    width: '100%',
    fontSize: width * 0.045,
    borderWidth: 1,
    borderRadius: width * 0.025,
    padding: width * 0.03,
    marginBottom: height * 0.012,
    backgroundColor: '#fff',
  },
  icon: { marginLeft: width * 0.012 },
  arrowIcon: { marginLeft: width * 0.012 },
  separator: {
    marginTop: height * 0.018,
    height: 1,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: width * 0.07,
    width: '100%',
    borderTopLeftRadius: width * 0.08,
    borderTopRightRadius: width * 0.08,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: width * 0.05,
    marginBottom: height * 0.012,
    color: 'gray',
    alignSelf: 'flex-start',
  },
  updateButton: {
    backgroundColor: '#fab636',
    padding: height * 0.018,
    borderRadius: width * 0.045,
    width: '100%',
    marginBottom: height * 0.008,
    marginTop: height * 0.025,
  },
  updateText: { color: 'white', textAlign: 'center', fontSize: width * 0.045 },
  closeButton: { padding: height * 0.012, alignItems: 'center' },
  closeButtonText: { color: 'gray', fontSize: width * 0.045 },
  back: {
    alignSelf: 'flex-start',
    marginBottom: height * 0.04,
    bottom: height * 0.13,
    left: width * 0.05,
  },
  backButton: {},
  backImage: {
    width: width * 0.09,
    height: width * 0.09,
  },
  disabledText: {
    color: "gray",
  },
  verifiedIcon: {
    marginLeft: width * 0.012,
    marginRight: -width * 0.025,
  },
});

export default EditProfile;
