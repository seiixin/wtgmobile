import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const WebViewMap = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { grave } = route.params || {};
  const webViewRef = useRef(null);

  const CEMETERY_MAP_URL = 'https://maps-roan-tau.vercel.app';

  useEffect(() => {
    // Auto-navigate to grave location when WebView loads
    if (grave && webViewRef.current) {
      const graveData = {
        name: `${grave.firstName} ${grave.lastName}`,
        block: grave.block || 'Unknown Block',
        apartment: grave.aptNo || 'Unknown Apartment',
        phase: grave.phase || 'Unknown Phase',
        latitude: grave.latitude || 14.471161,
        longitude: grave.longitude || 120.975398,
        autoStart: true // Flag to indicate automatic navigation
      };

      // Send message to WebView after a delay to ensure it's loaded
      setTimeout(() => {
        const message = JSON.stringify({
          type: 'AUTO_START_NAVIGATION',
          data: graveData
        });
        webViewRef.current?.postMessage(message);
      }, 2000);
    }
  }, [grave]);

  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      switch (message.type) {
        case 'MAP_READY':
          console.log('Cemetery map is ready');
          break;
          
        case 'LOCATION_UPDATE':
          console.log('Location updated:', message.data);
          break;
          
        case 'NAVIGATION_UPDATE':
          console.log('Navigation update:', message.data);
          break;
          
        case 'ROUTE_CALCULATED':
          console.log('Route calculated:', message.data);
          Alert.alert(
            'Route Calculated',
            `Distance: ${(message.data.distance / 1000).toFixed(2)} km\nEstimated time: ${Math.round(message.data.estimatedTime / 60)} minutes`
          );
          break;
          
        case 'ERROR':
          console.error('Cemetery map error:', message.data.message);
          Alert.alert('Map Error', message.data.message);
          break;
          
        case 'SUCCESS_MESSAGE':
          console.log('Cemetery map success:', message.data.message);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const sendMessageToWebView = (type, data = {}) => {
    if (webViewRef.current) {
      const message = JSON.stringify({ type, data });
      webViewRef.current.postMessage(message);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {/* Header with Back Button and Title */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1976D2" />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <Text style={styles.titleText}>Navigate to Grave</Text>
            <Text style={styles.subtitleText}>
              {grave?.firstName} {grave?.lastName}
            </Text>
          </View>
        </View>

        {/* Cemetery Map WebView */}
        <WebView
          ref={webViewRef}
          source={{ uri: CEMETERY_MAP_URL }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          allowsInlineMediaPlaybook={true}
          mixedContentMode="compatibility"
          originWhitelist={['*']}
          startInLoadingState={true}
          scalesPageToFit={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onLoadStart={() => console.log('WebView load started')}
          onLoadEnd={() => {
            console.log('WebView load ended');
            // Auto-send grave data when map loads
            if (grave) {
              setTimeout(() => {
                const graveData = {
                  name: `${grave.firstName} ${grave.lastName}`,
                  block: grave.block || 'Unknown Block', 
                  apartment: grave.aptNo || 'Unknown Apartment',
                  phase: grave.phase || 'Unknown Phase',
                  latitude: grave.latitude || 14.471161,
                  longitude: grave.longitude || 120.975398,
                  autoStart: true
                };
                sendMessageToWebView('AUTO_START_NAVIGATION', graveData);
              }, 1000);
            }
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            Alert.alert(
              'Cemetery Map Error',
              'Could not load the cemetery navigation map. Please check your internet connection.',
              [
                { text: 'Retry', onPress: () => webViewRef.current?.reload() },
                { text: 'Go Back', onPress: () => navigation.goBack() }
              ]
            );
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error:', nativeEvent);
            Alert.alert(
              'Cemetery Map Unavailable',
              `Failed to load cemetery map (Error ${nativeEvent.statusCode}). The cemetery navigation service may be temporarily unavailable.`,
              [
                { text: 'Retry', onPress: () => webViewRef.current?.reload() },
                { text: 'Go Back', onPress: () => navigation.goBack() }
              ]
            );
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading cemetery map...</Text>
            </View>
          )}
        />

        {/* Bottom Info Card */}
        <View style={styles.bottomCard}>
          <View style={styles.graveInfo}>
            <Text style={styles.graveName}>
              {grave?.firstName} {grave?.lastName}
              {grave?.nickname ? ` '${grave?.nickname}'` : ''}
            </Text>
            <Text style={styles.graveLocation}>
              {grave?.phase ? `Phase ${grave?.phase} | ` : ''}
              {grave?.block ? `Block ${grave?.block} | ` : ''}
              {grave?.aptNo ? `Apartment ${grave?.aptNo}` : ''}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.centerButton}
            onPress={() => sendMessageToWebView('FLY_TO_LOCATION', {
              lat: grave?.latitude || 14.471161,
              lng: grave?.longitude || 120.975398,
              zoom: 18
            })}
          >
            <Ionicons name="locate" size={20} color="#fff" />
            <Text style={styles.centerButtonText}>Center on Grave</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  bottomCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  graveInfo: {
    flex: 1,
  },
  graveName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  graveLocation: {
    fontSize: 14,
    color: '#666',
  },
  centerButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default WebViewMap;
