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
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure this is imported

const { width, height } = Dimensions.get('window');
const BASE_URL = "https://walktogravemobile-backendserver.onrender.com";

const MassOffer = () => {
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
            prayer2: `Heavenly Father, I come to you in prayer, knowing that you are the LORD who heals me (Exodus 15:26). I ask that you take away sickness, infirmity and pain from me and restore me to health (Psalm 103:2-3). I thank you for sending your Son into the world, who drove out evil spirits with a command and cured all who were sick (Matthew 8:16-17). Your love and compassion have not changed (Lamentations 3:22-23). You are the same yesterday, today, and forever (Hebrews 13:8). I ask for your Holy Spirit to flow through me and for the destruction of Satan’s work in my life (Ephesians 6:12). I bless you, Father, and forget none of your benefits. I trust in your promise to forgive all my sins and heal all my diseases (Psalm 103:3). I believe that by Jesus’ wounds, I have been healed (Isaiah 53:5). I give you all the glory and praise (Revelation 5:13). Amen.`
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
            prayer2: `Amang Banal, lumalapit ako sa Iyo sa panalangin, na alam kong Ikaw ang Panginoon na nagpapagaling sa akin (Exodo 15:26). Ako’y humihiling na alisin Mo ang karamdaman, kahinaan, at sakit mula sa akin at ibalik Mo ako sa kalusugan (Awit 103:2-3). Nagpapasalamat ako sa Iyong pagpapadala ng Iyong Anak sa mundo, na nagpalayas ng masasamang espiritu sa pamamagitan ng utos at nagpagaling sa lahat ng may sakit (Mateo 8:16-17). Ang Iyong pagmamahal at habag ay hindi nagbago (Panaghoy 3:22-23). Ikaw ay pareho kahapon, ngayon, at magpakailanman (Hebreo 13:8). Ako’y humihiling ng Iyong Banal na Espiritu na dumaloy sa akin at para sa pagkawasak ng gawa ni Satanas sa aking buhay (Efeso 6:12). Pinagpapala Kita, Ama, at hindi ko malilimutan ang lahat ng Iyong mga benepisyo. Nagtitiwala ako sa Iyong pangako na patawarin ang lahat ng aking mga kasalanan at pagalingin ang lahat ng aking mga karamdaman (Awit 103:3). Naniniwala ako na sa mga sugat ni Jesus, ako ay napagaling na (Isaias 53:5). Ibinibigay ko sa Iyo ang lahat ng papuri at kaluwalhatian (Pahayag 5:13). Amen.`
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
                <Text style={styles.headerTitle}>Mass Intentions</Text>
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

export default MassOffer;
