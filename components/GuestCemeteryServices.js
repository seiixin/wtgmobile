import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GuestCemeteryServices = () => {
  const navigation = useNavigation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Does this app provide burial service details?",
      answer: "Yes, the app includes burial service options, pricing details, and contact information for cemetery management.",
    },
    {
      question: "Which burial options include price details in the app?",
      answer: "The BONE and PRIVATE burial options trigger a dropdown to display pricing details.",
    },
    {
      question: "Can cemetery administrators update grave records?",
      answer: "Yes, authorized personnel can update grave information through the admin panel.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ImageBackground source={require('../assets/FAQsBG.png')} style={styles.background}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.header}>Cemetery Services & Management</Text>
        <Text style={styles.subHeader}>
          <AntDesign name="wechat" size={24} color="black" />{"  "}Choose a Question
        </Text>

        <View style={styles.faqContainer}>
          {faqs.map((item, index) => (
            <View key={index} style={[styles.faqItem, openIndex === index && styles.faqItemOpen]}>
              <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFAQ(index)}>
                <Text style={[styles.faqQuestion, openIndex === index && styles.activeQuestion]}>{item.question}</Text>
                <AntDesign name={openIndex === index ? "up" : "down"} size={18} color="gray" />
              </TouchableOpacity>
              {openIndex === index && <Text style={styles.faqAnswer}>{item.answer}</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 140,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 10,
    zIndex: 10,
    backgroundColor: '#fcbd21',
    padding: 10,
    borderRadius: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 60,
  },
  subHeader: {
    color: 'gray',
    marginBottom: 20,
    marginLeft: 60,
  },
  faqContainer: {
    marginTop: 10,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItemOpen: {
    backgroundColor: '#E8F5E9',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#12894f',
  },
  activeQuestion: {
    color: '#00796B',
  },
  faqAnswer: {
    marginTop: 10,
    color: '#555',
  },
});

export default GuestCemeteryServices;