import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const templateConfigs = {
  1: {
    image: require('../assets/template1.png'),
    messages: [
      { placeholder: 'Enter short description / message [1]' },
      { placeholder: 'Enter short caption [2]' },
    ],
  },
  2: {
    image: require('../assets/template2.png'),
    messages: [
      { placeholder: 'Enter short description / message [1]' },
      { placeholder: 'Enter short caption [2]' },
      { placeholder: 'Enter short description / message [3]' },
      { placeholder: 'Enter short caption [4]' },
    ],
  },
  3: {
    image: require('../assets/template3.png'),
    messages: [
      { placeholder: 'Enter short description / message [1]' },
      { placeholder: 'Enter short caption [2]' },
      { placeholder: 'Enter short description / message [3]' },
      { placeholder: 'Enter short caption [4]' },
    ],
  },
  4: {
    image: require('../assets/template4.png'),
    messages: [
      { placeholder: 'Enter short description / message [1]' },
      { placeholder: 'Enter short description / message [2]' },
      { placeholder: 'Enter short description / message [3]' },
      { placeholder: 'Enter bible verse / short title [4]' },
    ],
  },
  5: {
    image: require('../assets/template5.png'), // Make sure this path is correct!
    messages: [
      { placeholder: 'Enter bible verse / short title [1]' },
      { placeholder: 'Enter short description / message [2]' },
    ],
  },
};

export default function SubmitMemories() {
  const navigation = useNavigation();
  const route = useRoute(); // Add this import at the top
  const { grave } = route.params || {}; // Get the grave data passed from GraveInformation
  
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(Object.keys(templateConfigs)[0]);
  const [form, setForm] = useState({
    name: '',
    birth: '',
    burial: '',
    message1: '',
    caption2: '',
    images: [null, null, null, null, null],
    video: null,
    messages: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  // Auto-fill form with grave data when component mounts
  useEffect(() => {
    if (grave) {
      const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (error) {
          return dateString; // Return original if formatting fails
        }
      };

      setForm(prevForm => ({
        ...prevForm,
        name: `${grave.firstName || ''}${grave.nickname ? ` '${grave.nickname}'` : ''} ${grave.lastName || ''}`.trim(),
        birth: formatDate(grave.dateOfBirth),
        burial: formatDate(grave.burial),
      }));
    }
  }, [grave]);

  // Consolidated image picker function
  const pickImage = async (index) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages = [...form.images];
      newImages[index] = result.assets[0];
      setForm({ ...form, images: newImages });
    }
  };

  // Fixed video picker function
  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, video: result.assets[0] });
    }
  };

  // Add missing template data
  const templateRows = chunkArray([
    { id: '1', img: require('../assets/template1.png') },
    { id: '2', img: require('../assets/template2.png') },
    { id: '3', img: require('../assets/template3.png') },
    { id: '4', img: require('../assets/template4.png') },
    { id: '5', img: require('../assets/template5.png') },
  ], 2);

  // Add missing header function
  const renderHeader = () => (
    <LinearGradient
      colors={['#ffef5d', '#7ed597']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.topBarBg}
    >
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Memories</Text>
      </View>
    </LinearGradient>
  );

  // Fixed submit handler with proper FormData handling
  const handleSubmit = async () => {
    setUploading(true);
    
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('birth', form.birth);
      data.append('burial', form.burial);
      data.append('template', selectedTemplate);
      
      // Add messages as JSON string or individual fields
      form.messages.forEach((msg, idx) => {
        if (msg) {
          data.append(`messages[${idx}]`, msg);
        }
      });

      // Add images - FIXED: Use correct format for React Native
      form.images.forEach((img, idx) => {
        if (img && img.uri) {
          data.append('images', {
            uri: img.uri,
            name: `image_${idx}.jpg`,
            type: 'image/jpeg',
          });
        }
      });

      // Add video - FIXED: Use correct format for React Native
      if (form.video && form.video.uri) {
        data.append('video', {
          uri: form.video.uri,
          name: 'video.mp4',
          type: 'video/mp4',
        });
      }

      console.log('Submitting data:', data); // Debug log

      const response = await fetch('https://walktogravemobile-backendserver.onrender.com/api/memories', {
        method: 'POST',
        // DON'T set Content-Type header - let fetch handle it
        body: data,
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Memory submitted successfully!');
        navigation.goBack();
      } else {
        console.error('Server error:', result);
        alert(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error submitting memory. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Step 1: Select Template
  if (step === 1) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <Text style={styles.title}>Select a meaningful template</Text>
        <View style={{ flex: 1, width: '100%', marginVertical: 20, maxHeight: 680 }}>
          <ScrollView
            contentContainerStyle={{ paddingVertical: 16, alignItems: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            {templateRows.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={{
                  flexDirection: 'row',
                  justifyContent: row.length === 1 ? 'center' : 'space-between',
                  width: '100%',
                  marginBottom: 24,
                }}
              >
                {row.map((t, colIndex) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.templateBox,
                      selectedTemplate === t.id && styles.selectedTemplate,
                      { marginHorizontal: 12 }
                    ]}
                    onPress={() => setSelectedTemplate(t.id)}
                    activeOpacity={0.8}
                  >
                    <Image source={t.img} style={styles.templateImg} />
                    {selectedTemplate === t.id && (
                      <View style={styles.checkCircle}><Text>✓</Text></View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={[styles.nextBtn, !selectedTemplate && { opacity: 0.5 }]}
          disabled={!selectedTemplate}
          onPress={() => setStep(2)}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 2: Enter Details (modified to show auto-filled data)
  if (step === 2) {
    const selectedConfig = templateConfigs[selectedTemplate];

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {renderHeader()}
        <Text style={styles.selectedText}>You selected template {selectedTemplate}:</Text>
        <View style={styles.templatePreviewBox}>
          {selectedConfig && (
            <Image
              source={selectedConfig.image}
              style={styles.templateImg}
            />
          )}
        </View>
        <Text style={styles.sectionTitle}>
          Provide the full name of your loved one to personalize the memorial page.
        </Text>
        {grave && (
          <Text style={styles.autoFillNote}>
            *Information auto-filled from grave data
          </Text>
        )}
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, grave && styles.autoFilledInput]}
            placeholder="Enter name of the deceased"
            value={form.name}
            onChangeText={name => setForm({ ...form, name })}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }, grave && styles.autoFilledInput]}
              placeholder="Date of Birth"
              value={form.birth}
              onChangeText={birth => setForm({ ...form, birth })}
            />
            <TextInput
              style={[styles.input, { flex: 1 }, grave && styles.autoFilledInput]}
              placeholder="Date of Burial"
              value={form.burial}
              onChangeText={burial => setForm({ ...form, burial })}
            />
          </View>
        </View>
        <Text style={styles.sectionTitle}>
          Write heartfelt messages, tributes, or memories to share with visitors.
        </Text>
        {selectedConfig && selectedConfig.messages && selectedConfig.messages.map((msg, idx) => (
          <TextInput
            key={idx}
            style={styles.input}
            placeholder={msg.placeholder}
            value={form.messages[idx] || ''}
            onChangeText={text => {
              const newMessages = [...form.messages];
              newMessages[idx] = text;
              setForm({ ...form, messages: newMessages });
            }}
          />
        ))}
        <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Step 3: Upload Images/Videos
  if (step === 3) {
    const selectedConfig = templateConfigs[selectedTemplate];

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {renderHeader()}
        <Text style={styles.selectedText}>You selected template {selectedTemplate}:</Text>
        <View style={[styles.templatePreviewBox, { borderColor: '#6ee7b7' }]}>
          {selectedConfig && (
            <Image
              source={selectedConfig.image}
              style={styles.templateImg}
            />
          )}
        </View>
        <Text style={styles.sectionTitle}>
          Add cherished images and videos to honor{'\n'}and remember your loved one.
        </Text>
        <Text style={styles.uploadNote}>
          *You can upload photos up to 5 MB (recommended max size) and videos up to 50 MB or around 1-2 minutes long.
        </Text>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(0)}>
            <Text>{form.images[0]?.uri ? '✓ Image 1' : 'Image 1'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(1)}>
            <Text>{form.images[1]?.uri ? '✓ Image 2' : 'Image 2'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(2)}>
            <Text>{form.images[2]?.uri ? '✓ Image 3' : 'Image 3'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo}>
            <Text>{form.video?.uri ? '✓ Video 4' : 'Video 4'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(3)}>
            <Text>{form.images[3]?.uri ? '✓ Image 5' : 'Image 5'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.gradientSubmitBtn} onPress={handleSubmit} disabled={uploading}>
          <LinearGradient
            colors={['#ffef5d', '#7ed597']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtnBg}
          >
            <Text style={styles.submitBtnText}>{uploading ? 'Submitting...' : 'Submit'}</Text>
            <Text style={styles.submitArrow}>{'>'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 16, color: '#12894f', textAlign: 'center' },
  templatesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  templateBox: {
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 16,
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 320,
  },
  selectedTemplate: {
    borderColor: '#12894f',
    backgroundColor: '#eaffea',
  },
  templateImg: {
    width: 240,
    height: 300,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  checkCircle: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -12 }],
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
  },
  nextBtn: { backgroundColor: '#7ed597', padding: 12, borderRadius: 24, marginTop: 24, width: 280, alignItems: 'center' },
  nextBtnText: { color: '#222', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 8, width: '100%' },
  row: { flexDirection: 'row', width: '100%' },
  uploadRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  uploadBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#7ed597',
    borderRadius: 12,
    padding: 14,
    margin: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  submitBtn: { backgroundColor: '#7ed597', padding: 12, borderRadius: 24, marginTop: 24, width: 120, alignItems: 'center' },
  selectedText: { fontSize: 15, marginBottom: 8, color: '#222', alignSelf: 'flex-start' },
  templatePreviewBox: {
    borderWidth: 2,
    borderColor: '#6ee7b7',
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: { fontSize: 15, color: '#222', marginVertical: 10, alignSelf: 'flex-start' },
  inputGroup: { width: '100%', marginBottom: 8 },
  autoFillNote: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 4,
    marginTop: -8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    fontStyle: 'italic',
  },
  uploadNote: {
    color: '#e57373',
    fontSize: 11,
    marginBottom: 10,
    marginTop: -4,
    alignSelf: 'flex-start',
  },
  gradientSubmitBtn: { width: '100%', marginTop: 18 },
  gradientBtnBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 12,
    width: '100%',
  },
  submitBtnText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  submitArrow: { color: '#222', fontWeight: 'bold', fontSize: 22, marginLeft: 8 },
  topBarBg: {
    width: '100%',
    height: 80,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffcd38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginLeft: 70
  },
  largeTemplateBox: {
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#eee',
    borderRadius: 18,
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 180, // Large width
    height: 300, // Large height
  },
  largeTemplateImg: {
    width: 160,
    height: 260,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  autoFilledInput: {
    backgroundColor: '#f0f8ff',
    borderColor: '#4CAF50',
  },
});