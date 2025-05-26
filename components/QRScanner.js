import React, { useRef, useEffect } from "react";
import { AppState, Text, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Pressable, View, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width, height } = Dimensions.get('window');
const BOX_SIZE = 250;
const BOX_TOP = (height - BOX_SIZE) / 1.738; // Adjusted to center the box vertically
const BOX_LEFT = (width - BOX_SIZE) / 2;

export default function QRScanner() {
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (!permission || !permission.granted) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={{ color: "white", marginBottom: 16 }}>Camera permission is required to scan QR codes.</Text>
                <Pressable onPress={requestPermission} style={styles.button}>
                    <Text style={{ color: "white" }}>Grant Permission</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarCodeScanned={({ data }) => {
                    if (data && !qrLock.current) {
                        qrLock.current = true;
                        setTimeout(async () => {
                            await Linking.openURL(data);
                        }, 500);
                    }
                }}
            />
            {/* Overlay square box */}
            <View style={styles.overlayContainer} pointerEvents="none">
                {/* Top overlay */}
                <View style={styles.overlayTop} />
                {/* Left overlay */}
                <View style={styles.overlayLeft} />
                {/* The scanning box */}
                <View style={styles.overlayBox} />
                {/* Right overlay */}
                <View style={styles.overlayRight} />
                {/* Bottom overlay */}
                <View style={styles.overlayBottom} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: "#333",
        padding: 12,
        borderRadius: 8
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 2,
    },
    overlayTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: BOX_TOP,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 1,
    },
    overlayBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: BOX_TOP,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 1,
    },
    overlayLeft: {
        position: 'absolute',
        top: BOX_TOP,
        left: 0,
        width: BOX_LEFT,
        height: BOX_SIZE,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 1,
    },
    overlayRight: {
        position: 'absolute',
        top: BOX_TOP,
        right: 0,
        width: BOX_LEFT,
        height: BOX_SIZE,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 1,
    },
});