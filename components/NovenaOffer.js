import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, Dimensions, StyleSheet, Image, ScrollView, Animated, StatusBar, Modal
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const NovenaOffer = () => {
    const [deceasedName, setDeceasedName] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState('Choose Language');
    const [languageItems, setLanguageItems] = useState([
        { label: 'English', value: 'english' },
        { label: 'Tagalog', value: 'tagalog' },
    ]);
    const [accountRemovedModal, setAccountRemovedModal] = useState(false);
    const slideAnim = useRef(new Animated.Value(600)).current;
    const navigation = useNavigation();

    const prayers = {   
        english: {
            opening: "O most gracious and loving God, we come before You with humble hearts, offering our prayers for Your mercy and blessings. We ask for Your guidance and protection throughout this novena, that we may grow closer to You and follow Your will. Grant us the grace to persevere in faith and love. Amen.",
            day1: "Lord, on this first day of our novena, we ask You to strengthen our faith. Help us trust in Your divine plan even when we face difficulties and challenges. May our faith never waver but grow stronger each day. Amen.",
            day2: "Lord, on this second day of our novena, we ask You to grant us the gift of hope. Help us to trust in Your promises, even in moments of doubt and uncertainty. May we always find strength in Your loving care. Amen.",
            day3: "Lord, on this third day of our novena, we ask for the grace of love. May we love You above all things and our neighbors as ourselves. Let love guide our actions, words, and thoughts each day. Amen.",
            day4: "Lord, on this fourth day of our novena, we ask You for patience. Help us to bear our burdens with a peaceful heart and to accept Your will in all circumstances, knowing that You are always with us. Amen.",
            day5: "Lord, on this fifth day of our novena, we ask for the grace of forgiveness. Help us to forgive those who have wronged us, just as You forgive us. Let us live with hearts full of mercy and compassion. Amen.",
            day6: "Lord, on this sixth day of our novena, we ask for the gift of humility. Help us to recognize our dependence on You in all things and to be humble in heart, following the example of Christ. Amen.",
            day7: "Lord, on this seventh day of our novena, we ask for strength and courage. Help us face the challenges of life with confidence in Your power and love. Let us never be afraid to follow Your path. Amen.",
            day8: "Lord, on this eighth day of our novena, we ask for the grace of perseverance. When life becomes difficult, help us to keep moving forward in faith, trusting that You are always by our side. Amen.",
            day9: "Lord, on this ninth day of our novena, we ask for Your peace. Fill our hearts with Your divine peace, and may it guide us in our daily lives, bringing us closer to You. Amen.",
            closing: "O Lord, we offer You our prayers and intentions through this novena. May Your will be done in our lives, and may we grow in faith, hope, and love. Grant our petitions if they are according to Your will, and help us to trust in Your divine plan. Amen."
        },    
        tagalog: {
            opening: "O mapagpala at mapagmahal na Diyos, lumalapit kami sa Iyo na may mapagkumbabang puso, inaalay ang aming mga panalangin para sa Iyong awa at mga biyaya. Hinihiling namin ang Iyong paggabay at proteksyon sa buong novena na ito, upang lalo kaming mapalapit sa Iyo at masunod ang Iyong kalooban. Ipagkaloob Mo sa amin ang biyayang magpatuloy sa pananampalataya at pagmamahal. Amen.",
            day1: "Panginoon, sa unang araw ng aming novena, hinihiling namin na palakasin Mo ang aming pananampalataya. Tulungan Mo kaming magtiwala sa Iyong banal na plano kahit sa harap ng mga pagsubok at hamon. Nawa’y hindi manghina ang aming pananampalataya, kundi lalo pang tumibay sa bawat araw. Amen.",
            day2: "Panginoon, sa ikalawang araw ng aming novena, hinihiling namin na pagkalooban Mo kami ng pag-asa. Tulungan Mo kaming magtiwala sa Iyong mga pangako, lalo na sa mga oras ng pagdududa at kawalan ng katiyakan. Amen.",
            day3: "Panginoon, sa ikatlong araw ng aming novena, hinihiling namin ang biyaya ng pagmamahal. Nawa’y mahalin namin ang Iyo higit sa lahat at ang aming kapwa tulad ng aming sarili. Nawa’y gabayan ng pagmamahal ang aming mga kilos, salita, at kaisipan. Amen.",
            day4: "Panginoon, sa ikaapat na araw ng aming novena, hinihiling namin ang biyaya ng pagtitiyaga. Tulungan Mo kaming tanggapin ang Iyong kalooban sa lahat ng pagkakataon at magpatuloy ng may payapang puso. Amen.",
            day5: "Panginoon, sa ikalimang araw ng aming novena, hinihiling namin ang biyaya ng kapatawaran. Tulungan Mo kaming patawarin ang mga nagkasala sa amin, tulad ng pagpapatawad Mo sa amin. Amen.",
            day6: "Panginoon, sa ikaanim na araw ng aming novena, hinihiling namin ang biyaya ng pagpapakumbaba. Tulungan Mo kaming kilalanin ang aming pagdepende sa Iyo sa lahat ng bagay at sundan ang halimbawa ni Kristo. Amen.",
            day7: "Panginoon, sa ikapitong araw ng aming novena, hinihiling namin ang lakas at tapang. Tulungan Mo kaming harapin ang mga hamon ng buhay ng may pagtitiwala sa Iyong kapangyarihan at pagmamahal. Amen.",
            day8: "Panginoon, sa ikawalong araw ng aming novena, hinihiling namin ang biyaya ng pagtitiyaga. Sa harap ng mga pagsubok, tulungan Mo kaming magpatuloy sa pananampalataya. Amen.",
            day9: "Panginoon, sa ikasiyam na araw ng aming novena, hinihiling namin ang Iyong kapayapaan. Punuin Mo ng Iyong kapayapaan ang aming puso, upang gabayan kami sa araw-araw at lalo kaming mapalapit sa Iyo. Amen.",
            closing: "O Panginoon, iniaalay namin sa Iyo ang aming mga panalangin at hangarin sa pamamagitan ng novena na ito. Nawa’y mangyari ang Iyong kalooban sa aming mga buhay, at nawa’y lumago kami sa pananampalataya, pag-asa, at pagmamahal. Amen."
        },
          
          
    };
    

    // Responsive Animated slide logic (copy from RosaryOffer.js)
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

    // Add this function for TTS
    const speakPrayer = () => {
        if (language !== 'Choose Language') {
            const prayer = [
                prayers[language].opening,
                prayers[language].day1,
                prayers[language].day2,
                prayers[language].day3,
                prayers[language].day4,
                prayers[language].day5,
                prayers[language].day6,
                prayers[language].day7,
                prayers[language].day8,
                prayers[language].day9,
                prayers[language].closing
            ].join(' ');
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
                <Text style={styles.headerTitle}>Novena Prayers for All 9 Days</Text>
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
                                <Text style={styles.prayerTitle}>Opening Prayer</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.opening ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 1: Prayer for Faith</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day1 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 2: Prayer for Hope</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day2 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 3: Prayer for Love</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day3 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 4: Prayer for Patience</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day4 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 5: Prayer for Forgiveness</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day5 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 6: Prayer for Humility</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day6 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 7: Prayer for Strength and Courage</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day7 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 8: Prayer for Perseverance</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day8 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Day 9: Prayer for Peace</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.day9 ?? ''}</Text>

                                <Text style={styles.prayerTitle}>Closing Prayer</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.closing ?? ''}</Text>
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

export default NovenaOffer;
