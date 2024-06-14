import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Button, Alert } from 'react-native';
import { useCameraPermissions , CameraView, Camera } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';

type CameraScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Camera'>;
};

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
    const [permission, setPermission] = useState<boolean | null>(null);
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
        })();
    }, []);

    if (permission === null) {
        return <View />;
      }
    
      if (permission === false) {
        return (
          <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
            <Button onPress={() => Camera.requestCameraPermissionsAsync().then(({ status }) => setPermission(status === 'granted'))} title="Grant permission" />
          </View>
        );
      }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
            if (photo) {
                const manipulatedImage = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ resize: { width: photo.width * 0.75, height: photo.height * 0.75 } }], // Optional resize
                    { compress: 0.5 } // Further compression
                );
                navigation.navigate('Preview', { photo: manipulatedImage?.uri });
            } else {
                Alert.alert('Failed to capture photo');
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CameraView style={styles.camera} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <MaterialIcons name="camera" size={28} color="white" />
                        <Text style={styles.buttonText}>Capture</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 30,
        padding: 10,
        flexDirection: 'row',
    },
    buttonText: {
        marginLeft: 10,
        fontSize: 18,
        color: 'white',
    },
});

export default CameraScreen;