import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ImageBackground, StyleSheet, Image, ScrollView, Animated
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const NovenaOffer = () => {
    const [deceasedName, setDeceasedName] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState('Choose Language'); // Default to English
    const [languageItems, setLanguageItems] = useState([
        { label: 'English', value: 'english' },
        { label: 'Tagalog', value: 'tagalog' },
        { label: 'Bisaya', value: 'bisaya' }
    ]);

    const slideAnim = useRef(new Animated.Value(600)).current; // Start fully hidden off-screen
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
        bisaya: {
              opening: "O labing maloloy-on ug mahigugmaong Diyos, nagaduol kami Kanimo nga may mapainubsanon nga mga kasingkasing, nagahalad sa among mga pag-ampo alang sa Imong kalooy ug panalangin. Nagaampo kami sa Imong giya ug proteksyon sulod ning novena, aron kami mopaduol Kanimo ug mosunod sa Imong kabubut-on. Ihatag kanamo ang grasya sa pagpadayon sa pagtuo ug gugma. Amen.",
              day1: "Ginoo, sa unang adlaw sa among novena, nagaampo kami nga palig-onon Mo ang among pagtuo. Tabangi kami nga mosalig sa Imong balaan nga plano bisan pa sa mga kalisdanan ug hagit. Nawa unta ang among pagtuo dili maluya kondili magpalig-on matag adlaw. Amen.",
              day2: "Ginoo, sa ikaduhang adlaw sa among novena, nagaampo kami nga hatagan Mo kami og paglaom sa tanang panahon. Tabangi kami nga dili mawala ang among paglaom bisan sa mga pagsulay ug kasakit sa kinabuhi. Amen.",
              day3: "Ginoo, sa ikatulong adlaw sa among novena, nagaampo kami alang sa imong gugma. Ipaambit kanamo ang Imong gugma aron kami makahatag ug tinuod nga gugma sa uban. Amen.",
              day4: "Ginoo, sa ikaupat nga adlaw sa among novena, nagaampo kami alang sa kalig-on sa espirituhanon nga kinabuhi. Tabangi kami nga magmalig-on sa pagtuo ug dili matintal sa mga pagsulay. Amen.",
              day5: "Ginoo, sa ikalima nga adlaw sa among novena, nagaampo kami alang sa kalinaw sa among mga kasingkasing ug hunahuna. Hatagi kami ug kalinaw nga gikan Kanimo aron kami magpadayon sa pagtuo bisan sa kalibog ug kabalaka. Amen.",
              day6: "Ginoo, sa ikaunom nga adlaw sa among novena, nagaampo kami alang sa kagawasan gikan sa mga sala. Tabangi kami nga mobiya sa mga butang nga nagapahilayo kanamo gikan Kanimo. Amen.",
              day7: "Ginoo, sa ikapito nga adlaw sa among novena, nagaampo kami alang sa kaalam. Ihatag kanamo ang kaalam aron makasabot kami sa Imong mga pulong ug kabubut-on. Amen.",
              day8: "Ginoo, sa ikawalong adlaw sa among novena, nagaampo kami alang sa kaisug. Tabangi kami nga dili mahadlok sa pag-atubang sa mga hagit sa kinabuhi uban ang Imong giya ug proteksyon. Amen.",
              day9: "Ginoo, sa ikasiyam nga adlaw sa among novena, nagaampo kami nga ang among mga pag-ampo ug mga hangyo motuhop sa Imong kabubut-on. Ihatag kanamo ang grasya nga kinahanglanon aron kami magpadayon sa pag-alagad ug pagtuo Kanimo. Amen.",
              closing: "O Ginoo, among gihalad Kanimo ang among mga pag-ampo ug mga tinguha pinaagi ning novena. Nawa ang Imong kabubut-on matuman sa among kinabuhi ug kami motubo sa pagtuo, paglaom, ug gugma. Ihatag ang among mga pangaliya kung kini sumala sa Imong kabubut-on, ug tabangi kami nga mosalig sa Imong balaan nga plano. Amen."
        },
          
          
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
                <Text style={styles.headerTitle}>Novena Prayers for All 9 Days</Text>
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

                            <Text style={styles.prayerTitle}>Closing Prayer </Text>
                            <Text style={styles.prayerText}>{prayers[language]?.closing ?? ''}</Text>
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

export default NovenaOffer;
