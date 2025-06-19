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
import MapView, { Polygon, Marker, Overlay } from 'react-native-maps';
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

          <Overlay
          image={require('../assets/Map.png')} // adjust path if different
          bounds={[
            [14.470560, 120.975015], // bottom-left
            [14.473053, 120.977249], // top-right
          ]}
        />


          {/* <Polygon
            coordinates={[
              { latitude: 14.4712738, longitude: 120.9752554 },
              { latitude: 14.4713177, longitude: 120.9752223 },
              { latitude: 14.4711547, longitude: 120.9749755 },
              { latitude: 14.4711062, longitude: 120.9750054 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={[
              { latitude: 14.4710110, longitude: 120.9750829 },
              { latitude: 14.4711809, longitude: 120.9752351 },
              { latitude: 14.4712170, longitude: 120.9751881 },
              { latitude: 14.4710357, longitude: 120.9750397 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={[
              { latitude: 14.4709652, longitude: 120.9751253 },
              { latitude: 14.4711328, longitude: 120.9752790 },
              { latitude: 14.4711581, longitude: 120.9752371 },
              { latitude: 14.4709941, longitude: 120.9750865 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={[
              { latitude: 14.4709198, longitude: 120.9751824 },
              { latitude: 14.4709526, longitude: 120.9751408 },
              { latitude: 14.4711278, longitude: 120.9752971 },
              { latitude: 14.4710916, longitude: 120.9753381 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={[
              { latitude: 14.4708747, longitude: 120.9752319 },
              { latitude: 14.4709053, longitude: 120.9751906 },
              { latitude: 14.4710805, longitude: 120.9753503 },
              { latitude: 14.4710459, longitude: 120.9753907 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={[
              { latitude: 14.4708056, longitude: 120.9752623 },
              { latitude: 14.4708327, longitude: 120.9752218 },
              { latitude: 14.4710364, longitude: 120.9754043 },
              { latitude: 14.4710039, longitude: 120.9754331 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={[
              { latitude: 14.4710962, longitude: 120.9750204 },
              { latitude: 14.4710728, longitude: 120.9750361 },
              { latitude: 14.4711356, longitude: 120.9751044 },
              { latitude: 14.4711521, longitude: 120.9750836 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />
          <Polygon
            coordinates={[
              { latitude: 14.4707701, longitude: 120.9753142 },
              { latitude: 14.4707942, longitude: 120.9752814 },
              { latitude: 14.4709925, longitude: 120.9754558 },
              { latitude: 14.4709717, longitude: 120.9754818 },
            ]}
            strokeColor="rgba(255, 215, 0, 0.9)"
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeWidth={2}
          />

          <Polygon
            coordinates={[
              { latitude: 14.4706415, longitude: 120.9753584 },
              { latitude: 14.4706101, longitude: 120.9754280 },
              { latitude: 14.4706471, longitude: 120.9754494 },
              { latitude: 14.4706809, longitude: 120.9753777 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={2}
          /> */}
          {/* <Marker
            coordinate={{ latitude: 14.47067, longitude: 120.97540 }} // Approximate center
            anchor={{ x: 0.5, y: 1.5 }}
          >
            <Text style={{
              fontWeight: 'bold',
              backgroundColor: 'rgba(255,255,255,0.8)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              fontSize: 12,
            }}>
              Phase 2 Block 1 Adult
            </Text>
          </Marker>
          <Polygon
            coordinates={[
              { latitude: 14.4707113, longitude: 120.9753944 },
              { latitude: 14.4706825, longitude: 120.9754614 },
              { latitude: 14.4707185, longitude: 120.9754804 },
              { latitude: 14.4707503, longitude: 120.9754123 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={2}
          />
          <Marker
            coordinate={{ latitude: 14.47072, longitude: 120.97543 }} // Approximate center
            anchor={{ x: 0.5, y: 1.5 }}
          >
            <Text style={{
              fontWeight: 'bold',
              backgroundColor: 'rgba(255,255,255,0.8)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              fontSize: 12,
            }}>
              Phase 2 Block 2 Adult
            </Text>
          </Marker>
          <Polygon
            coordinates={[
              { latitude: 14.4707839, longitude: 120.9754299 },
              { latitude: 14.4707521, longitude: 120.9754963 },
              { latitude: 14.4707859, longitude: 120.9755128 },
              { latitude: 14.4708244, longitude: 120.9754500 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={2}
          />
          <Marker
            coordinate={{ latitude: 14.47079, longitude: 120.97547 }} // Approximate center
            anchor={{ x: 0.5, y: 1.5 }}
          >
            <Text style={{
              fontWeight: 'bold',
              backgroundColor: 'rgba(255,255,255,0.8)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              fontSize: 12,
            }}>
              Phase 2 Block 3 Adult
            </Text>
          </Marker>

          <Polygon
            coordinates={[
              { latitude: 14.4708442, longitude: 120.9754601 },
              { latitude: 14.4708133, longitude: 120.9755257 },
              { latitude: 14.4708467, longitude: 120.9755457 },
              { latitude: 14.4708818, longitude: 120.9754787 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={2}
          />
          <Marker
            coordinate={{ latitude: 14.47085, longitude: 120.97550 }} // Approximate center
            anchor={{ x: 0.5, y: 1.5 }}
          >
            <Text style={{
              fontWeight: 'bold',
              backgroundColor: 'rgba(255,255,255,0.8)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              fontSize: 12,
            }}>
              Phase 2 Block 4 Adult
            </Text>
          </Marker>
          <Polygon
            coordinates={[
              { latitude: 14.4709076, longitude: 120.9754930 },
              { latitude: 14.4708741, longitude: 120.9755600 },
              { latitude: 14.4709076, longitude: 120.9755786 },
              { latitude: 14.4709449, longitude: 120.9755093 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={2}
          />
          <Marker
            coordinate={{ latitude: 14.47091, longitude: 120.97554 }} // Center of the polygon
            anchor={{ x: 0.5, y: 1.5 }}
          >
            <Text style={{
              fontWeight: 'bold',
              backgroundColor: 'rgba(255,255,255,0.8)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              fontSize: 12,
            }}>
              Phase 2 Block 5 Adult
            </Text>
          </Marker>
          <Polygon
            coordinates={[
              { latitude: 14.4709682, longitude: 120.9755212 },
              { latitude: 14.4709340, longitude: 120.9755886 },
              { latitude: 14.4709738, longitude: 120.9756096 },
              { latitude: 14.4710072, longitude: 120.9755395 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={2}
          />
            <Marker
              coordinate={{ latitude: 14.47097, longitude: 120.97557 }} // Center of the polygon
              anchor={{ x: 0.5, y: 1.5 }}
            >
              <Text style={{
                fontWeight: 'bold',
                backgroundColor: 'rgba(255,255,255,0.8)',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                fontSize: 12,
              }}>
                Phase 2 Block 6 Adult
              </Text>
            </Marker>
          <Polygon
            coordinates={[
              { latitude: 14.4710334, longitude: 120.9755535 },
              { latitude: 14.4710002, longitude: 120.9756226 },
              { latitude: 14.4710405, longitude: 120.9756425 },
              { latitude: 14.4710720, longitude: 120.9755728 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={2}
          />
          <Marker
            coordinate={{ latitude: 14.471045, longitude: 120.97560 }} // Center of your polygon
            anchor={{ x: 0.5, y: 1.5 }} // Adjusts label position above the marker
          >
            <Text style={{ fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.7)', padding: 1, borderRadius: 4 }}>
              Phase 2 Block 7 Adult
            </Text>
          </Marker> */}
          {/* --- End yellow boundary polygons --- */}

          {/* Apartment Box Polygon Example */}
          {/* <Polygon
            coordinates={[
              { latitude: 14.472631, longitude: 120.976238 },
              { latitude: 14.472241, longitude: 120.975821 },
              { latitude: 14.472212, longitude: 120.975855 },
              { latitude: 14.472600, longitude: 120.976277 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={1}
          /> */}

          {/* Apartment Box Polygon Example */}
          {/* <Polygon
            coordinates={[
              { latitude: 14.472172, longitude: 120.975773 },
              { latitude: 14.472172, longitude: 120.975813 },
              { latitude: 14.471590, longitude: 120.975545 },
              { latitude: 14.471620, longitude: 120.975507 },
            ]}
            strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
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
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={1}
          /> */}

          

          

          

          {/* Apartment Box 4 (Green) */}
          {/* <Polygon
            coordinates={[
              { latitude: 14.471223, longitude: 120.975358 },
              { latitude: 14.471188, longitude: 120.975319 },
              { latitude: 14.471073, longitude: 120.975482 },
              { latitude: 14.471110, longitude: 120.975502 },
            ]}
             strokeColor="rgb(237, 237, 237)"
            fillColor="rgba(237, 237, 237, 0.5)"
            strokeWidth={1}
          /> */}

          {/* Apartment Box 5 */}
          
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