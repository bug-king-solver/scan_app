import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Button } from 'react-native';
import { useCameraPermissions , CameraView, Camera } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { MaterialIcons } from '@expo/vector-icons';

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
            const photo = await cameraRef.current.takePictureAsync();
            navigation.navigate('Preview', { photo: photo?.uri });
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
                <View style={styles.cornerContainer}>
                    <View style={styles.cornerTopLeft}/>
                    <View style={styles.cornerTopRight}/>
                    <View style={styles.cornerBottomLeft}/>
                    <View style={styles.cornerBottomRight}/>
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
    cornerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    cornerTopLeft: {
        position: 'absolute',
        left: 10,
        top: 10,
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'white',
        borderTopLeftRadius: 5,
    },
    cornerTopRight: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'white',
        borderTopRightRadius: 5,
    },
    cornerBottomLeft: {
        position: 'absolute',
        left: 10,
        bottom: 10,
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'white',
        borderBottomLeftRadius: 5,
    },
    cornerBottomRight: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'white',
        borderBottomRightRadius: 5,
    },
});

export default CameraScreen;