import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const QRScanner = () => {
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  const handleScan = ({ data, type }) => {
    if (!scanned) {
      setScanned(true);
      let url = data;
      if (typeof data === "string" && !data.startsWith("http://") && !data.startsWith("https://") && data.includes(".")) {
        url = "https://" + data;
      }
      if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
        Linking.openURL(url).catch(err => {
          Alert.alert("Error", "Could not open URL: " + err.message);
        });
      } else {
        Alert.alert("Scanned Data", `${data}`);
      }
      setTimeout(() => setScanned(false), 3000);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  };

  if (!permission || permission.status !== "granted") {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={RFValue(28, height)} color="white" />
        </TouchableOpacity>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={RFValue(48, height)} color="#2E8B57" style={{ marginBottom: 10 }} />
          <Text style={styles.permissionModalTitle}>Camera Permission Needed</Text>
          <Text style={styles.permissionModalText}>
            Please grant camera access from your device settings to scan QR codes.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={RFValue(28, height)} color="white" />
      </TouchableOpacity>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128"]
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />
      {/* Centered square overlay */}
      <View pointerEvents="none" style={styles.squareOverlay}>
        <View style={styles.square} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.buttonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { textAlign: "center", marginTop: hp('2%') },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: hp('4%'),
    alignSelf: "center"
  },
  button: {
    backgroundColor: "black",
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2.5%'),
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(16, height),
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  squareOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: wp('65%'),
    height: wp('65%'),
    borderWidth: 2,
    borderColor: "white",
    borderRadius: wp('3%'),
    backgroundColor: "transparent",
  },
  backButton: {
    position: 'absolute',
    top: hp('5%'),
    left: wp('6%'),
    backgroundColor: 'rgba(252, 189, 33, 0.95)',
    padding: wp('2.5%'),
    borderRadius: wp('12%'),
    zIndex: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp('10%'),
  },
  permissionModalTitle: {
    fontSize: RFValue(18, height),
    fontWeight: "bold",
    marginBottom: hp('1%'),
    textAlign: "center",
  },
  permissionModalText: {
    fontSize: RFValue(14, height),
    marginBottom: hp('2%'),
    textAlign: "center",
    color: "#333",
  },
});

export default QRScanner;



















