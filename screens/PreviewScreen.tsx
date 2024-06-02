import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import { jsPDF } from 'jspdf';
import * as MediaLibrary from 'expo-media-library';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PreviewScreenProps = {
    route: RouteProp<RootStackParamList, 'Preview'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'Preview'>;
};

const PreviewScreen: React.FC<PreviewScreenProps> = ({ route, navigation }) => {
    const { photo } = route.params;
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const loadEmail = async () => {
            const savedEmail = await AsyncStorage.getItem('savedEmail');
            if (savedEmail) {
                setEmail(savedEmail);
            }
        };

        loadEmail();
    }, []);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const sendEmail = async () => {
        if (!photo) {
            Alert.alert('Error', 'No photo available to send.');
            return;
        }
        if (!email.trim()) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }

        const completeEmail = `${email.trim()}@wickedfile.email`;
        if (!validateEmail(completeEmail)) {
            Alert.alert("Error", "Please enter valid email formats.");
            return;
        }

        const available = await MailComposer.isAvailableAsync();
        if (!available) {
            Alert.alert("Error", "Mail services are not available");
            return;
        }

        try {
            const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
            const imageData = `data:image/jpeg;base64,${base64}`;
            const pdf = new jsPDF();
            pdf.addImage(imageData, 'JPEG', 10, 10, 180, 160);

            const pdfBase64 = pdf.output('datauristring').split(',')[1];
            const uri = FileSystem.cacheDirectory + 'temp_receipt.pdf';
            await FileSystem.writeAsStringAsync(uri, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });

            const emailResponse = await MailComposer.composeAsync({
                recipients: [completeEmail],
                subject: 'A copy of receipt!',
                body: 'Here is the pdf file you requested.',
                attachments: [uri]
            });

            if (emailResponse.status === 'sent') {
                Alert.alert('Success', 'Email sent successfully!');
                await AsyncStorage.setItem('savedEmail', email);
            } else {
                Alert.alert('Error', 'Email was not sent.');
            }

            // Optionally delete the temporary file
            await FileSystem.deleteAsync(uri);
        } catch (error) {
            console.error('Failed to send email:', error);
            Alert.alert('Error', 'Failed to send email. Please check the email address and try again.');
        }
        
        setEmail('');
        setModalVisible(false);
    };

    const downloadPdf = async () => {
        if (!photo) {
            Alert.alert('Error', 'No photo available to download as PDF.');
            return;
        }

        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Cannot save file without storage permissions');
                return;
            }

            const timestamp = new Date().getTime();

            const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
            const imageData = `data:image/jpeg;base64,${base64}`;
            const pdf = new jsPDF();
            pdf.addImage(imageData, 'JPEG', 10, 10, 180, 160);

            const pdfOutput = pdf.output('datauristring').split(',')[1];
            const uri = FileSystem.documentDirectory + `receipt_${timestamp}.pdf`;
            await FileSystem.writeAsStringAsync(uri, pdfOutput, { encoding: FileSystem.EncodingType.Base64 });

            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('Download', asset, false);
            Alert.alert('PDF Downloaded', 'PDF saved to your media library');
        } catch (error) {
            console.error('Failed to save PDF:', error);
            Alert.alert('Error', 'Failed to save PDF. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: photo }} style={styles.image} resizeMode="contain" />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.text}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.text}>Upload</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setEmail}
                                value={email}
                                placeholder="@wickedfile.email"
                                keyboardType="email-address"
                            />
                            <View style={{ flexDirection: 'column', gap: 15, width: '100%' }}>
                                <Button title="Send Email" onPress={sendEmail} />
                                <Button title="Cancel" onPress={() => setModalVisible(false)} color="#ff6347" />
                            </View>
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity style={styles.button} onPress={downloadPdf}>
                    <Text style={styles.text}>Download</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        padding: 10,
        backgroundColor: '#1e90ff',
        borderRadius: 5,
    },
    text: {
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        width: 200,
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
    }
});

export default PreviewScreen;
