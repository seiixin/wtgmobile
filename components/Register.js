import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal, Platform, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import DateTimePicker from '@react-native-community/datetimepicker';

const Register = () => {

  
  const [genderOpen, setGenderOpen] = useState(false);
  const genderItems = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const [nationalityOpen, setNationalityOpen] = useState(false);
  const nationalityItems = [
    { label: 'Filipino', value: 'Filipino' },
    
  ];

  const [provinceOpen, setProvinceOpen] = useState(false);
  const provinceItems = [{ label: 'Metro Manila', value: 'Metro Manila' }];

  const [cityOpen, setCityOpen] = useState(false);
  const cityItems = [
    { label: 'Manila', value: 'Manila' },
    { label: 'Quezon City', value: 'Quezon City' },
    { label: 'Makati', value: 'Makati' },
    { label: 'Taguig', value: 'Taguig' },
    { label: 'Pasig', value: 'Pasig' },
    { label: 'Caloocan', value: 'Caloocan' },
    { label: 'Parañaque', value: 'Parañaque' },
    { label: 'Las Pinas City', value: 'Las Pinas City' },
    { label: 'Muntinlupa', value: 'Muntinlupa' },
    { label: 'Marikina', value: 'Marikina' },
    { label: 'Valenzuela', value: 'Valenzuela' },
  ];

  const [districtOpen, setDistrictOpen] = useState(false);
  const districtItems = [
    { label: 'District 1', value: 'District 1' },
    { label: 'District 2', value: 'District 2' },
    { label: 'District 3', value: 'District 3' },
    { label: 'District 4', value: 'District 4' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    nationality: 'Filipino',
    email: '',
    mobile: '',
    province: 'Metro Manila',
    city: 'Las Pinas City',
    district: 'District 3',
    password: '',
    confirmPassword: '', // New field for confirm password
  });

  const [checked, setChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const [dateOfBirth, setDateOfBirth] = useState(''); // Store selected date as string
  const [datePickerVisible, setDatePickerVisible] = useState(false); // To toggle the date picker visibility
  const [selectedDate, setSelectedDate] = useState(new Date()); // Store the actual date object
  const [passwordMatch, setPasswordMatch] = useState(true); // Track password match

  const navigation = useNavigation();

  const toggleDatepicker = () => {
    setDatePickerVisible(!datePickerVisible);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      setSelectedDate(selectedDate); // Set the selected date
    }
  };

  const confirmDate = () => {
    const formattedDate = formatDate(selectedDate); // Format the date
    setDateOfBirth(formattedDate); // Update the local display of the date
    
    // Update the dob field in formData
    setFormData((prevData) => ({
      ...prevData,
      dob: formattedDate, // Ensure dob is set in formData
    }));

    setDatePickerVisible(false); // Hide the modal after confirming the date
  };

  const cancelDate = () => {
    setDatePickerVisible(false); // Hide the modal if canceled
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`; // Format date as MM/DD/YYYY
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    
    // Check if the passwords match whenever the user types in confirmPassword
    if (field === 'confirmPassword' || field === 'password') {
      setPasswordMatch(formData.password === value); // Update password match state
    }
  };

  const handleDropdownChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const validateMobile = (mobile) => {
    const regex = /^[0-9]{11}$/;
    return regex.test(mobile);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    console.log("Form Data Submitted: ", formData);
  
    if (!formData.name || !formData.email || !formData.password || !formData.gender || !formData.dob || !formData.confirmPassword) {
      alert('Please fill all required fields');
      return;
    }
  
    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
  
    if (!validateMobile(formData.mobile)) {
      alert('Please enter a valid 11-digit mobile number');
      return;
    }
  
    if (!checked) {
      alert('Please agree to the Terms & Conditions');
      return;
    }

    if (!passwordMatch) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('https://walktogravemobile-backendserver.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure dob is included here
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Response data:', data);
        alert('User Registered Successfully');
        navigation.navigate('SignIn');
      } else {
        console.error('Error Response:', data);
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Network error during registration:', error);
      alert('Error registering user');
    }
  };

  return (
    <ImageBackground source={require('../assets/RegisterBg.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Register Account</Text>
        <Text style={styles.subheader}>Register as a <Text style={{ fontWeight: 'bold', color: 'black' }}>relative user</Text> by filling out your information below.</Text>

        {/* Name */}
        <Text style={styles.label}>Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#D3D3D3"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />

        {/* Gender, Date of Birth, and Nationality - Horizontally Aligned */}
        <View style={styles.horizontalContainer}>
          <View style={{ zIndex: 3000, width: '33%' }}>
            <Text style={styles.label}>Gender*</Text>
            <DropDownPicker
              open={genderOpen}
              value={formData.gender}
              items={genderItems}
              setOpen={setGenderOpen}
              setValue={(callback) => handleDropdownChange('gender', callback(formData.gender))}
              placeholder="Gender"
              style={styles.input}
              dropDownStyle={{ borderColor: 'gray' }}
            />
          </View>

          <View style={{ zIndex: 2000, width: '30%' }}>
            <Text style={styles.label}>Date of Birth*</Text>
            <Pressable onPress={toggleDatepicker}>
              <TextInput
                style={styles.inputDate}
                placeholder="Select Date"
                value={dateOfBirth}
                editable={false}
                onPressIn={toggleDatepicker}
              />
            </Pressable>
          </View>

          <View style={{ zIndex: 1000, width: '35%' }}>
            <Text style={styles.label}>Nationality*</Text>
            <DropDownPicker
              open={nationalityOpen}
              value={formData.nationality}
              items={nationalityItems}
              setOpen={setNationalityOpen}
              setValue={(callback) => handleDropdownChange('nationality', callback(formData.nationality))}
              placeholder="Nationality"
              style={styles.input}
              dropDownStyle={{ borderColor: 'gray' }}
            />
          </View>
        </View>

        {/* Email, Mobile, Address, and Password */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#D3D3D3"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile number*</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile number"
              placeholderTextColor="#D3D3D3"
              value={formData.mobile}
              onChangeText={(text) => handleInputChange('mobile', text)}
              keyboardType="numeric"
              maxLength={11}
            />
          </View>
        </View>

        {/* Province, City, District - Horizontally Aligned */}
        <View style={styles.horizontalContainer}>
          <View style={{ zIndex: 3000, width: '33%' }}>
            <Text style={styles.label}>Province*</Text>
            <DropDownPicker
              open={provinceOpen}
              value={formData.province}
              items={provinceItems}
              setOpen={setProvinceOpen}
              setValue={(callback) => handleDropdownChange('province', callback(formData.province))}
              placeholder="Province"
              style={styles.input}
              dropDownStyle={{ borderColor: 'gray' }}
            />
          </View>

          <View style={{ zIndex: 2000, width: '36%' }}>
            <Text style={styles.label}>City*</Text>
            <DropDownPicker
              open={cityOpen}
              value={formData.city}
              items={cityItems}
              setOpen={setCityOpen}
              setValue={(callback) => handleDropdownChange('city', callback(formData.city))}
              placeholder="City"
              style={styles.input}
              dropDownStyle={{ borderColor: 'gray' }}
            />
          </View>

          <View style={{ zIndex: 1000, width: '30%' }}>
            <Text style={styles.label}>District*</Text>
            <DropDownPicker
              open={districtOpen}
              value={formData.district}
              items={districtItems}
              setOpen={setDistrictOpen}
              setValue={(callback) => handleDropdownChange('district', callback(formData.district))}
              placeholder="District"
              style={styles.input}
              dropDownStyle={{ borderColor: 'gray' }}
            />
          </View>
        </View>

        {/* Password and Confirm Password */}
        <Text style={styles.label}>Password*</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#D3D3D3"
            secureTextEntry={!isPasswordVisible} // Toggle between visible and hidden password
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons 
              name={isPasswordVisible ? "eye" : "eye-off"} // Toggle between eye and eye-off
              size={24} 
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password*</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#D3D3D3"
          secureTextEntry={!isPasswordVisible} // Toggle between visible and hidden password
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
        />
        {!passwordMatch && <Text style={styles.errorText}>Passwords do not match!</Text>}

        {/* Terms & Conditions */}
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxWrapper}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
            />
          </View>
          <Text>
            Agree with <Text style={{ color: 'green' }}>Terms & Conditions</Text>
          </Text>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Link */}
      <Text style={styles.signInLink}>
        <Text style={styles.blackText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.redText}>Sign In</Text>
        </TouchableOpacity>
      </Text>

      {/* Date Picker Modal */}
      <Modal visible={datePickerVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={selectedDate}
              onChange={onDateChange}
              minimumDate={new Date('1900-01-01')} // Limit to start from January 1, 1900
              maximumDate={new Date()} // Limit to today's date
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={cancelDate} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDate} style={styles.button}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  container: {
    marginTop: 120,
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 30, 
    width: "100%",
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  inputDate: {
    height: 50, 
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width:"104%"
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#fdbd21',
    padding: 11,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 350,
    backgroundColor: 'gray',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'gray',
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: '#fdbd21',
    padding: 12,
    borderRadius: 50,
    width: 220,
    alignSelf: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInLink: {
    color: 'red',
    textAlign: 'center',
    top: 10,
  },
  blackText: {
    color: "#000",
  },
  redText: {
    color: "red",
    fontWeight: "bold",
    top: 4
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 10,
  },
  checkboxWrapper: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    marginRight: 10,
    height: 35,
    width: 35,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Register;
