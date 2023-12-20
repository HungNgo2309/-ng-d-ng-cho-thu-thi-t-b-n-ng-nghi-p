import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import RentDetail from './RentDetail';
import BuyDetail from './BuyDetail';
import CustomerScreen from './CustomerScreen';
const Stack = createStackNavigator();
const StackComfirm = () => {
  return (
    <Stack.Navigator initialRouteName='Comfirm' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Comfirm" component={CustomerScreen} />
      <Stack.Screen name="RentDetail" component={RentDetail}/>
      <Stack.Screen name="BuyDetail" component={BuyDetail}/>
    </Stack.Navigator>


  );
}


export default StackComfirm;
