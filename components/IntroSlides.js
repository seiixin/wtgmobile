import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { GestureHandlerRootView, FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

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

const SLIDE_DURATION = 350;

const IntroSlides = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextIndex, setNextIndex] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState('left');
  const currentPosition = useRef(new Animated.Value(0)).current;
  const nextPosition = useRef(new Animated.Value(0)).current;

  const handleSwipe = (direction) => {
    if (isTransitioning) return;

    let newIndex = currentIndex;
    if (direction === 'left' && currentIndex < slides.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'right' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (newIndex !== currentIndex) {
      setIsTransitioning(true);
      setNextIndex(newIndex);
      setSwipeDirection(direction);

      // Set initial positions
      currentPosition.setValue(0);
      nextPosition.setValue(direction === 'left' ? width : -width);

      Animated.parallel([
        Animated.timing(currentPosition, {
          toValue: direction === 'left' ? -width : width,
          duration: SLIDE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(nextPosition, {
          toValue: 0,
          duration: SLIDE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(newIndex);
        setNextIndex(null);
        setIsTransitioning(false);
      });
    }
  };

  const goToNextScreen = () => {
    if (currentIndex < slides.length - 1) {
      handleSwipe('left');
    } else {
      navigation.navigate('SignIn');
    }
  };

  // Helper to render a slide
  const renderSlide = (slide, animatedStyle = {}) => (
    <Animated.View style={[styles.slideContainer, animatedStyle]}>
      <ImageBackground
        source={slide.source}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );

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
              {/* Current Slide */}
              {renderSlide(
                slides[currentIndex],
                isTransitioning
                  ? {
                      transform: [{ translateX: currentPosition }],
                      zIndex: 2,
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }
                  : {}
              )}

              {/* Next Slide (only during transition) */}
              {isTransitioning && nextIndex !== null &&
                renderSlide(
                  slides[nextIndex],
                  {
                    transform: [{ translateX: nextPosition }],
                    zIndex: 1,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                  }
                )}

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
  slideContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.0)',
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    marginBottom: hp('18%'),
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
