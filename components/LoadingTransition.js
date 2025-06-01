import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Loading1 from './Loading1';
import Loading2 from './Loading2';
import GetStarted from './GetStarted';

const DELAY_BEFORE_FADE = 1200; // ms to show Loading1 before transition
const FADE_DURATION = 500;     // ms for cross-fade
const DELAY_BEFORE_GETSTARTED = 1200; // ms to show Loading2 before crossfading to GetStarted
const GETSTARTED_FADE_DURATION = 500; // ms for cross-fade to GetStarted

const LoadingTransition = ({ onFinish }) => {
  const fadeAnim1 = useRef(new Animated.Value(1)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnimGetStarted = useRef(new Animated.Value(0)).current;
  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    // Step 1: Loading1 -> Loading2
    const timeout1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim1, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Step 2: Loading2 -> GetStarted
        setTimeout(() => {
          setShowGetStarted(true);
          Animated.parallel([
            Animated.timing(fadeAnim2, {
              toValue: 0,
              duration: GETSTARTED_FADE_DURATION,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimGetStarted, {
              toValue: 1,
              duration: GETSTARTED_FADE_DURATION,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (onFinish) onFinish();
          });
        }, DELAY_BEFORE_GETSTARTED);
      });
    }, DELAY_BEFORE_FADE);

    return () => clearTimeout(timeout1);
  }, [fadeAnim1, fadeAnim2, fadeAnimGetStarted, onFinish]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim1, zIndex: 3 }]}>
        <Loading1 />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim2, zIndex: 2 }]}>
        <Loading2 />
      </Animated.View>
      {showGetStarted && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnimGetStarted, zIndex: 1 }]}>
          <GetStarted />
        </Animated.View>
      )}
    </View>
  );
};

export default LoadingTransition;