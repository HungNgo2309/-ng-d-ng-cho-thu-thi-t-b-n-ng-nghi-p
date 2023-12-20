import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfitScreen from './ProfitScreen';
import CustomerScreen from './Comfirm/CustomerScreen';
import Router from './Router';
import StackComfirm from './Comfirm/StackComfirm';
import Setting from './Setting';
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
    >
      <Tab.Screen
        name="Router"
        component={Router}
        options={{
          tabBarIcon: getTabBarIcon('house'),
        }}
      />
      <Tab.Screen
        name="Profit"
        component={ProfitScreen}
        options={{
          tabBarIcon: getTabBarIcon('attach-money'),
        }}
      />
      <Tab.Screen
        name="Customer"
        component={StackComfirm}
        options={{
          tabBarIcon: getTabBarIcon('supervised-user-circle'),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: getTabBarIcon('settings'),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
