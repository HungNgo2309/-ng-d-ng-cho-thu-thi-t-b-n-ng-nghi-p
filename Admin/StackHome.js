import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Service from './AdminHome';
import DetailService from './DetailsService';
import EditService from './EditProduct';
import RentDetail from './Comfirm/RentDetail';
import BuyDetail from './Comfirm/BuyDetail';
import AddProductScreen from './AddProduct';
import Category from './Category';
const Stack = createStackNavigator();
const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Service" component={Service} />
      <Stack.Screen name="AddService" component={AddProductScreen} />
      <Stack.Screen name="DetailsService" component={DetailService} />
      <Stack.Screen name="EditService" component={EditService} />
      <Stack.Screen name="Category" component={Category}/>
    </Stack.Navigator>


  );
}

const styles = StyleSheet.create({})

export default Router;
