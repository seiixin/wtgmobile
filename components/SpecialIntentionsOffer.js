import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, Dimensions, StyleSheet, Image, ScrollView, Animated, StatusBar
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

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

    useEffect(() => {
        const shouldShowPanel = deceasedName.trim() && language !== 'Choose Language';
        Animated.timing(slideAnim, {
            toValue: shouldShowPanel ? 0 : 600,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [deceasedName, language]);

    return (
        <>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
        />
        <ImageBackground source={require('../assets/OfferBg.png')} style={styles.background}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp('7%')} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Special Intentions</Text>
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

                                <Text style={styles.prayerTitle}>Special Intention Prayer</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.prayer?.replace('[name]', deceasedName) ?? ''}</Text>
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

export default SpecialIntentionsOffer;
