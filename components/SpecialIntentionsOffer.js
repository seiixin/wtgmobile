import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, StyleSheet, Image, ScrollView, Animated
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SpecialIntentionsOffer = () => {
    const [deceasedName, setDeceasedName] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState('Choose Language'); // Default to English
    const [languageItems, setLanguageItems] = useState([
        { label: 'English', value: 'english' },
        { label: 'Tagalog', value: 'tagalog' }
    ]);

    const slideAnim = useRef(new Animated.Value(600)).current; // Start fully hidden off-screen
    const navigation = useNavigation();

    const prayers = {
        english: {
            signOfTheCross: "In the name of the Father, of the Son, and of the Holy Spirit. Amen.",
            prayer: `Heavenly Father, we ask for your mercy and grace for [name]’s soul as they begin their journey into eternity. Please bring them into your loving arms and grant them peace and rest. We also pray for those who are left behind, that they would find comfort and hope in your presence and the promise of eternal life. May [name]’s soul rest in peace and enjoy the fullness of your love. In your precious name we pray, Amen.`
        },
        tagalog: {
            signOfTheCross: "Sa ngalan ng Ama, at ng Anak, at ng Espiritu Santo. Amen.",
            prayer: `Amang Banal, kami po'y humihiling ng Iyong awa at biyaya para sa kaluluwa ni [name] habang sila ay nagsisimula ng kanilang paglalakbay tungo sa walang hanggan. Pakiusap, yakapin Mo sila sa Iyong mapagmahal na mga bisig at bigyan ng kapayapaan at kapahingahan. Nanalangin din kami para sa mga naiwan, na sana'y makatagpo sila ng kaginhawaan at pag-asa sa Iyong presensya at sa pangako ng buhay na walang hanggan. Nawa'y magpahinga sa kapayapaan ang kaluluwa ni [name] at tamasahin ang kabuuan ng Iyong pagmamahal. Sa Iyong mahalagang pangalan kami ay nananalangin, Amen.`
        }
    };
    

    // Effect to slide only when input is entered or cleared
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: deceasedName.trim() ? 0 : 600, // Slide up if there's input, slide off-screen if empty
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [deceasedName]);

    return (
        <ImageBackground source={require('../assets/OfferBg.png')} style={styles.background}>

            {/* ✅ Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Special Intentions</Text>
            </View>

            {/* ✅ Instruction Box */}
            <View style={styles.instructionBox}>
                <Text style={styles.instructionText}>
                    Write the name of the deceased for whom you are praying. It is customary to pray according to the deceased's official first name.
                </Text>
            </View>

            {/* ✅ Input Section */}
<View style={styles.inputContainer}>
<View style={styles.labelInputWrapper}>
    <Text style={styles.label}>For</Text>
    <TextInput
        style={styles.input}
        placeholder="Name of the Deceased"
        placeholderTextColor="#aaa"
        value={deceasedName}
        onChangeText={setDeceasedName}
    />
</View>

<View style={styles.languageAndIconsContainer}>
<DropDownPicker
open={languageOpen}
value={language}
items={languageItems}
setOpen={setLanguageOpen}
setValue={setLanguage}
setItems={setLanguageItems}
placeholder="Choose Language"
style={styles.dropdown} // Styling for the dropdown box
dropDownContainerStyle={styles.dropDownContainer} // Dropdown container styling
labelStyle={{ color: 'gray' }} // Set the color of items in the dropdown
placeholderStyle={{ color: 'gray' }} // Set the color of the placeholder text
textStyle={{ color: 'gray' }} // Set the color of selected text
arrowIconStyle={{ tintColor: 'gray' }} // Set the color of the dropdown arrow to gray
/>



    {/* Icons Section */}
    <View style={styles.iconsContainer}>
        <Image source={require('../assets/church_icon.png')} style={styles.icon} />
        <Image source={require('../assets/walk_to_grave_logo.png')} style={styles.icon} />
    </View>
</View>
</View>


       

            {/* ✅ Prayers Section */}
            <Animated.View style={[styles.prayersContainer, { transform: [{ translateY: slideAnim }] }]}>
                <ImageBackground source={require('../assets/prayer_bg.png')} style={styles.prayerBackground}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.prayers}>
                            <Text style={styles.prayerTitle}>The Sign of the Cross</Text>
                            <Text style={styles.prayerText}>{prayers[language]?.signOfTheCross ?? 'Choose Language'}</Text>

                            <Text style={styles.prayerTitle}>Special Intention Prayer</Text>
                            <Text style={styles.prayerText}>{prayers[language]?.prayer ?? ''}</Text>

                        </View>
                    </ScrollView>
                </ImageBackground>
            </Animated.View>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        paddingTop: 40
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingVertical: 15,
        marginTop:15
        
    },
    backButton: {
        position: 'absolute',
        left: 15, 
        padding: 10, 
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    instructionBox: {
        backgroundColor: '#f0f5da',
        padding: 20,
        marginHorizontal: 20,
        height:100,
        marginTop: 30,
    },
    instructionText: {
        fontSize: 16,
        color: '#006400',
        textAlign: 'justify',
    },
    inputContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 40,
        backgroundColor: '#fff',
    },
    labelInputWrapper: {
        flexDirection: 'row', // Align "For" and input horizontally
        alignItems: 'center', // Vertically align label and input
        justifyContent: 'flex-start', // Align elements to the left
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginRight: 10, // Add space between the label and the input
    },
    input: {
        fontSize: 16,
        color: '#333',
        borderBottomWidth: 1, // Add underline
        borderBottomColor: '#ccc', // Underline color
        paddingVertical: 5, // Adjust padding to give it some space
    },
    languageAndIconsContainer: {
        flexDirection: 'row', // Align dropdown and icons horizontally
        
        alignItems: 'center', // Vertically center the items
        width: '100%', // Ensure the container takes the full width
        paddingHorizontal: 20,
        right:30
    },
    iconsContainer: {
        flexDirection: 'row', // Align icons horizontally
        right:40
    },
    icon: {
        width: 40, // Adjust icon size
        height: 40,
        marginLeft: 10, // Space between the icons
    },
    dropdown: {
        width:'40%',
        borderWidth: 0,
        backgroundColor: 'transparent',
        color: '#333',
        borderBottomWidth: 1, // Add underline
        borderBottomColor: '#ccc', // Underline color
    },
    dropDownContainer: {
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    prayersContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 500, // Set a height for the sliding container
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -5 },
    },
    prayerBackground: {
        flex: 1, // Ensure the background fills the container
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    scrollViewContent: {
        flexGrow: 1, // Ensure ScrollView content grows with space
    },
    prayers: {
        padding: 20,
        flex: 1, // Allow prayers content to grow and fill space
    },
    prayerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#006400',
        textAlign: 'center',
        marginBottom: 5,
    },
    prayerText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'justify',
        lineHeight: 22,
        marginBottom: 15,
    },
});

export default SpecialIntentionsOffer;
