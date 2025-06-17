import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const route = useRoute();
  const { grave } = route.params || {};

  // Default coordinates if grave is missing or incomplete
  const latitude = grave?.latitude || 14.471161;
  const longitude = grave?.longitude || 120.975398;

  // State for user location
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);

        // Optionally animate to user location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...coords,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }, 1000);
        }
      }
    })();
  }, []);

  // Smaller deltas for a closer zoom
  const latitudeDelta = 0.002;
  const longitudeDelta = 0.002;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
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
        showsUserLocation={true} 
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
            { latitude: 14.472631, longitude: 120.976238 },
            { latitude: 14.472241, longitude: 120.975821 },
            { latitude: 14.472212, longitude: 120.975855},
            { latitude: 14.472600, longitude: 120.976277 },
          ]}
          strokeColor="rgb(237, 237, 237)"
          fillColor="rgb(237, 237, 237)"
          strokeWidth={1}
        />


        {/* Apartment Box Polygon Example */}
        <Polygon
          coordinates={[
            { latitude: 14.472172, longitude: 120.975773 },
            { latitude: 14.472172, longitude: 120.975813 },
            { latitude: 14.471590, longitude: 120.975545},
            { latitude: 14.471620, longitude: 120.975507 },
            
          ]}
          strokeColor="rgb(237, 237, 237)"
          fillColor="rgb(237, 237, 237)"
          strokeWidth={1}
        />

        <Polygon
          coordinates={[
            { latitude: 14.471570, longitude: 120.975481 },
            { latitude: 14.471549, longitude: 120.975515 },
            { latitude: 14.471336, longitude: 120.975333 },
            { latitude: 14.471367, longitude: 120.975303 },
            
          ]}
          strokeColor="rgb(237, 237, 237)"
          fillColor="rgb(237, 237, 237)"
          strokeWidth={1}
        />


        {/* Apartment Box 1 near 14.471146, 120.975215 */}
  <Polygon
    coordinates={[
      { latitude: 14.471084, longitude: 120.975068 },
      { latitude: 14.471138, longitude: 120.975127 },
      { latitude: 14.471125, longitude: 120.975140 },
      { latitude: 14.471071, longitude: 120.975082 },
    ]}
    strokeColor="rgb(237, 237, 237)"
    fillColor="rgb(237, 237, 237)"
    strokeWidth={1}
  />

  {/* Apartment Box 2 near 14.471146, 120.975215 */}
  <Polygon
    coordinates={[
      { latitude: 14.471062, longitude: 120.975093 },
      { latitude: 14.471117, longitude: 120.975148 },
      { latitude: 14.471103, longitude: 120.975163 },
      { latitude: 14.471049, longitude: 120.975107 },
    ]}
    strokeColor="rgb(237, 237, 237)"
    fillColor="rgb(237, 237, 237)"
    strokeWidth={1}
  />

<Polygon
    coordinates={[
      { latitude: 14.471277, longitude: 120.975304 },
      { latitude: 14.471240, longitude: 120.975338 },
      { latitude: 14.471127, longitude: 120.975214 },
      { latitude: 14.471157, longitude: 120.975174 },
    ]}
    strokeColor="rgb(237, 237, 237)"
    fillColor="rgb(237, 237, 237)"
    strokeWidth={1}
  />

<Polygon
    coordinates={[
      { latitude: 14.471223, longitude: 120.975358 },
      { latitude: 14.471188, longitude: 120.975319 },
      { latitude: 14.471073, longitude: 120.975482 },
      { latitude: 14.471110, longitude: 120.975502 },
    ]}
    strokeColor="rgb(67, 209, 1)"
    fillColor="rgb(67, 209, 1)"
    strokeWidth={1}
  />

<Polygon
    coordinates={[
      { latitude: 14.471048, longitude: 120.975431 },
      { latitude: 14.470878, longitude: 120.975287 },
      { latitude: 14.470854, longitude: 120.975318 },
      { latitude: 14.471022, longitude: 120.975459 },
    ]}
    strokeColor="rgb(237, 237, 237)"
    fillColor="rgb(237, 237, 237)"
    strokeWidth={1}
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