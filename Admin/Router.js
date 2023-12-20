import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Service from './Service';
import DetailService from './DetailsService';
import EditService from './EditService';
import RentDetail from './Comfirm/RentDetail';
import BuyDetail from './Comfirm/BuyDetail';
import AddProductScreen from './AddService';
const Stack = createStackNavigator();
const Router = () => {
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Service" component={Service} />
      <Stack.Screen name="AddService" component={AddProductScreen} />
      <Stack.Screen name="DetailsService" component={DetailService} />
      <Stack.Screen name="EditService" component={EditService} />
    </Stack.Navigator>


  );
}

const styles = StyleSheet.create({})

export default Router;
