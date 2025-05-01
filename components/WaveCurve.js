import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WaveCurve = ({ color = '#f1f1f1' }) => {
  return (
    <View style={styles.waveContainer}>
      <Svg
        height={90}
        width="100%"
        viewBox="0 0 1440 320"
      >
        {/* Stronger and Lower Shadow Path */}
        <Path
          fill="rgba(0, 0, 0, 0.4)"
          d="M0,165 Q720,385 1440,165 V320 H0 Z"
        />
        <Path
          fill="rgba(0, 0, 0, 0.25)"
          d="M0,160 Q720,380 1440,160 V320 H0 Z"
        />
        
        {/* Main Wave */}
        <Path
          fill={color}
          d="M0,140 Q720,360 1440,140 V320 H0 Z"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  waveContainer: {
    position: 'absolute',
    top: -70,
    left: 0,
    right: 0,
  },
});

export default WaveCurve;
