import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ScreenOrientation from 'expo-screen-orientation';

// ✅ Import Icons
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import Screens
import Loading1 from './components/Loading1';
import Loading2 from './components/Loading2';
import LoadingTransition from './components/LoadingTransition';
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
import QRScanner from './components/QRScanner';
import Map from './components/Map';

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
const Stack = createStackNavigator();

// Custom fade transition for all screens
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

// ✅ Main App Stack (Includes Loading Screens & GetStarted)
const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: forFade, // 👈 apply fade transition globally
    }}
  >
    <Stack.Screen name="LoadingTransition" component={LoadingTransition} />
    <Stack.Screen name="GetStarted" component={GetStarted} />
    <Stack.Screen name="IntroSlides" component={IntroSlides} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Verification" component={Verification} />

    {/* Directly add History, Bookmarks, and Prayers */}
    <Stack.Screen name="Prayers" component={Prayers} />
    <Stack.Screen name="History" component={History} />
    <Stack.Screen name="Bookmarks" component={Bookmarks} />
 
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
    <Stack.Screen name="QRScanner" component={QRScanner} options={{ headerShown: false }} />
    <Stack.Screen name="Map" component={Map} />
    
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

// ✅ Main App Component
export default function App() {
  const navigationRef = useRef();

  // Handler for when loading transition finishes
  const handleLoadingFinish = () => {
    navigationRef.current?.navigate('GetStarted');
  };

  useEffect(() => {
    // Lock the orientation to portrait
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}
      >
        <Stack.Screen
          name="LoadingTransition"
          children={() => <LoadingTransition onFinish={handleLoadingFinish} />}
        />
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="IntroSlides" component={IntroSlides} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Verification" component={Verification} />

        {/* Directly add History, Bookmarks, and Prayers */}
        <Stack.Screen name="Prayers" component={Prayers} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Bookmarks" component={Bookmarks} />
      
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
        <Stack.Screen name="QRScanner" component={QRScanner} options={{ headerShown: false }} />
        <Stack.Screen name="Map" component={Map} />
        
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
    </NavigationContainer>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  
});
