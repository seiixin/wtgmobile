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

const RosaryOffer = () => {
    const [deceasedName, setDeceasedName] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState('Choose Language');
    const [languageItems, setLanguageItems] = useState([
        { label: 'English', value: 'english' },
        { label: 'Tagalog', value: 'tagalog' }
    ]);
    const [accountRemovedModal, setAccountRemovedModal] = useState(false);

    const slideAnim = useRef(new Animated.Value(600)).current;
    const navigation = useNavigation();

    const prayers = {
        english: {
            signOfTheCross: "In the name of the Father, of the Son, and of the Holy Spirit. Amen.",
            apostlesCreed: "I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell. On the third day, He rose again; He ascended into heaven and sits at the right hand of God, the Father Almighty. From there, He will come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
            ourFather: "Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come, Thy will be done on earth as it is in heaven; give us this day our daily bread, and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
        },
        tagalog: {
            signOfTheCross: "Sa ngalan ng Ama, at ng Anak, at ng Espiritu Santo. Amen.",
            apostlesCreed: "Sumasampalataya ako sa Diyos Amang Makapangyarihan sa lahat, na lumalang ng langit at lupa; At kay Jesucristo, iisang Anak ng Diyos, Panginoon nating lahat; na nagkatawang-tao lalang ng Espiritu Santo, ipinanganak ni Santa Mariang Birhen; pinagpakasakit ni Poncio Pilato, ipinako sa krus, namatay at inilibing. Nanaog siya sa mga impiyerno, nang ikatlong araw ay nabuhay na mag-uli, umakyat sa langit, naluluklok sa kanan ng Diyos Amang Makapangyarihan sa lahat, doon magmumula at paririto't huhukom sa nangabubuhay at nangamatay na tao. Sumasampalataya naman ako sa Diyos Espiritu Santo, sa Banal na Simbahang Katolika, sa kasamahan ng mga banal, sa kapatawaran ng mga kasalanan, sa pagkabuhay na mag-uli ng mga nangamatay, at sa buhay na walang hanggan.",
            ourFather: "Ama namin, sumasalangit Ka, sambahin ang ngalan Mo; mapasaamin ang kaharian Mo, sundin ang loob Mo dito sa lupa para nang sa langit; bigyan Mo kami ngayon ng aming kakanin sa araw-araw, at patawarin Mo kami sa aming mga sala, para nang pagpapatawad namin sa nagkakasala sa amin; at huwag Mo kaming ipahintulot sa tukso, at iadya Mo kami sa lahat ng masama. Amen."
        }
    };

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

    // Replace the speakPrayer function with:
    const speakPrayer = () => {
        if (language !== 'Choose Language') {
            const prayer = [
                prayers[language].signOfTheCross,
                prayers[language].apostlesCreed,
                prayers[language].ourFather
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
                <Text style={styles.headerTitle}>Prayers of the Holy Rosary</Text>
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
                    {/* Icons Section */}
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
                                {/* TTS Button */}
                                <TouchableOpacity
                                    style={{
                                        alignSelf: 'center',
                                        backgroundColor: '#006400',
                                        borderRadius: 28,
                                        paddingHorizontal: 36,
                                        paddingVertical: 14,
                                        marginBottom: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                    onPress={speakPrayer}
                                >
                                    <Ionicons name="volume-high" size={28} color="#fff" style={{ marginRight: 12 }} />
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Read Prayers Aloud</Text>
                                </TouchableOpacity>
                                {/* Add this Stop Button below */}
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
                                <Text style={styles.prayerTitle}>The Sign of the Cross</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.signOfTheCross ?? 'Choose Language'}</Text>

                                <Text style={styles.prayerTitle}>The Apostles' Creed</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.apostlesCreed ?? ''}</Text>

                                <Text style={styles.prayerTitle}>The Our Father</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.ourFather ?? ''}</Text>
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
        textAlign: 'center', 
        lineHeight: RFValue(22, height),
        marginBottom: hp('1.5%'),
        marginHorizontal: wp('5%'),
        fontFamily: 'Inter_400Regular',
    },
});

export default RosaryOffer;
