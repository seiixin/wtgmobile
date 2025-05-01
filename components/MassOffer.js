import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, StyleSheet, Image, ScrollView, Animated
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MassOffer = () => {
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
        prayer: `God our Father,
Your power brings us to birth,
Your providence guides our lives,
and by Your command we return to dust.

Lord, those who die still live in Your presence,
their lives change but do not end.
I pray in hope for my family,
relatives and friends,
and for all the dead known to You alone.

In company with Christ,
Who died and now lives,
may they rejoice in Your kingdom,
where all our tears are wiped away.
Unite us together again in one family,
to sing Your praise forever and ever.

Amen.`,

       prayer2:' Heavenly Father, I come to you in prayer, knowing that you are the LORD who heals me (Exodus 15:26). I ask that you take away sickness, infirmity and pain from me and restore me to health (Psalm 103:2-3). I thank you for sending your Son into the world, who drove out evil spirits with a command and cured all who were sick (Matthew 8:16-17). Your love and compassion have not changed (Lamentations 3:22-23). You are the same yesterday, today, and forever (Hebrews 13:8). I ask for your Holy Spirit to flow through me and for the destruction of Satan’s work in my life (Ephesians 6:12). I bless you, Father, and forget none of your benefits. I trust in your promise to forgive all my sins and heal all my diseases (Psalm 103:3). I believe that by Jesus’ wounds, I have been healed (Isaiah 53:5). I give you all the glory and praise (Revelation 5:13). Amen.'
    },
    tagalog: {
        signOfTheCross: "Sa ngalan ng Ama, at ng Anak, at ng Espiritu Santo. Amen.",
        prayer: `Diyos Ama,
                    Ang Iyong kapangyarihan ang nagdadala sa amin sa buhay,
                    Ang Iyong pag-iingat ang gumagabay sa aming mga buhay,
                    at ayon sa Iyong utos, kami ay nagbabalik sa alabok.

                    Panginoon, ang mga namatay ay patuloy na nabubuhay sa Iyong presensya,
                    ang kanilang buhay ay nagbabago ngunit hindi nagtatapos.
                    Ako'y nagdarasal ng may pag-asa para sa aking pamilya,
                    mga kamag-anak at mga kaibigan,
                    at para sa lahat ng mga patay na kilala lamang sa Iyo.

                    Kasama ni Kristo,
                    Na namatay at ngayon ay buhay,
                    nawa'y magsaya sila sa Iyong kaharian,
                    kung saan ang aming mga luha ay pinapawi.
                    Pag-isahin Mo kami muli bilang isang pamilya,
                    upang mag-awit ng Iyong papuri magpakailanman.

                    Amen.`, 
prayer2:'Amang Banal, lumalapit ako sa Iyo sa panalangin, na alam kong Ikaw ang Panginoon na nagpapagaling sa akin (Exodo 15:26). Ako’y humihiling na alisin Mo ang karamdaman, kahinaan, at sakit mula sa akin at ibalik Mo ako sa kalusugan (Awit 103:2-3). Nagpapasalamat ako sa Iyong pagpapadala ng Iyong Anak sa mundo, na nagpalayas ng masasamang espiritu sa pamamagitan ng utos at nagpagaling sa lahat ng may sakit (Mateo 8:16-17). Ang Iyong pagmamahal at habag ay hindi nagbago (Panaghoy 3:22-23). Ikaw ay pareho kahapon, ngayon, at magpakailanman (Hebreo 13:8). Ako’y humihiling ng Iyong Banal na Espiritu na dumaloy sa akin at para sa pagkawasak ng gawa ni Satanas sa aking buhay (Efeso 6:12). Pinagpapala Kita, Ama, at hindi ko malilimutan ang lahat ng Iyong mga benepisyo. Nagtitiwala ako sa Iyong pangako na patawarin ang lahat ng aking mga kasalanan at pagalingin ang lahat ng aking mga karamdaman (Awit 103:3). Naniniwala ako na sa mga sugat ni Jesus, ako ay napagaling na (Isaias 53:5). Ibinibigay ko sa Iyo ang lahat ng papuri at kaluwalhatian (Pahayag 5:13). Amen.'



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
                <Text style={styles.headerTitle}>Mass Intentions</Text>
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

                            <Text style={styles.prayerTitle}>Prayer for the Dead</Text>
                            <Text style={styles.prayerText}>{prayers[language]?.prayer ?? ''}</Text>

                            <Text style={styles.prayerTitle}>Prayer for Healing and Restoration</Text>
                            <Text style={styles.prayerText}>{prayers[language]?.prayer2 ?? ''}</Text>
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

export default MassOffer;
