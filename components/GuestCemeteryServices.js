import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
  background: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.2,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.018,
    left: width * 0.025,
    zIndex: 10,
    backgroundColor: '#fcbd21',
    padding: width * 0.03,
    borderRadius: width * 0.12,
  },
  header: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    marginBottom: height * 0.012,
    marginLeft: width * 0.15,
  },
  subHeader: {
    color: 'gray',
    marginBottom: height * 0.025,
    marginLeft: width * 0.15,
    fontSize: width * 0.045,
  },
  faqContainer: {
    marginTop: height * 0.012,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: width * 0.025,
    marginBottom: height * 0.012,
    padding: width * 0.045,
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
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#12894f',
  },
  activeQuestion: {
    color: '#00796B',
  },
  faqAnswer: {
    marginTop: height * 0.012,
    color: '#555',
    fontSize: width * 0.04,
  },
});

export default GuestCemeteryServices;