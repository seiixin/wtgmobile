import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, StyleSheet, Image, ScrollView, Animated
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PsalmReadingOffer = () => {
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
            prayer: "Dear God, Thank you that you are our good Shepherd and we can trust you with our lives. Thank you for your leadership and Sovereignty. Thank you for your guidance and care in all our days. Thank you that you restore our souls, give us peace, and bring us hope in all of our tomorrows. Thank you for your protection and strength that surrounds us like a shield. Thank you that we never have to fear. Thank you for your goodness and love that follows after us, chases us, even when we were unaware. Thank you Lord, that you are trustworthy and able, that you are our Refuge and hope. In You alone is rest and peace. We praise you for the assurance that we will dwell with you forever. In Jesus' Name, Amen.",
            prayer1: `He who dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the LORD, 'He is my refuge and my fortress, my God, in whom I trust.'
            Surely He will save you from the fowler's snare and from the deadly pestilence. He will cover you with His feathers, and under His wings, you will find refuge; His faithfulness will be your shield and rampart.
            You will not fear the terror of night, nor the arrow that flies by day, nor the pestilence that stalks in the darkness, nor the plague that destroys at midday.
            A thousand may fall at your side, ten thousand at your right hand, but it will not come near you. You will only observe with your eyes and see the punishment of the wicked.
            If you make the Most High your dwelling— even the LORD, who is my refuge— then no harm will befall you, no disaster will come near your tent.
            For He will command His angels concerning you to guard you in all your ways; They will lift you up in their hands, so that you will not strike your foot against a stone.
            You will tread upon the lion and the cobra; you will trample the great lion and the serpent. Because He loves me, says the LORD, I will rescue him; I will protect him, for he acknowledges my name.
            He will call upon Me, and I will answer him; I will be with him in trouble, I will deliver him and honor him. With long life, I will satisfy him and show him My salvation.`
        },
        tagalog: {
            signOfTheCross: "Sa ngalan ng Ama, at ng Anak, at ng Espiritu Santo. Amen.",
            prayer: "Panginoong Diyos, Salamat na Ikaw ang aming Mabuting Pastor at maari naming pagtitiwalaan Ka sa aming mga buhay. Salamat sa Iyong pamumuno at ang Iyong kapangyarihan. Salamat sa Iyong gabay at pangangalaga sa lahat ng aming mga araw. Salamat na binabalik Mo ang aming mga kaluluwa, binibigyan Mo kami ng kapayapaan, at nagdadala ka ng pag-asa sa aming mga bukas. Salamat sa Iyong proteksyon at lakas na pumapalibot sa amin tulad ng isang kalasag. Salamat na hindi namin kailangang matakot. Salamat sa Iyong kabutihan at pagmamahal na sumusunod sa amin, hinahabol kami, kahit na hindi namin ito alam. Salamat Panginoon, na ikaw ay mapagkakatiwalaan at makapangyarihan, na Ikaw ang aming Kanlungan at pag-asa. Sa Iyo lamang matatagpuan ang kapahingahan at kapayapaan. Pinupuri Ka namin para sa katiyakan na kami ay maninirahan sa Iyo magpakailanman. Sa pangalan ni Jesus, Amen.",
            prayer1: `Ang tumitira sa ilalim ng mga pakpak ng Kataas-taasan ay mamamahinga sa lilim ng Makapangyarihan. Aaminin ko sa Panginoon, 'Siya ang aking kanlungan at aking kuta, ang aking Diyos na aking pinagtitiwalaan.'
            Tiyak na ililigtas ka niya mula sa mga patibong ng manghuhuli at mula sa salot na kumakalat. Ikukubli ka niya sa Kanyang mga pakpak, at sa ilalim ng Kanyang mga pakpak, makakakita ka ng kanlungan; ang Kanyang katapatan ay magiging iyong kalasag at pambansang proteksyon.
            Hindi ka matatakot sa takot ng gabi, ni sa palasong lumilipad sa araw, ni sa salot na gumagala sa dilim, ni sa salot na pumapatay sa tanghali.
            Maaaring may isang libo na bumagsak sa iyong gilid, sampung libo sa iyong kanan, ngunit hindi ito dadaan sa iyo. Makikita mo lamang ng iyong mga mata at makikita ang paghatol sa mga masama.
            Kung gagawin mong tirahan ang Kataas-taasan— kahit ang Panginoon na aking kanlungan— wala nang masama na darating sa iyo, at walang kalamidad na papasok sa iyong tahanan.
            Sapagkat mag-uutos Siya sa Kanyang mga anghel na magbabantay sa iyo sa lahat ng iyong mga daan; itataas ka nila sa kanilang mga kamay, upang hindi mo matapakan ang iyong paa sa isang bato.
            Magsusumpa ka laban sa leon at sa ahas; didiligin mo ang dakilang leon at ang ahas. Dahil iniibig Niya ako, sabi ng Panginoon, ililigtas Ko siya; Aking poprotektahan siya, sapagkat ipinakilala niya ang aking pangalan.
            Tatawagin Niya ako, at sasagutin Ko siya; ako'y magiging kasama niya sa kapighatian, aking ililigtas siya at bibigyan siya ng karangalan. Sa mahabang buhay, bibigyan ko siya ng kasiyahan at ipapakita ko sa kanya ang aking kaligtasan.`
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
                <Text style={styles.headerTitle}>Psalm & Scripture Readings</Text>
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

                            <Text style={styles.prayerTitle}>Psalms 23</Text>
                            <Text style={styles.prayerText}>{prayers[language]?.prayer ?? ''}</Text>

                            <Text style={styles.prayerTitle}>Psalms 91</Text>
                            <Text style={styles.prayerText}>{prayers[language]?.prayer1 ?? ''}</Text>
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

export default PsalmReadingOffer;
