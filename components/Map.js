import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polygon, Overlay, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyD-WfvI52mgLSrJQWC00LetbkAzgLhncYA';

const Map = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { grave } = route.params || {};
  const mapRef = useRef(null);

  // State management
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  
  // Smart Navigation States
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationProgress, setNavigationProgress] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [distanceToGrave, setDistanceToGrave] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [isInsideCemetery, setIsInsideCemetery] = useState(false);

  // Use grave latitude/longitude from API, fallback to default
  const graveLocation = {
    latitude: grave?.latitude || 14.471161,
    longitude: grave?.longitude || 120.975398,
  };

  // Cemetery boundary polygon
  const cemeteryBoundary = [
    { latitude: 14.470560, longitude: 120.975015 },
    { latitude: 14.470560, longitude: 120.977249 },
    { latitude: 14.473053, longitude: 120.977249 },
    { latitude: 14.473053, longitude: 120.975015 },
  ];

  // Internal cemetery paths
  const cemeteryPaths = [
    [
      { latitude: 14.471200, longitude: 120.975500 },
      { latitude: 14.471800, longitude: 120.976000 },
      { latitude: 14.472200, longitude: 120.976200 },
    ],
    [
      { latitude: 14.471000, longitude: 120.975800 },
      { latitude: 14.471500, longitude: 120.976300 },
      { latitude: 14.472000, longitude: 120.976500 },
    ]
  ];

  // Initialize location and start auto-navigation
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required for navigation.');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(userCoords);

        const midLat = (userCoords.latitude + graveLocation.latitude) / 2;
        const midLng = (userCoords.longitude + graveLocation.longitude) / 2;
        const latDelta = Math.abs(userCoords.latitude - graveLocation.latitude) + 0.002;
        const lngDelta = Math.abs(userCoords.longitude - graveLocation.longitude) + 0.002;

        setRegion({
          latitude: midLat,
          longitude: midLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        });

        setLoading(false);

        // Auto-start navigation after getting location
        setTimeout(() => {
          startAutoNavigation(userCoords);
        }, 1000);

      } catch (error) {
        console.error('Error getting location:', error);
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Real-time location tracking for navigation
  useEffect(() => {
    let locationSubscription;

    if (isNavigating) {
      const startLocationTracking = async () => {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000, // Update every 2 seconds
            distanceInterval: 1, // Update every 1 meter
          },
          (location) => {
            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setUserLocation(newLocation);
            updateNavigationProgress(newLocation);
          }
        );
      };

      startLocationTracking();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isNavigating]);

  // Smart Navigation Functions
  const startAutoNavigation = (userCoords) => {
    if (!userCoords) return;

    setIsNavigating(true);
    const distanceToTarget = calculateDistance(userCoords, graveLocation);
    setDistanceToGrave(distanceToTarget);

    // Check if user is inside cemetery
    const insideCemetery = isPointInPolygon(userCoords, cemeteryBoundary);
    setIsInsideCemetery(insideCemetery);

    if (insideCemetery) {
      setCurrentInstruction('🏛️ Following internal cemetery paths...');
    } else {
      setCurrentInstruction('🚶 Walking to cemetery entrance...');
    }

    // Estimate arrival time (assuming 5 km/h walking speed)
    const walkingSpeed = 5; // km/h
    const timeInHours = distanceToTarget / 1000 / walkingSpeed;
    const timeInMinutes = Math.ceil(timeInHours * 60);
    setEstimatedArrival(timeInMinutes);

    Alert.alert(
      '🧭 Smart Navigation Started',
      `Auto-navigating to ${grave?.firstName} ${grave?.lastName}'s grave.\n\nDistance: ${distanceToTarget.toFixed(0)}m\nEst. arrival: ${timeInMinutes} min`,
      [{ text: 'Got it!' }]
    );
  };

  const updateNavigationProgress = (currentLocation) => {
    const distanceToTarget = calculateDistance(currentLocation, graveLocation);
    setDistanceToGrave(distanceToTarget);

    // Check if user is inside cemetery
    const insideCemetery = isPointInPolygon(currentLocation, cemeteryBoundary);
    setIsInsideCemetery(insideCemetery);

    // Update instruction based on location
    if (distanceToTarget < 10) {
      setCurrentInstruction('🎯 You have arrived at the grave!');
      setNavigationProgress(100);
      completeNavigation();
    } else if (distanceToTarget < 50) {
      setCurrentInstruction('🎯 Almost there! Look around for the grave marker.');
      setNavigationProgress(95);
    } else if (insideCemetery) {
      setCurrentInstruction('🏛️ Following cemetery paths to the grave...');
      setNavigationProgress(70);
    } else {
      setCurrentInstruction('🚶 Walking to cemetery entrance...');
      // Calculate progress based on distance (assuming 1000m max distance)
      const progress = Math.max(0, 100 - (distanceToTarget / 10));
      setNavigationProgress(Math.min(progress, 65));
    }
  };

  const completeNavigation = () => {
    setTimeout(() => {
      Alert.alert(
        '🎉 Navigation Complete!',
        `You have arrived at ${grave?.firstName} ${grave?.lastName}'s grave.`,
        [
          { text: 'Stop Navigation', onPress: () => setIsNavigating(false) },
          { text: 'Continue Tracking', style: 'cancel' }
        ]
      );
    }, 1000);
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI/180;
    const φ2 = point2.latitude * Math.PI/180;
    const Δφ = (point2.latitude-point1.latitude) * Math.PI/180;
    const Δλ = (point2.longitude-point1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const isPointInPolygon = (point, polygon) => {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].latitude > point.latitude) !== (polygon[j].latitude > point.latitude)) &&
          (point.longitude < (polygon[j].longitude - polygon[i].longitude) * (point.latitude - polygon[i].latitude) / (polygon[j].latitude - polygon[i].latitude) + polygon[i].longitude)) {
        isInside = !isInside;
      }
    }
    return isInside;
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setNavigationProgress(0);
    setCurrentInstruction('');
    Alert.alert('Navigation Stopped', 'You can restart navigation anytime.');
  };

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

      {/* Navigation Status */}
      {isNavigating && (
        <View style={styles.navigationStatus}>
          <Text style={styles.navigationTitle}>🧭 Navigating to Grave</Text>
          <Text style={styles.navigationInstruction}>{currentInstruction}</Text>
          {distanceToGrave && (
            <Text style={styles.navigationDistance}>
              {distanceToGrave < 1000 
                ? `${distanceToGrave.toFixed(0)}m away` 
                : `${(distanceToGrave/1000).toFixed(2)}km away`}
            </Text>
          )}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${navigationProgress}%` }]} />
          </View>
          <TouchableOpacity style={styles.stopButton} onPress={stopNavigation}>
            <Text style={styles.stopButtonText}>Stop Navigation</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Map */}
      {region ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={isNavigating}
        >
          {/* Grave Location Marker */}
          <Marker 
            coordinate={graveLocation} 
            title={`${grave?.firstName} ${grave?.lastName}`}
            description={`${grave?.phase}, Block ${grave?.block}, Apartment ${grave?.aptNo}`}
          >
            <Text style={styles.graveMarker}>🪦</Text>
          </Marker>

          {/* User Location Marker */}
          {userLocation && (
            <Marker coordinate={userLocation} title="You are here">
              <Text style={styles.userMarker}>📍</Text>
            </Marker>
          )}

          {/* Cemetery Boundary */}
          <Polygon
            coordinates={cemeteryBoundary}
            strokeColor="rgba(0, 150, 0, 0.8)"
            fillColor="rgba(0, 150, 0, 0.1)"
            strokeWidth={2}
          />

          {/* Internal Cemetery Paths (when inside cemetery) */}
          {isInsideCemetery && cemeteryPaths.map((path, index) => (
            <Polyline
              key={index}
              coordinates={path}
              strokeColor="#FF6B6B"
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          ))}

          {/* External Route Directions */}
          {userLocation && !isInsideCemetery && (
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

          {/* Cemetery Map Overlay */}
          <Overlay
            image={require('../assets/Map.png')}
            bounds={[
              [14.470560, 120.975015],
              [14.473053, 120.977249],
            ]}
          />

        </MapView>
      ) : loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text>Starting navigation to grave...</Text>
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
        
        {/* Navigation Info */}
        {isNavigating ? (
          <View style={styles.navigationInfo}>
            <Text style={styles.navigationInfoText}>
              🧭 Navigation Active | Progress: {navigationProgress.toFixed(0)}%
            </Text>
            {estimatedArrival && (
              <Text style={styles.navigationInfoText}>
                ⏱️ Est. arrival: {estimatedArrival} minutes
              </Text>
            )}
          </View>
        ) : distance && duration && (
          <Text style={styles.pathInfo}>
            Distance: {distance.toFixed(2)} km | Time: {Math.ceil(duration)} min walk
          </Text>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!isNavigating ? (
            <TouchableOpacity 
              onPress={() => startAutoNavigation(userLocation)} 
              style={styles.navigateButton}
            >
              <Text style={styles.navigateButtonText}>🧭 Start Smart Navigation</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={stopNavigation} style={styles.stopNavigationButton}>
              <Text style={styles.stopNavigationButtonText}>⏹️ Stop Navigation</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleNavigate} style={styles.externalNavButton}>
            <Text style={styles.externalNavButtonText}>📱 External Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: width,
    height: height,
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
  navigationStatus: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(25, 118, 210, 0.95)',
    borderRadius: 15,
    padding: 15,
    zIndex: 10,
    elevation: 8,
  },
  navigationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  navigationInstruction: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  navigationDistance: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
  },
  progressBar: {
    backgroundColor: '#4CAF50',
    height: 6,
    borderRadius: 3,
  },
  stopButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  graveMarker: {
    fontSize: 30,
  },
  userMarker: {
    fontSize: 25,
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
  navigationInfo: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  navigationInfoText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 15,
    gap: 10,
  },
  navigateButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  stopNavigationButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopNavigationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  externalNavButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  externalNavButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
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
});

export default Map;