import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const route = useRoute();
  const { grave } = route.params || {};

  // Default coordinates if grave is missing or incomplete
  const latitude = grave?.latitude || 14.472243;
  const longitude = grave?.longitude || 120.976246;

  // State for user location
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  // Smaller deltas for a closer zoom
  const latitudeDelta = 0.002;
  const longitudeDelta = 0.002;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        }}
        minZoomLevel={18}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        showsUserLocation={false}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={grave?.firstName ? `${grave.firstName} ${grave.lastName}` : "Grave Location"}
          description={grave?.location || ""}
          pinColor="red"
        />
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}

        {/* Apartment Box Polygon Example */}
        <Polygon
          coordinates={[
            { latitude: 14.472623, longitude: 120.976221 },
            { latitude: 14.472573, longitude: 120.976271 },
            { latitude: 14.472213, longitude: 120.975911 },
            { latitude: 14.472263, longitude: 120.975846 },
          ]}
          strokeColor="#00FF00"
          fillColor="rgba(102, 102, 102, 0.5)"
          strokeWidth={1}
        />

        {/* Apartment Box 1 near 14.471146, 120.975215 */}
  <Polygon
    coordinates={[
      { latitude: 14.471084, longitude: 120.975068 },
      { latitude: 14.471138, longitude: 120.975127 },
      { latitude: 14.471125, longitude: 120.975142 },
      { latitude: 14.471073, longitude: 120.975082 },
    ]}
    strokeColor="#FF9900"
    fillColor="rgba(255,153,0,0.4)"
    strokeWidth={1}
  />

  {/* Apartment Box 2 near 14.471146, 120.975215 */}
  <Polygon
    coordinates={[
      { latitude: 14.471062, longitude: 120.975093 },
      { latitude: 14.471110, longitude: 120.975148 },
      { latitude: 14.471103, longitude: 120.975158 },
      { latitude: 14.471055, longitude: 120.975107 },
    ]}
    strokeColor="#3366FF"
    fillColor="rgba(51,102,255,0.4)"
    strokeWidth={2}
  />

        {/* You can add more Polygon components for more apartment boxes */}
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {grave ? `${grave.firstName || ""} ${grave.lastName || ""}` : "No grave data"}
        </Text>
        <Text style={styles.infoText}>
          {grave?.location || ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Map;