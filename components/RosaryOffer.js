    import React, { useState, useRef, useEffect } from 'react';
    import {
        View, Text, TextInput, ImageBackground, StyleSheet, Image, ScrollView, Animated
    } from 'react-native';
    import { TouchableOpacity } from 'react-native';
    import DropDownPicker from 'react-native-dropdown-picker';
    import { useNavigation } from '@react-navigation/native';
    import { Ionicons } from '@expo/vector-icons';

    const RosaryOffer = () => {
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
                apostlesCreed: "I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell. On the third day, He rose again; He ascended into heaven and sits at the right hand of God, the Father Almighty. From there, He will come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
                ourFather: "Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come, Thy will be done on earth as it is in heaven; give us this day our daily bread, and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
            },
            tagalog: {
                signOfTheCross: "Sa ngalan ng Ama, at ng Anak, at ng Espiritu Santo. Amen.",
                apostlesCreed: "Sumasampalataya ako sa Diyos Amang Makapangyarihan sa lahat, na lumalang ng langit at lupa; At kay Jesucristo, iisang Anak ng Diyos, Panginoon nating lahat; na nagkatawang-tao lalang ng Espiritu Santo, ipinanganak ni Santa Mariang Birhen; pinagpakasakit ni Poncio Pilato, ipinako sa krus, namatay at inilibing. Nanaog siya sa mga impiyerno, nang ikatlong araw ay nabuhay na mag-uli, umakyat sa langit, naluluklok sa kanan ng Diyos Amang Makapangyarihan sa lahat, doon magmumula at paririto't huhukom sa nangabubuhay at nangamatay na tao. Sumasampalataya naman ako sa Diyos Espiritu Santo, sa Banal na Simbahang Katolika, sa kasamahan ng mga banal, sa kapatawaran ng mga kasalanan, sa pagkabuhay na mag-uli ng mga nangamatay, at sa buhay na walang hanggan.",
                ourFather: "Ama namin, sumasalangit Ka, sambahin ang ngalan Mo; mapasaamin ang kaharian Mo, sundin ang loob Mo dito sa lupa para nang sa langit; bigyan Mo kami ngayon ng aming kakanin sa araw-araw, at patawarin Mo kami sa aming mga sala, para nang pagpapatawad namin sa nagkakasala sa amin; at huwag Mo kaming ipahintulot sa tukso, at iadya Mo kami sa lahat ng masama. Amen."
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
                    <Text style={styles.headerTitle}>Prayers of the Holy Rosary</Text>
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

                                <Text style={styles.prayerTitle}>The Apostles' Creed</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.apostlesCreed ?? ''}</Text>

                                <Text style={styles.prayerTitle}>The Our Father</Text>
                                <Text style={styles.prayerText}>{prayers[language]?.ourFather ?? ''}</Text>
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

    export default RosaryOffer;
