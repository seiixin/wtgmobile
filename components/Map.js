import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const GOOGLE_MAPS_APIKEY = 'AIzaSyD-WfvI52mgLSrJQWC00LetbkAzgLhncYA';

const Map = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { grave } = route.params || {};

  // Use grave latitude/longitude from API, fallback to default
  const graveLocation = {
    latitude: grave?.latitude || 14.471161,
    longitude: grave?.longitude || 120.975398,
  };

  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userLoc);

        const midLat = (userLoc.latitude + graveLocation.latitude) / 2;
        const midLng = (userLoc.longitude + graveLocation.longitude) / 2;
        const latDelta = Math.abs(userLoc.latitude - graveLocation.latitude) + 0.002;
        const lngDelta = Math.abs(userLoc.longitude - graveLocation.longitude) + 0.002;

        setRegion({
          latitude: midLat,
          longitude: midLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        });

        setLoading(false);
      } catch (err) {
        console.error('Location error:', err);
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const handleNavigate = () => {
    if (!graveLocation) return;

    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${graveLocation.latitude},${graveLocation.longitude}`,
      android: `google.navigation:q=${graveLocation.latitude},${graveLocation.longitude}&mode=w`,
    });

    Linking.openURL(url).catch(err => console.error('Error opening navigation:', err));
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'←'}</Text>
      </TouchableOpacity>
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker coordinate={graveLocation} title="Grave Location">
            <Text>🪦</Text>
          </Marker>

          {userLocation && (
            <Marker coordinate={userLocation} title="You are here">
              <Text>📍</Text>
            </Marker>
          )}

          {userLocation && (
            <MapViewDirections
              origin={userLocation}
              destination={graveLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#1976D2"
              mode="WALKING"
              onReady={result => {
                setDistance(result.distance);
                setDuration(result.duration);
              }}
              onError={err => console.warn('Directions error:', err)}
            />
          )}
        </MapView>
      ) : loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text>Fetching your location...</Text>
        </View>
      ) : (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Unable to fetch GPS. Please enable location.</Text>
        </View>
      )}

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.name}>
          {grave?.firstName} {grave?.lastName} {grave?.nickname ? `(${grave.nickname})` : ''}
        </Text>
        <Text style={styles.dates}>
          {grave?.dateOfBirth ? new Date(grave.dateOfBirth).toLocaleDateString() : ''} -{' '}
          {grave?.burial ? new Date(grave.burial).toLocaleDateString() : ''}
        </Text>
        <Text style={styles.location}>
          {grave?.aptNo ? `Apartment ${grave.aptNo} | ` : ''}
          {grave?.phase ? `Phase ${grave.phase} | ` : ''}
          {grave?.block ? `Block ${grave.block}` : ''}
        </Text>
        {distance && duration && (
          <Text style={styles.pathInfo}>
            Distance: {distance.toFixed(2)} km | Time: {Math.ceil(duration)} min walk
          </Text>
        )}
        <TouchableOpacity onPress={handleNavigate} style={styles.navigateButton}>
          <Text style={styles.navigateButtonText}>🧭 Navigate to Grave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width,
    height,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 22,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  dates: { fontSize: 14, color: '#444' },
  location: { fontSize: 13, color: '#777' },
  pathInfo: { fontSize: 13, color: '#1976D2', marginTop: 10 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f00',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  navigateButton: {
    marginTop: 15,
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Map;