import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// ✅ Import Icons
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import Screens
import Loading1 from './components/Loading1';
import Loading2 from './components/Loading2';
import GetStarted from './components/GetStarted';
import IntroSlides from './components/IntroSlides';
import History from './components/History';
import Bookmarks from './components/Bookmarks';
import Prayers from './components/Prayers';
import RosaryPrayer from './components/RosaryPrayer';
import NovenaPrayer from './components/NovenaPrayer';
import MassIntention from './components/MassIntention';
import PsalmReading from './components/PsalmReading';
import SpecialIntention from './components/SpecialIntention';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Verification from './components/Verification';
import RosaryOffer from './components/RosaryOffer';
import NovenaOffer from './components/NovenaOffer';
import MassOffer from './components/MassOffer';
import PsalmReadingOffer from './components/PsalmReadingOffer';
import SpecialIntentionsOffer from './components/SpecialIntentionsOffer';
import EditProfile from './components/EditProfile';
import Services from './components/Services';
import AdultDetails from './components/AdultDetails';
import ChildAptDetails from './components/ChildAptDetails';
import BoneAptDetails from './components/BoneAptDetails';
import PrivateLotDetails from './components/PrivateLotDetails';
import GuestScreen from './components/GuestScreen';
import ChangePassFind from './components/ChangePassFind';
import VerificationReset from './components/VerificationReset';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import GraveInformation from './components/GraveInformation';
import GuestLogin from './components/GuestLogin';
import RequestedServices from './components/RequestedServices';
import ServicesScreenWithDrawer from './components/Services';
import VerificationRegister from './components/VerificationRegister';
import VerificationForgotPass from './components/VerificationForgotPass';


import FAQs from './components/FAQs';
import GeneralQuestions from './components/GeneralQuestions';
import AccountAndProfiles from './components/AccountAndProfiles';
import GraveSearchAndNavigation from './components/GraveSearchAndNavigation';
import VirtualTributes from './components/VirtualTributes';
import CemeteryServicesAndManagement from './components/CemeteryServicesAndManagement';
import TechnicalSupport from './components/TechnicalSupport';




import FAQsGuestScreen from './components/FAQsGuestScreen';
import GuestGeneralQuestions from './components/GuestGeneralQuestions';
import GuestAccountandProfile from './components/GuestAccountandProfile';
import GuestGraveSearch from './components/GuestGraveSearch';
import GuestVirtualTributes from './components/GuestVirtualTributes';
import GuestCemeteryServices from './components/GuestCemeteryServices';
import GuestTechnicalSupport from './components/GuestTechnicaSuppport';


// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ✅ Main App Stack (Includes Loading Screens & GetStarted)
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Loading1" component={Loading1} />
    <Stack.Screen name="Loading2" component={Loading2} />
    <Stack.Screen name="GetStarted" component={GetStarted} />
    <Stack.Screen name="IntroSlides" component={IntroSlides} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Verification" component={Verification} />

    {/* ✅ Use MainTabs instead of repeating History, Bookmarks, and Prayers */}
    <Stack.Screen name="MainTabs" component={MainTabs} />

    {/* ✅ Other screens */}
    <Stack.Screen name="RosaryPrayer" component={RosaryPrayer} />
    <Stack.Screen name="NovenaPrayer" component={NovenaPrayer} />
    <Stack.Screen name="MassIntention" component={MassIntention} />
    <Stack.Screen name="PsalmReading" component={PsalmReading} />
    <Stack.Screen name="SpecialIntention" component={SpecialIntention} />
    <Stack.Screen name="RosaryOffer" component={RosaryOffer} />
    <Stack.Screen name="NovenaOffer" component={NovenaOffer} />
    <Stack.Screen name="PsalmReadingOffer" component={PsalmReadingOffer} />
    <Stack.Screen name="MassOffer" component={MassOffer} />
    <Stack.Screen name="SpecialIntentionsOffer" component={SpecialIntentionsOffer} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="Services" component={Services} />
    <Stack.Screen name="AdultDetails" component={AdultDetails} />
    <Stack.Screen name="ChildAptDetails" component={ChildAptDetails} />
    <Stack.Screen name="BoneAptDetails" component={BoneAptDetails} />
    <Stack.Screen name="PrivateLotDetails" component={PrivateLotDetails} />
    <Stack.Screen name="GuestScreen" component={GuestScreen} />
    <Stack.Screen name="ChangePassFind" component={ChangePassFind} />
    <Stack.Screen name="VerificationReset" component={VerificationReset} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="GraveInformation" component={GraveInformation} />
    <Stack.Screen name="GuestLogin" component={GuestLogin} />
    <Stack.Screen name="RequestedServices" component={RequestedServices} />
    <Stack.Screen name="ServicesScreenWithDrawer" component={ServicesScreenWithDrawer} />
    <Stack.Screen name="VerificationRegister" component={VerificationRegister} />
    <Stack.Screen name="VerificationForgotPass" component={VerificationForgotPass} />


    
    <Stack.Screen name="FAQs" component={FAQs} />
    <Stack.Screen name="GeneralQuestions" component={GeneralQuestions} />
    <Stack.Screen name="AccountAndProfiles" component={AccountAndProfiles} />
    <Stack.Screen name="GraveSearchAndNavigation" component={GraveSearchAndNavigation} />
    <Stack.Screen name="VirtualTributes" component={VirtualTributes} />
    <Stack.Screen name="CemeteryServicesAndManagement" component={CemeteryServicesAndManagement} />
    <Stack.Screen name="TechnicalSupport" component={TechnicalSupport} />


    <Stack.Screen name="FAQsGuestScreen" component={FAQsGuestScreen} />
    <Stack.Screen name="GuestGeneralQuestions" component={GuestGeneralQuestions} />
    <Stack.Screen name="GuestAccountandProfile" component={GuestAccountandProfile} />
    <Stack.Screen name="GuestGraveSearch" component={GuestGraveSearch} />
    <Stack.Screen name="GuestVirtualTributes" component={GuestVirtualTributes} />
    <Stack.Screen name="GuestCemeteryServices" component={GuestCemeteryServices}/>
    <Stack.Screen name="GuestTechnicalSupport" component={GuestTechnicalSupport}/>
    
  </Stack.Navigator>
);

// ✅ Bottom Tab Navigator
const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
    <Tab.Screen name="HistoryTab" component={History} />
    <Tab.Screen name="BookmarksTab" component={Bookmarks} />
    <Tab.Screen name="PrayersTab" component={PrayersStack} />
  </Tab.Navigator>
);

// ✅ Prayers Stack (to avoid conflicts)
const PrayersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PrayersScreen" component={Prayers} />
    
  </Stack.Navigator>
);

// ✅ Custom Bottom Navigation Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        let iconName;
        if (route.name === 'HistoryTab') iconName = 'history';
        if (route.name === 'BookmarksTab') iconName = 'bookmark';
        if (route.name === 'PrayersTab') iconName = 'pray';

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabButton, isFocused && styles.activeTab]}
          >
            <Icon
              name={iconName}
              size={24}
              color={isFocused ? "#12894f" : "#a6a6a6"}
            />
            <Text style={[styles.tabText, isFocused && styles.activeText]}>
              {route.name.replace("Tab", "")}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ✅ Main App Component
export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      navigationRef.current?.navigate('Loading2');
    }, 2000); // 2s delay for Loading1

    setTimeout(() => {
      navigationRef.current?.navigate('GetStarted');
    }, 4000); // 2s delay for Loading2
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    padding: 10,
  },
  tabText: {
    color: '#a6a6a6',
    fontSize: 12,
    marginTop: 2,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  activeText: {
    color: '#12894f',
  },
});
 