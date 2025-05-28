import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, Dimensions, StyleSheet, Image, ScrollView, Animated
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;

const SpecialIntentionsOffer = () => {
    const [deceasedName, setDeceasedName] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState('Choose Language');
    const [languageItems, setLanguageItems] = useState([
        { label: 'English', value: 'english' },
        { label: 'Tagalog', value: 'tagalog' }
    ]);

    const slideAnim = useRef(new Animated.Value(600)).current;
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

    // Effect to slide only when input is entered and language is chosen
    useEffect(() => {
        const shouldShowPanel = deceasedName.trim() && language !== 'Choose Language';
        Animated.timing(slideAnim, {
            toValue: shouldShowPanel ? 0 : 600,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [deceasedName, language]);

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
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropDownContainer}
                        labelStyle={{ color: 'gray' }}
                        placeholderStyle={{ color: 'gray' }}
                        textStyle={{ color: 'gray' }}
                        arrowIconStyle={{ tintColor: 'gray' }}
                    />

                    {/* Icons Section */}
                    <View style={styles.iconsContainer}>
                        <Image source={require('../assets/church_icon.png')} style={styles.icon} />
                        <Image source={require('../assets/walk_to_grave_logo.png')} style={styles.icon} />
                    </View>
                </View>
            </View>

            {/* ✅ Prayers Section */}
            {deceasedName.trim() && language !== 'Choose Language' && (
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
            )}

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        paddingTop: verticalScale(40)
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingVertical: verticalScale(15),
        marginTop: verticalScale(15)
    },
    backButton: {
        position: 'absolute',
        left: scale(15), 
        padding: scale(10), 
    },
    headerTitle: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: '#333',
    },
    instructionBox: {
        backgroundColor: '#f0f5da',
        padding: scale(20),
        marginHorizontal: scale(20),
        height: verticalScale(100),
        marginTop: verticalScale(30),
    },
    instructionText: {
        fontSize: scale(16),
        color: '#006400',
        textAlign: 'justify',
    },
    inputContainer: {
        marginHorizontal: scale(20),
        marginTop: verticalScale(20),
        padding: scale(20),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: scale(40),
        backgroundColor: '#fff',
    },
    labelInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    label: {
        fontSize: scale(16),
        color: '#333',
        marginRight: scale(10),
    },
    input: {
        fontSize: scale(16),
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: verticalScale(5),
    },
    languageAndIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: scale(20),
        right: scale(30)
    },
    iconsContainer: {
        flexDirection: 'row',
        right: scale(40)
    },
    icon: {
        width: scale(40),
        height: scale(40),
        marginLeft: scale(10),
    },
    dropdown: {
        width: '40%',
        borderWidth: 0,
        backgroundColor: 'transparent',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
        height: verticalScale(450),
        backgroundColor: 'white',
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30),
        paddingTop: verticalScale(30),
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -5 },
    },
    prayerBackground: {
        flex: 1,
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30),
        overflow: 'hidden',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    prayers: {
        padding: scale(20),
        flex: 1,
    },
    prayerTitle: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: '#006400',
        textAlign: 'center',
        marginBottom: verticalScale(5),
    },
    prayerText: {
        fontSize: scale(16),
        color: '#333',
        textAlign: 'justify',
        lineHeight: scale(22),
        marginBottom: verticalScale(15),
    },
});

export default SpecialIntentionsOffer;
