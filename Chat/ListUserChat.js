// components/AdminChatList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { Icon } from 'react-native-paper';
import Fontf from 'react-native-vector-icons/FontAwesome5';

const AdminChatList = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const usersRef = database().ref('/users');
    usersRef.on('value', (snapshot) => {
      const userList = [];
      snapshot.forEach((child) => {
        const user = child.val();
        if(user.userType==='user')
        {
            userList.push({
                id: child.key,
                userId: user.userId,
                userType: user.userType,
              });
        }
      });
      setUsers(userList);
    });

    return () => usersRef.off('value');
  }, []);

  const startChat = (userId, userType) => {
    navigation.navigate('AdminChat', { userId, userType });
  };

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{backgroundColor:'white',margin:5,height:70,flexDirection:'row'}} onPress={() => startChat(item.userId, item.userType)}>
            <Fontf name='envelope' style={{alignSelf:'center',marginRight:10}} size={20}/>
            <Text style={{fontSize:20,alignSelf:'center'}}>{item.userId}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AdminChatList;
