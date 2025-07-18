import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const BASE_URL = 'https://walktogravemobile-backendserver.onrender.com';

export default function SubmitMemories() {
  const navigation = useNavigation();
  const route = useRoute();
  const { grave } = route.params || {};
  
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    birth: '',
    burial: '',
    images: [null, null, null, null, null],
    video: null,
    messages: [], // Dynamic messages based on template
  });
  const [uploading, setUploading] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false); // New state for video loading

  // ✅ Fetch dynamic templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/templates`);
        const data = await response.json();
        
        if (response.ok) {
          setTemplates(data);
          // Auto-select first template
          if (data.length > 0) {
            setSelectedTemplate(data[0]._id);
          }
        } else {
          console.error('Failed to fetch templates:', data);
          alert('Failed to load templates. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        alert('Error loading templates. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

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
          return dateString;
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

  // ✅ Initialize messages array when template changes
  useEffect(() => {
    if (selectedTemplate) {
      // Start with 2 messages for all templates (can add more later)
      const initialMessages = ['', ''];
      setForm(prev => ({ ...prev, messages: initialMessages }));
    }
  }, [selectedTemplate]);

  const getTemplateMessages = () => {
    // Generate placeholders based on current number of messages
    return form.messages.map((_, index) => ({
      placeholder: index % 2 === 0 
        ? `Enter short message [${index + 1}]`
        : `Enter short message [${index + 1}]`
    }));
  };

  const addMessage = () => {
    if (form.messages.length < 4) { // Maximum 4 messages
      const newMessages = [...form.messages, ''];
      setForm({ ...form, messages: newMessages });
    }
  };

  const removeMessage = (indexToRemove) => {
    if (form.messages.length > 2) { // Keep at least 2 messages
      const newMessages = form.messages.filter((_, index) => index !== indexToRemove);
      setForm({ ...form, messages: newMessages });
    }
  };

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

  const pickVideo = async () => {
    setVideoLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      setVideoLoading(false);
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
    setVideoLoading(false);
  };

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

  // ✅ Fixed submit handler with proper FormData handling
  const handleSubmit = async () => {
    // Check if all 4 images and the video are uploaded
    const allImagesUploaded = [0, 1, 2, 3].every(i => form.images[i] && form.images[i].uri);
    const videoUploaded = form.video && form.video.uri;

    if (!allImagesUploaded || !videoUploaded) {
      alert('Please upload all 4 images and the video before submitting.');
      return;
    }

    setUploading(true);

    try {
      const userEmail = await AsyncStorage.getItem("userEmail");
      const userAvatar = await AsyncStorage.getItem("userAvatar");

      const data = new FormData();
      data.append('name', form.name);
      data.append('birth', form.birth);
      data.append('burial', form.burial);
      data.append('template', selectedTemplate); // This is now the template _id

      if (userEmail) data.append('email', userEmail);
      if (userAvatar) data.append('avatar', userAvatar);

      // ✅ FIXED: Proper message handling
      console.log('Raw form.messages:', form.messages);
      console.log('Form.messages type:', typeof form.messages);
      console.log('Form.messages isArray:', Array.isArray(form.messages));
      
      const validMessages = [];
      
      // Safety check: ensure form.messages is an array
      const messagesArray = Array.isArray(form.messages) ? form.messages : [];
      
      messagesArray.forEach((msg, index) => {
        console.log(`Processing message ${index}:`, msg, typeof msg);
        if (msg && typeof msg === 'string' && msg.trim()) {
          validMessages.push(msg.trim());
          console.log(`Added valid message ${index}:`, msg.trim());
        }
      });
      
      console.log('Sending messages:', validMessages);
      console.log('Valid messages count:', validMessages.length);
      
      validMessages.forEach((msg, idx) => {
        console.log(`Appending message[${idx}]:`, msg);
        data.append(`messages[${idx}]`, msg);
      });

      form.images.forEach((img, idx) => {
        if (img && img.uri) {
          data.append('images', {
            uri: img.uri,
            name: `image_${idx}.jpg`,
            type: 'image/jpeg',
          });
        }
      });

      if (form.video && form.video.uri) {
        data.append('video', {
          uri: form.video.uri,
          name: 'video.mp4',
          type: 'video/mp4',
        });
      }

      console.log('FormData being sent:');
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${BASE_URL}/api/memories`, {
        method: 'POST',
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

  // Show loading while fetching templates
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        {renderHeader()}
        <ActivityIndicator size="large" color="#7ed597" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading templates...</Text>
      </View>
    );
  }

  // Step 1: Select Template (Dynamic Templates)
  if (step === 1) {
    const templateRows = chunkArray(templates, 2);

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
                {row.map((template) => (
                  <TouchableOpacity
                    key={template._id}
                    style={[
                      styles.templateBox,
                      selectedTemplate === template._id && styles.selectedTemplate,
                      { marginHorizontal: 12 }
                    ]}
                    onPress={() => setSelectedTemplate(template._id)}
                    activeOpacity={0.8}
                  >
                    <Image 
                      source={{ uri: template.previewImage }} 
                      style={styles.templateImg} 
                    />
                    <View style={styles.templateNumber}>
                      <Text style={styles.templateNumberText}>{template.templateNumber}</Text>
                    </View>
                    {selectedTemplate === template._id && (
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

  // Add function to render full screen template modal
  const renderTemplateModal = () => {
    const selectedTemplateObj = templates.find(t => t._id === selectedTemplate);
    
    return (
      <Modal
        visible={showTemplateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => setShowTemplateModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Template {selectedTemplateObj?.templateNumber}</Text>
            
            {selectedTemplateObj && (
              <Image
                source={{ uri: selectedTemplateObj.previewImage }}
                style={styles.fullScreenTemplateImg}
                resizeMode="contain"
              />
            )}
            
            <TouchableOpacity 
              style={styles.modalBackBtn}
              onPress={() => setShowTemplateModal(false)}
            >
              <Text style={styles.modalBackText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Step 2: Enter Details
  if (step === 2) {
    const selectedTemplateObj = templates.find(t => t._id === selectedTemplate);
    const templateMessages = getTemplateMessages();

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {renderHeader()}
        {renderTemplateModal()}
        
        <Text style={styles.selectedText}>You selected template {selectedTemplateObj?.templateNumber}:</Text>
        
        {/* Make template preview clickable */}
        <TouchableOpacity 
          style={styles.templatePreviewBox}
          onPress={() => setShowTemplateModal(true)}
          activeOpacity={0.8}
        >
          {selectedTemplateObj && (
            <Image
              source={{ uri: selectedTemplateObj.previewImage }}
              style={styles.templateImg}
            />
          )}
          <View style={styles.viewFullscreenHint}>
            <Text style={styles.viewFullscreenText}>Tap to view full size</Text>
          </View>
        </TouchableOpacity>
        
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
        {templateMessages.map((msg, idx) => {
          console.log(`Rendering message field ${idx}:`, msg.placeholder);
          return (
            <View key={idx} style={styles.messageInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={msg.placeholder}
                value={form.messages[idx] || ''}
                onChangeText={text => {
                  const newMessages = [...form.messages];
                  while (newMessages.length <= idx) {
                    newMessages.push('');
                  }
                  newMessages[idx] = text;
                  setForm({ ...form, messages: newMessages });
                  
                  console.log(`Updated message ${idx}:`, text);
                  console.log('All messages:', newMessages);
                }}
              />
              {form.messages.length > 2 && (
                <TouchableOpacity 
                  style={styles.removeMessageBtn} 
                  onPress={() => removeMessage(idx)}
                >
                  <Text style={styles.removeMessageText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
        
        {/* Add Message Button - only show if less than 4 messages */}
        {form.messages.length < 4 && (
          <TouchableOpacity style={styles.addMessageBtn} onPress={addMessage}>
            <Text style={styles.addMessageText}>+ Add Another Message ({form.messages.length}/4)</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Step 3: Upload Images/Videos (also add modal here)
  if (step === 3) {
    const selectedTemplateObj = templates.find(t => t._id === selectedTemplate);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {renderHeader()}
        {renderTemplateModal()}
        
        <Text style={styles.selectedText}>You selected template {selectedTemplateObj?.templateNumber}:</Text>
        
        {/* Make template preview clickable here too */}
        <TouchableOpacity 
          style={[styles.templatePreviewBox, { borderColor: '#6ee7b7' }]}
          onPress={() => setShowTemplateModal(true)}
          activeOpacity={0.8}
        >
          {selectedTemplateObj && (
            <Image
              source={{ uri: selectedTemplateObj.previewImage }}
              style={styles.templateImg}
            />
          )}
          <View style={styles.viewFullscreenHint}>
            <Text style={styles.viewFullscreenText}>Tap to view full size</Text>
          </View>
        </TouchableOpacity>
        
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
          <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo} disabled={videoLoading}>
            {videoLoading ? (
              <ActivityIndicator size="small" color="#7ed597" />
            ) : (
              <Text>{form.video?.uri ? '✓ Video 4' : 'Video 4'}</Text>
            )}
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
    position: 'relative',
  },
  selectedTemplate: {
    borderColor: '#12894f',
    backgroundColor: '#eaffea',
  },
  templateImg: {
    width: 150,
    height: 280,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  templateNumber: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#7ed597',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
  autoFilledInput: {
    backgroundColor: '#f0f8ff',
    borderColor: '#4CAF50',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  removeMessageBtn: {
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeMessageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addMessageBtn: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#7ed597',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  addMessageText: {
    color: '#12894f',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Add new modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.95,
    height: height * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#12894f',
    marginTop: 20,
    marginBottom: 20,
  },
  fullScreenTemplateImg: {
    width: width * 0.8,
    height: height * 0.6,
    borderRadius: 12,
  },
  modalBackBtn: {
    backgroundColor: '#7ed597',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  modalBackText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewFullscreenHint: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  viewFullscreenText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});