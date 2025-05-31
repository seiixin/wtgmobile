import React from 'react';
import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Loading1 = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.container}>
        <Image source={require('../assets/logoLoad.png')} style={styles.logo} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: wp('35%'),
    height: wp('35%'),
    resizeMode: 'contain',
    marginBottom: hp('2%'),
  },
  loadingText: {
    fontSize: wp('4.5%'),
    color: '#00aa13',
    fontFamily: 'Inter_700Bold',
    marginTop: hp('1%'),
  },
});

export default Loading1;
