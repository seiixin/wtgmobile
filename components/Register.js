import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal, Platform, Pressable, Dimensions, ScrollView, StatusBar, KeyboardAvoidingView } from 'react-native';
import CustomDropdown from './CustomDropdown';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import DateTimePicker from '@react-native-community/datetimepicker';
import ConfirmationModal from '../components/modals/ConfirmationModal'; // Adjust the path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";
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
    confirmPassword: '',
  });

  const [checked, setChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for Password visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // State for Confirm Password visibility
  const [dateOfBirth, setDateOfBirth] = useState(''); // Store selected date as string
  const [datePickerVisible, setDatePickerVisible] = useState(false); // To toggle the date picker visibility
  const [selectedDate, setSelectedDate] = useState(new Date()); // Store the actual date object
  const [passwordMatch, setPasswordMatch] = useState(true); // Track password match
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [termsVisible, setTermsVisible] = useState(false);

  const navigation = useNavigation();

  const toggleDatepicker = () => {
    setDatePickerVisible(true);
  };

  const onDateChange = (event, date) => {
    if (event.type === 'set' && date) {
      setSelectedDate(date);
      const formattedDate = formatDate(date);
      setDateOfBirth(formattedDate);
      setFormData((prevData) => ({
        ...prevData,
        dob: formattedDate,
      }));
    }
    setDatePickerVisible(false);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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

  const validateMobile = (mobile) => /^[0-9]{11}$/.test(mobile);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePassword = (password) =>
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[@$!%*?&#]/.test(password);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRegister = async () => {
    console.log("Form Data Submitted: ", formData);

    // Validation Rules
    if (!formData.name || formData.name.length < 5) {
      alert("Name must be at least 5 characters long.");
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Check if email already exists before proceeding
    try {
      const emailCheck = await fetch(`${BASE_URL}/api/users/find-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (emailCheck.ok) {
        alert("This email is already registered. Please use a different email.");
        return;
      }
    } catch (err) {
      // If error is 404, email is not found, so it's OK to proceed
      // If other error, show a generic error
      if (err?.response?.status !== 404) {
        alert("Error checking email. Please try again.");
        return;
      }
    }

    if (!formData.mobile || !validateMobile(formData.mobile)) {
      alert("Please enter a valid 11-digit mobile number.");
      return;
    }

    if (!formData.password || !validatePassword(formData.password)) {
      alert("Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.");
      return;
    }

    if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!checked) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }

    try {
      // Check if the timer is still active
      const savedTime = await AsyncStorage.getItem(`verificationTimer_${formData.email}`);
      if (savedTime) {
        const remainingTime = parseInt(savedTime, 10) - Math.floor(Date.now() / 1000);
        if (remainingTime > 0) {
          alert(`Please wait for the countdown to finish before resending the OTP. Time left: ${formatTime(remainingTime)}`);
          return;
        }
      }

      // Step 1: Send OTP to the user's email
      const response = await fetch(`${BASE_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP sent successfully:", data);

        // Save the timer in AsyncStorage
        const newTime = 60; // 1 minute
        await AsyncStorage.setItem(`verificationTimer_${formData.email}`, (Math.floor(Date.now() / 1000) + newTime).toString());

        // Step 2: Navigate to the VerificationRegister screen
        navigation.navigate("VerificationRegister", { email: formData.email, formData });
      } else {
        console.error("Error sending OTP:", data);
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Network error during OTP sending:", error);
      alert("Error sending OTP");
    }
  };

  const handleVerifyCode = async () => {
    try {
      // Step 1: Verify the OTP
      const response = await fetch(`${BASE_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP verified successfully:", data);

        // Step 2: Complete the registration process
        const registerResponse = await fetch(`${BASE_URL}/api/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(route.params.formData), // Use formData passed from Register.js
        });

        const registerData = await registerResponse.json();

        if (registerResponse.ok) {
          alert('Registration completed successfully!');
          navigation.navigate("SignIn"); // Navigate to the SignIn screen
        } else {
          console.error('Error completing registration:', registerData);
          alert(registerData.message || 'Registration failed');
        }
      } else {
        alert("Invalid or expired OTP. Please try again.");
        console.error("OTP verification error:", data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Please try again.");
    }
  };

  const { height, width } = Dimensions.get('window');

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Fixed background image */}
      <ImageBackground
        source={require('../assets/RegisterBg.png')}
        style={styles.fixedBackground}
        resizeMode="cover"
      />
      {/* Overlay content */}
      <SafeAreaView style={{ flex: 1 }}>
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={0}
          >
            <ScrollView
              contentContainerStyle={{ alignItems: 'center', paddingBottom: hp('5%') }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              <Image source={require('../assets/RegisLogo.png')} style={{ width: wp('35%'), height: hp('15%'), marginTop: hp('5%') }} />
              <View style={styles.container}>
                <Text style={styles.header}>Register Account</Text>
                <Text style={styles.subheader}>Register as a <Text style={{ fontWeight: 'bold', color: 'black' }}>visitor</Text> by filling out your information below.</Text>

                {/* Name */}
                <Text style={styles.label}>Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#D3D3D3"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  maxLength={50} // Limit to 50 characters
                />

                {/* Gender, Date of Birth, and Nationality - Horizontally Aligned */}
                <View style={styles.horizontalContainer}>
                  <View style={{ zIndex: 3000, width: '33%' }}>
                    <CustomDropdown
                      label="Gender*"
                      value={formData.gender}
                      items={genderItems}
                      onSelect={(val) => handleDropdownChange('gender', val)}
                      placeholder="Gender"
                      width="100%"
                    />
                  </View>

                  <View style={{ zIndex: 2000, width: '30%' }}>
                    <Text style={styles.label}>Date of Birth*</Text>
                    <Pressable onPress={toggleDatepicker}>
                      <View style={styles.inputDate}>
                        <Text style={{ color: dateOfBirth ? '#000' : '#D3D3D3', fontSize: wp('3.8%'), fontFamily: 'Inter_400Regular' }}>
                          {dateOfBirth || "Select Date"}
                        </Text>
                      </View>
                    </Pressable>
                    {datePickerVisible && (
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                      />
                    )}
                  </View>

                  <View style={{ zIndex: 1000, width: '35%' }}>
                    <CustomDropdown
                      label="Nationality*"
                      value={formData.nationality}
                      items={nationalityItems}
                      onSelect={(val) => handleDropdownChange('nationality', val)}
                      placeholder="Nationality"
                      width="100%"
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
                      maxLength={100} // Limit to 100 characters
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
                      maxLength={11} // Limit to 11 digits
                    />
                  </View>
                </View>

                {/* Province, City, District - Horizontally Aligned */}
                <View style={styles.horizontalContainer}>
                  <View style={{ zIndex: 3000, width: '33%' }}>
                    <CustomDropdown
                      label="Province*"
                      value={formData.province}
                      items={provinceItems}
                      onSelect={(val) => handleDropdownChange('province', val)}
                      placeholder="Province"
                      width="100%"
                    />
                  </View>

                  <View style={{ zIndex: 2000, width: '36%' }}>
                    <CustomDropdown
                      label="City*"
                      value={formData.city}
                      items={cityItems}
                      onSelect={(val) => handleDropdownChange('city', val)}
                      placeholder="City"
                      width="100%"
                    />
                  </View>

                  <View style={{ zIndex: 1000, width: '30%' }}>
                    <CustomDropdown
                      label="District*"
                      value={formData.district}
                      items={districtItems}
                      onSelect={(val) => handleDropdownChange('district', val)}
                      placeholder="District"
                      width="100%"
                    />
                  </View>
                </View>

                {/* Password */}
                <Text style={styles.label}>Password*</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#D3D3D3"
                    secureTextEntry={!isPasswordVisible} // Toggle visibility for Password
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    maxLength={20} // Limit to 20 characters
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle Password visibility
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={isPasswordVisible ? "eye" : "eye-off"} // Toggle between eye and eye-off
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password*</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#D3D3D3"
                    secureTextEntry={!isConfirmPasswordVisible} // Toggle visibility for Confirm Password
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    maxLength={20} // Limit to 20 characters
                  />
                  <TouchableOpacity
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} // Toggle Confirm Password visibility
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={isConfirmPasswordVisible ? "eye" : "eye-off"} // Toggle between eye and eye-off
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
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
                    Agree with{' '}
                    <Text
                      style={{ color: 'green', textDecorationLine: 'underline' }}
                      onPress={() => setTermsVisible(true)}
                    >
                      Terms & Conditions
                    </Text>
                  </Text>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => setModalVisible(true)} // Show confirmation modal
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>

              {/* Move this inside the ScrollView */}
              <Text style={styles.signInLink}>
                <Text style={styles.blackText}>Already have an account? </Text>
                <Text style={styles.redText} onPress={() => navigation.navigate('SignIn')}>Sign In</Text>
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <ScrollView
            contentContainerStyle={{ alignItems: 'center', paddingBottom: hp('5%') }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            <Image source={require('../assets/RegisLogo.png')} style={{ width: wp('35%'), height: hp('15%'), marginTop: hp('5%') }} />
            <View style={styles.container}>
              <Text style={styles.header}>Register Account</Text>
              <Text style={styles.subheader}>Register as a <Text style={{ fontWeight: 'bold', color: 'black' }}>visitor</Text> by filling out your information below.</Text>

              {/* Name */}
              <Text style={styles.label}>Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#D3D3D3"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                maxLength={50} // Limit to 50 characters
              />

              {/* Gender, Date of Birth, and Nationality - Horizontally Aligned */}
              <View style={styles.horizontalContainer}>
                <View style={{ zIndex: 3000, width: '33%' }}>
                  <Text style={styles.label}>Gender*</Text>
                  <CustomDropdown
                    label="Gender*"
                    value={formData.gender}
                    items={genderItems}
                    onSelect={(val) => handleDropdownChange('gender', val)}
                    placeholder="Gender"
                    width="100%"
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
                  {datePickerVisible && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>

                <View style={{ zIndex: 1000, width: '35%' }}>
                  <Text style={styles.label}>Nationality*</Text>
                  <CustomDropdown
                    label="Nationality*"
                    value={formData.nationality}
                    items={nationalityItems}
                    onSelect={(val) => handleDropdownChange('nationality', val)}
                    placeholder="Nationality"
                    width="100%"
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
                    maxLength={100} // Limit to 100 characters
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
                    maxLength={11} // Limit to 11 digits
                  />
                </View>
              </View>

              {/* Province, City, District - Horizontally Aligned */}
              <View style={styles.horizontalContainer}>
                <View style={{ zIndex: 3000, width: '33%' }}>
                  <Text style={styles.label}>Province*</Text>
                  <CustomDropdown
                    label="Province*"
                    value={formData.province}
                    items={provinceItems}
                    onSelect={(val) => handleDropdownChange('province', val)}
                    placeholder="Province"
                    width="100%"
                  />
                </View>

                <View style={{ zIndex: 2000, width: '36%' }}>
                  <Text style={styles.label}>City*</Text>
                  <CustomDropdown
                    label="City*"
                    value={formData.city}
                    items={cityItems}
                    onSelect={(val) => handleDropdownChange('city', val)}
                    placeholder="City"
                    width="100%"
                  />
                </View>

                <View style={{ zIndex: 1000, width: '30%' }}>
                  <Text style={styles.label}>District*</Text>
                  <CustomDropdown
                    label="District*"
                    value={formData.district}
                    items={districtItems}
                    onSelect={(val) => handleDropdownChange('district', val)}
                    placeholder="District"
                    width="100%"
                  />
                </View>
              </View>

              {/* Password */}
              <Text style={styles.label}>Password*</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#D3D3D3"
                  secureTextEntry={!isPasswordVisible} // Toggle visibility for Password
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  maxLength={20} // Limit to 20 characters
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle Password visibility
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye" : "eye-off"} // Toggle between eye and eye-off
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={styles.label}>Confirm Password*</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#D3D3D3"
                  secureTextEntry={!isConfirmPasswordVisible} // Toggle visibility for Confirm Password
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  maxLength={20} // Limit to 20 characters
                />
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} // Toggle Confirm Password visibility
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? "eye" : "eye-off"} // Toggle between eye and eye-off
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
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
                  Agree with{' '}
                  <Text
                    style={{ color: 'green', textDecorationLine: 'underline' }}
                    onPress={() => setTermsVisible(true)}
                  >
                    Terms & Conditions
                  </Text>
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => setModalVisible(true)} // Show confirmation modal
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>

            {/* Move this inside the ScrollView */}
            <Text style={styles.signInLink}>
              <Text style={styles.blackText}>Already have an account? </Text>
              <Text style={styles.redText} onPress={() => navigation.navigate('SignIn')}>Sign In</Text>
            </Text>
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={isModalVisible}
        message="Are you sure you want to submit the registration form?"
        onConfirm={() => {
          setModalVisible(false); // Close the modal
          handleRegister(); // Proceed with registration
        }}
        onCancel={() => setModalVisible(false)} // Close the modal
      />

      {/* Terms Modal */}
      <Modal
        visible={termsVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setTermsVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <View style={[styles.modalContent, { maxHeight: '80%', backgroundColor: '#fff' }]}>
            <Text style={[styles.header, { fontSize: 18 }]}>Terms & Conditions</Text>
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13 }}>
                Welcome to Walk to Grave Mobile. By creating an account, you agree to the following terms:
                {"\n\n"}
                1. You will provide accurate and truthful information during registration.
                {"\n\n"}
                2. Your personal data will be handled securely and used only for app functionality.
                {"\n\n"}
                3. You will not use the app for any unlawful, abusive, or fraudulent purposes.
                {"\n\n"}
                4. You are responsible for maintaining the confidentiality of your account credentials.
                {"\n\n"}
                5. We may update these terms from time to time. Continued use of the app means you accept any changes.
                {"\n\n"}
                6. We reserve the right to suspend or terminate accounts that violate these terms or engage in suspicious activity.
                {"\n\n"}
                7.You must be at least 18 years old to create an account. If you are under 18, you must have parental consent.
                {"\n\n"}
                8. You agree not to misuse any features or attempt to disrupt the normal operation of the app.
                {"\n\n"}
                9. You must be a visitor of the deceased to use this app and access its features.
                {"\n\n"}
                10. For more questions, please check our FAQs.
                {"\n\n"}
                11. By clicking "Close", you acknowledge that you have read and understood these terms.
                {"\n\n"}
              </Text>
            </View>
            <TouchableOpacity style={[styles.registerButton, { marginTop: 10 }]} onPress={() => setTermsVisible(false)}>
              <Text style={styles.registerButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fixedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  background: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    // Remove width and height here!
    // width: wp('100%'),
    // height: hp('100%'),
  },
  container: {
    marginTop: hp('6%'),
    width: wp('85%'),
    backgroundColor: 'white',
    borderRadius: wp('8%'),
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.2,
    shadowRadius: wp('2%'),
    elevation: 5,
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('1%'),
    fontFamily: 'Inter_700Bold',
  },
  subheader: {
    fontSize: wp('3.5%'),
    color: 'gray',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    fontFamily: 'Inter_400Regular',
  },
  input: {
    height: hp('5%'),
    width: "100%",
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: 0,
    fontSize: wp('3.8%'),
    marginBottom: hp('1%'),
    textAlignVertical: 'center',
    fontFamily: 'Inter_400Regular',
  },
  inputDate: {
    height: hp('5%'),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: wp('2%'),
    width: '100%',
    paddingHorizontal: wp('2%'),
    paddingVertical: 0,
    fontSize: wp('3.8%'),
    marginBottom: hp('0.5%'),
    fontFamily: 'Inter_400Regular',
    textAlignVertical: 'center',
  },
  label: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.5%'),
    fontFamily: 'Inter_700Bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
    width: "104%",
  },
  inputContainer: {
    flex: 1,
    marginRight: wp('2%'),
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('1%'),
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#fdbd21',
    padding: hp('1.2%'),
    borderRadius: wp('2%'),
    margin: wp('1%'),
    fontFamily: 'Inter_400Regular',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Inter_400Regular',
    fontSize: wp('4%'),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('90%'),
    backgroundColor: '#fff',
    padding: wp('5%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    maxHeight: hp('80%'),
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'gray',
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: '#fdbd21',
    padding: hp('1.5%'),
    borderRadius: wp('10%'),
    width: wp('60%'),
    alignSelf: 'center',
    marginTop: hp('1.5%'),
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: wp('4.2%'),
  },
  signInLink: {
    color: 'red',
    textAlign: 'center',
    // Remove or comment out the top property
    // top: hp('0.5%'),
    fontFamily: 'Inter_400Regular',
    fontSize: wp('3.8%'),
    marginTop: hp('2%'), // Add a little space from the form
    marginBottom: hp('5%'), // Add a little space at the bottom
  },
  blackText: {
    color: "#000",
    fontFamily: 'Inter_400Regular',
    fontSize: wp('3.8%'),
  },
  redText: {
    color: "red",
    fontWeight: "bold",
    top: hp('0.4%'),
    fontFamily: 'Inter_400Regular',
    fontSize: wp('3.8%'),
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: wp('2%'),
    top: hp('0.5%'),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left: wp('2%'),
  },
  checkboxWrapper: {
    marginRight: wp('2%'),
    height: hp('4%'),
    width: hp('4%'),
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
    fontFamily: 'Inter_400Regular',
  },
});

export default Register;
