// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from '../Admin/Setting';
import AdminChat from './AdminChat';
import AdminChatList from './ListUserChat';

const Stack = createNativeStackNavigator();

const StackChatAdmin = () => {
  return (
      <Stack.Navigator initialRouteName="Setting" >
        <Stack.Screen name='Setting' component={Setting} />
        <Stack.Screen name="AdminChatList" component={AdminChatList} />
        <Stack.Screen name="AdminChat" component={AdminChat} />
      </Stack.Navigator>
  );
};

export default StackChatAdmin;
