import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GeneralQuestions = () => {
    const navigation = useNavigation();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { question: "What is Walk to Grave?", answer: "Walk to Grave is a mobile application that helps users locate graves, navigate cemeteries, and pay virtual tributes to their loved ones." },
        { question: "Who can use the app?", answer: "Anyone can use the app, including family members of the deceased, cemetery administrators, and visitors." },
        { question: "What are the office hours of the cemetery?", answer: "The cemetery office is open from 8:00 AM to 5:00 PM, Monday to Saturday." },
        { question: "When is the cemetery open for visiting?", answer: "Visiting hours are from 7:00 AM to 7:00 PM daily." },
        { question: "Who is the Office Head of the cemetery?", answer: "The cemetery office head is Mr. John Doe." },
        { question: "Who can I contact for technical assistance?", answer: "For technical support, you can reach out to support@walktograve.com." },
        { question: "How can I contact the cemetery office?", answer: "You can contact the cemetery office via phone at (123) 456-7890 or email at office@cemetery.com." },
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
            
            <Text style={styles.header}>General Questions</Text>
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
        marginTop: 140
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 10,
        zIndex: 10,
        backgroundColor: '#fcbd21',
        padding: 10,
        borderRadius: 40
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 60
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

export default GeneralQuestions;