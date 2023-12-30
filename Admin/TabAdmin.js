import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProfitScreen from './ProfitScreen';
import CustomerScreen from './Comfirm/CustomerScreen';
import Router from './StackHome';
import StackComfirm from './Comfirm/StackComfirm';
import Setting from './Setting';
import StackChatAdmin from '../Chat/StackChatAdmin';
const Tab = createBottomTabNavigator();


const getTabBarIcon = icon => ({ tintColor }) => (
  <Icon name={icon} size={26} style={{ color: "black" }} />
);

const MyTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName='Router'
      barStyle={{ backgroundColor: "red" }}
      labeled={false}
      activeTintColor={{ color: "red" }}
      inactiveColor={{ color: "red" }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Router"
        component={Router}
        options={{
          tabBarIcon: getTabBarIcon('home'),
        }}
      />
      <Tab.Screen
        name="Profit"
        component={ProfitScreen}
        options={{
          tabBarIcon: getTabBarIcon('hand-holding-usd'),
        }}
      />
      <Tab.Screen
        name="ConfirmOrder"
        component={StackComfirm}
        options={{
          tabBarIcon: getTabBarIcon('file-signature'),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={StackChatAdmin}
        options={{
          tabBarIcon: getTabBarIcon('cog'),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
