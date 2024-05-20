import React from 'react';
import { View, Text, Button, StyleSheet, Platform, BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Receipt Scanner App</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Scan Receipt"
          onPress={() => navigation.navigate('Camera')}
          color="#1e90ff"
        />
        <Button
          title="Exit"
          onPress={() => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            }
          }}
          color="#ff6347"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'space-around',
  }
});

export default HomeScreen;
