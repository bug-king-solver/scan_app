import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Preview: { photo: string | undefined };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Receipt Scanner' }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Scan Receipt' }} />
        <Stack.Screen name="Preview" component={PreviewScreen} options={{ title: 'Preview Receipt' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
