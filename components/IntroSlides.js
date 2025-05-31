import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { GestureHandlerRootView, FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Slide Data
const slides = [
  {
    id: 1,
    source: require('../assets/Content1.png'),
    title: 'No more getting lost aimlessly!',
    description: 'Our vision is to be the Waze of cemeteries, providing a local database to locate where your loved one is buried, how to get there, and navigate through the cemetery until you arrive at the grave itself.',
  },
  {
    id: 2,
    source: require('../assets/Content2.png'),
    title: 'We wanted to prevent that, and more!',
    description: "We wanted to help you when it comes to preserving and cultivating the grave, lighting virtual candle, printing prayers according to the deceased's name, and more. Whatever is possible. To slightly ease the grief.",
  },
  {
    id: 3,
    source: require('../assets/Content3.png'),
    title: 'We achieved a digital revolution for graves.',
    description: 'We provided a precise snapshot of burial reserves, types of burial plots and details on the deceased, and tools for daily management and maintenance of the area.',
  },
];

const IntroSlides = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleSwipe = (direction) => {
    let newIndex = currentIndex;

    if (direction === 'left' && currentIndex < slides.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'right' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (newIndex !== currentIndex) {
      // Start fading out the text first
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(newIndex); // Change content while invisible

        // Reset position & Fade-in new content
        translateX.setValue(direction === 'left' ? wp('100%') : -wp('100%'));
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const goToNextScreen = () => {
    if (currentIndex < slides.length - 1) {
      handleSwipe('left');
    } else {
      navigation.navigate('SignIn'); // Navigate to SignIn screen
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END) handleSwipe('left');
          }}
        >
          <FlingGestureHandler
            direction={Directions.RIGHT}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) handleSwipe('right');
            }}
          >
            <View style={styles.container}>
              {/* Background Image */}
              <Animated.View
                style={[
                  styles.backgroundContainer,
                  { transform: [{ translateX }] }, // Move image smoothly
                ]}
              >
                <ImageBackground
                  source={slides[currentIndex].source}
                  style={styles.backgroundImage}
                  resizeMode="cover"
                />
              </Animated.View>

              {/* Title & Description (Now Fades In/Out Properly) */}
              <Animated.View
                style={[
                  styles.textContainer,
                  { opacity }, // Fade effect on text
                ]}
              >
                <Text style={styles.title}>{slides[currentIndex].title}</Text>
                <Text style={styles.description}>{slides[currentIndex].description}</Text>
              </Animated.View>

              {/* Pagination Dots */}
              <View style={styles.paginationContainer}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      { backgroundColor: index === currentIndex ? '#007bff' : '#ccc' },
                    ]}
                  />
                ))}
              </View>

              {/* Navigation Arrow (Only on Last Slide) */}
              {currentIndex === slides.length - 1 && (
                <TouchableOpacity style={styles.arrowButton} onPress={goToNextScreen}>
                  <Ionicons name="arrow-forward-circle" size={wp('15%')} color="#007bff" />
                </TouchableOpacity>
              )}
            </View>
          </FlingGestureHandler>
        </FlingGestureHandler>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: hp('18%'),
    width: '100%',
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
  },
  title: {
    fontSize: wp('6.5%'),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    fontFamily: 'Inter_700Bold',
  },
  description: {
    fontSize: wp('4%'),
    color: '#000',
    textAlign: 'center',
    lineHeight: hp('3%'),
    fontFamily: 'Inter_400Regular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: hp('10%'),
    width: '100%',
  },
  dot: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('1.5%'),
    marginHorizontal: wp('1.5%'),
  },
  arrowButton: {
    position: 'absolute',
    bottom: hp('4%'),
    right: wp('7%'),
  },
});

export default IntroSlides;
