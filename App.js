/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import HomeScreen from './Screens/Home';
import ProductDetail from './Screens/ProductDetail';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserProvider } from './providers';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './lab3/RootNavigator';
const Stack = createStackNavigator();
function App() {
  
  return (
    <AuthenticatedUserProvider>
    <SafeAreaProvider>
       <RootNavigator/>
    </SafeAreaProvider>
  </AuthenticatedUserProvider>
  );
}


export default App;
