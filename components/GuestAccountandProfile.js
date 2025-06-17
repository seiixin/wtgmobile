import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const GuestAccountandProfile = () => {
  const navigation = useNavigation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "You can sign up using your email and password or continue as a guest with limited access.",
    },
    {
      question: "What if I forget my password?",
      answer: "You can reset your password by selecting 'Forgot Password?' on the login page and following the OTP verification process.",
    },
    {
      question: "Can I edit my profile information?",
      answer: "Yes, you can update your details in the Profile Page under the settings menu.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageBackground source={require('../assets/FAQsBG.png')} style={styles.background} resizeMode="cover">
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp('5%') }}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={wp('6.5%')} color="white" />
          </TouchableOpacity>

          <Text style={styles.header}>Account & Profile</Text>
          <Text style={styles.subHeader}>
            <AntDesign name="wechat" size={wp('6%')} color="black" />{"  "}Choose a Question
          </Text>

          <View style={styles.faqContainer}>
            {faqs.map((item, index) => (
              <View key={index} style={[styles.faqItem, openIndex === index && styles.faqItemOpen]}>
                <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFAQ(index)}>
                  <Text style={[styles.faqQuestion, openIndex === index && styles.activeQuestion]} numberOfLines={2} ellipsizeMode="tail">{item.question}</Text>
                  <AntDesign name={openIndex === index ? "up" : "down"} size={wp('4.5%')} color="gray" marginLeft={wp('5%')}/>
                </TouchableOpacity>
                {openIndex === index && <Text style={styles.faqAnswer}>{item.answer}</Text>}
              </View>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    marginTop: hp('20%'),
  },
  backButton: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('2%'),
    zIndex: 10,
    backgroundColor: '#fcbd21',
    padding: wp('2.5%'),
    borderRadius: wp('10%'),
  },
  header: {
    fontSize: wp('6.5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
    marginLeft: wp('19%'),
    fontFamily: 'Inter_700Bold',
    marginTop: hp('2%'),
  },
  subHeader: {
    color: 'gray',
    marginBottom: hp('2%'),
    marginLeft: wp('16%'),
    fontSize: wp('4%'),
    fontFamily: 'Inter_400Regular',
  },
  faqContainer: {
    marginTop: hp('1%'),
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: wp('2.5%'),
    marginBottom: hp('1.2%'),
    padding: wp('4%'),
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
    fontSize: wp('4.2%'),
    fontWeight: 'bold',
    color: '#12894f',
    flex: 1,
    fontFamily: 'Inter_700Bold',
  },
  activeQuestion: {
    color: '#00796B',
  },
  faqAnswer: {
    marginTop: hp('1%'),
    color: '#555',
    fontSize: wp('3.8%'),
    fontFamily: 'Inter_400Regular',
  },
});

export default GuestAccountandProfile;