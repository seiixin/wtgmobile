import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

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
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(Object.keys(templateConfigs)[0]);
  const [form, setForm] = useState({
    name: '',
    birth: '',
    burial: '',
    message1: '',
    caption2: '',
    images: [],
    video: null,
    messages: [],
  });

  // Dummy templates for illustration
  const templates = [
    { id: 1, img: require('../assets/template1.png') },
    { id: 2, img: require('../assets/template2.png') },
    { id: 3, img: require('../assets/template3.png') },
    { id: 4, img: require('../assets/template4.png') },
    { id: 5, img: require('../assets/template5.png') }, 
  ];

  const templateRows = chunkArray(templates, 2);

  const renderHeader = () => (
    <View style={styles.topBarBg}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            style={{ marginLeft: width * 0.02, marginTop: height * 0.01 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Submit Memories
        </Text>
      </View>
    </View>
  );

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

  // Step 2: Enter Details
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
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Enter name of the deceased"
            value={form.name}
            onChangeText={name => setForm({ ...form, name })}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Date of Birth"
              value={form.birth}
              onChangeText={birth => setForm({ ...form, birth })}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
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
          <TouchableOpacity style={styles.uploadBtn}><Text>Image 1</Text></TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn}><Text>Image 2</Text></TouchableOpacity>
        </View>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBtn}><Text>Image 3</Text></TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn}><Text>Video 4</Text></TouchableOpacity>
        </View>
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBtn}><Text>Image 5</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.gradientSubmitBtn}>
          <LinearGradient
            colors={['#ffef5d', '#7ed597']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtnBg}
          >
            <Text style={styles.submitBtnText}>Submit</Text>
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
  autoFillNote: { color: 'red', fontSize: 12, marginLeft: 4, marginTop: -8, marginBottom: 8, alignSelf: 'flex-end' },
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
});