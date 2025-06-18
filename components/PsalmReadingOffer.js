import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, Dimensions, StyleSheet, Image, ScrollView, Animated, StatusBar, Modal
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Add this import
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com"; // <-- Add this if not present

const PsalmReadingOffer = () => {
    const [deceasedName, setDeceasedName] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState('Choose Language');
    const [languageItems, setLanguageItems] = useState([
        { label: 'English', value: 'english' },
        { label: 'Tagalog', value: 'tagalog' }
    ]);

    const slideAnim = useRef(new Animated.Value(600)).current;
    const navigation = useNavigation();

    const [accountRemovedModal, setAccountRemovedModal] = useState(false);

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

    // Effect to slide only when input is entered and language is chosen
    useEffect(() => {
        const shouldShowPanel = deceasedName.trim() && language !== 'Choose Language';
        Animated.timing(slideAnim, {
            toValue: shouldShowPanel ? 0 : 600,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [deceasedName, language]);

    useEffect(() => {
        let intervalId;
        const checkUserExists = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) return;
                const response = await fetch(`${BASE_URL}/api/users/${userId}`);
                if (!response.ok) {
                    setAccountRemovedModal(true);
                    await AsyncStorage.removeItem("userId");
                    return;
                }
                const data = await response.json();
                if (!data || data.error || data.message === "User not found") {
                    setAccountRemovedModal(true);
                    await AsyncStorage.removeItem("userId");
                }
            } catch (error) {
                // Optionally handle network errors
            }
        };
        intervalId = setInterval(checkUserExists, 5000); // Check every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    const speakPrayer = () => {
        if (language !== 'Choose Language') {
            const prayer = `${prayers[language].signOfTheCross} ${prayers[language].prayer} ${prayers[language].prayer1}`;
            Speech.speak(prayer, {
                language: language === 'english' ? 'en-US' : 'fil-PH',
                rate: 0.95,
                pitch: 1.1,
            });
        }
    };

    return (
        <>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
        />
        <Modal
            visible={accountRemovedModal}
            transparent
            animationType="fade"
            onRequestClose={() => {}}
        >
            <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" translucent />
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    alignItems: 'center',
                    width: '80%'
                }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: 'red' }}>
                        Your account has been removed by the administrator.
                    </Text>
                    <TouchableOpacity
                        style={{ padding: 10, marginTop: 16 }}
                        onPress={() => {
                            setAccountRemovedModal(false);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'SignIn' }],
                            });
                        }}
                    >
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        <ImageBackground source={require('../assets/OfferBg.png')} style={styles.background}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp('7%')} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Psalm & Scripture Readings</Text>
            </View>

            {/* Instruction Box */}
            <View style={styles.instructionBox}>
                <Text style={styles.instructionText}>
                    Write the name of the deceased for whom you are praying. It is customary to pray according to the deceased's official first name.
                </Text>
            </View>

            {/* Input Section */}
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
                        labelStyle={{ color: 'gray', fontSize: RFValue(14, height) }}
                        placeholderStyle={{ color: 'gray', fontSize: RFValue(14, height) }}
                        textStyle={{ color: 'gray', fontSize: RFValue(14, height) }}
                        arrowIconStyle={{ tintColor: 'gray' }}
                    />
                    {/* LogosP.png Icon Centered */}
                    <View style={[styles.iconsContainer, { alignItems: 'center', justifyContent: 'center', width: wp('15%') }]}>
                        <Image
                            source={require('../assets/LogosP.png')}
                            style={{
                                top: hp('1%'),
                                width: wp('18%'),
                                height: wp('18%'),
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                </View>
            </View>

            {/* Prayers Section */}
            {deceasedName.trim() && language !== 'Choose Language' && (
                <Animated.View style={[styles.prayersContainer, { transform: [{ translateY: slideAnim }] }]}>
                    <ImageBackground source={require('../assets/prayer_bg.png')} style={styles.prayerBackground}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                            <View style={styles.prayers}>
                                {/* TTS Buttons */}
                                <TouchableOpacity
                                    style={{
                                        alignSelf: 'center',
                                        backgroundColor: '#006400',
                                        borderRadius: 20,
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        marginBottom: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                    onPress={speakPrayer}
                                >
                                    <Ionicons name="volume-high" size={22} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Read Prayers Aloud</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        alignSelf: 'center',
                                        backgroundColor: '#8B0000',
                                        borderRadius: 20,
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        marginBottom: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => Speech.stop()}
                                >
                                    <Ionicons name="stop" size={22} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Stop Reading</Text>
                                </TouchableOpacity>
                                {/* Prayers */}
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
            )}
        </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        paddingTop: hp('5%'),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('2%'),
        marginTop: hp('2%'),
    },
    backButton: {
        position: 'absolute',
        left: wp('4%'),
        padding: wp('2.5%'),
        bottom: hp('2%'),
    },
    headerTitle: {
        fontSize: RFValue(18, height),
        fontWeight: 'bold',
        color: '#333',
        bottom: hp('1.8%'),
    },
    instructionBox: {
        backgroundColor: '#f0f5da',
        padding: wp('5%'),
        marginHorizontal: wp('5%'),
        height: hp('12%'),
        marginTop: hp('3%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
    },
    instructionText: {
        fontSize: RFValue(15, height),
        color: '#006400',
        textAlign: 'justify',
    },
    inputContainer: {
        marginHorizontal: wp('5%'),
        marginTop: hp('2.5%'),
        padding: wp('5%'),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: wp('10%'),
        backgroundColor: '#fff',
    },
    labelInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    label: {
        fontSize: RFValue(15, height),
        color: '#333',
        marginRight: wp('2.5%'),
    },
    input: {
        fontSize: RFValue(15, height),
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: hp('0.5%'),
        flex: 1,
    },
    languageAndIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: wp('5%'),
        right: wp('5%'),
    },
    iconsContainer: {
        flexDirection: 'row',
        right: wp('8%'),
    },
    icon: {
        width: wp('10%'),
        height: wp('10%'),
        marginLeft: wp('2.5%'),
        resizeMode: 'contain',
    },
    dropdown: {
        width: '50%',
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
        height: hp('55%'),
        backgroundColor: 'white',
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
        paddingTop: hp('3%'),
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -5 },
    },
    prayerBackground: {
        flex: 1,
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
        overflow: 'hidden',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    prayers: {
        padding: wp('5%'),
        flex: 1,
    },
    prayerTitle: {
        fontSize: RFValue(17, height),
        fontWeight: 'bold',
        color: '#006400',
        textAlign: 'center',
        marginBottom: hp('0.5%'),
        marginTop: hp('1%'),
        fontFamily: 'Inter_400Regular',
    },
    prayerText: {
        fontSize: RFValue(15, height),
        color: '#333',
        textAlign: 'center', // center the prayer text
        lineHeight: RFValue(22, height),
        marginBottom: hp('1.5%'),
        marginHorizontal: wp('5%'),
        fontFamily: 'Inter_400Regular',
    },
});

export default PsalmReadingOffer;
