
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import  {AuthenticatedUserContext}  from '../providers';
import { IconButton } from 'react-native-paper';

const UserChat = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const[userId,setUserID]=useState(user.email);
  const [userType,setType]=useState('user');
  const sendMessage = () => {
    database().ref('/messages').push({
      text: newMessage,
      userId:user.email,
      userType:'user',
      timestamp: database.ServerValue.TIMESTAMP,
    });

    setNewMessage('');
  };

  useEffect(() => {
    const messagesRef = database().ref('/messages');
    messagesRef.on('value', (snapshot) => {
      const messageList = [];
      snapshot.forEach((child) => {
        const message = child.val();
        if ((message.userType === 'admin'&&message.userId===userId)||message.userId===userId) {
          messageList.push({
            id: child.key,
            text: message.text,
            userId: message.userId,
            userType: message.userType,
            timestamp: message.timestamp,
          });
        }
      });
      setMessages(messageList);
    });

    return () => messagesRef.off('value');
  }, [userType, userId]);

  return (
    <View style={{flex:1}}>
            <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: item.userType === 'user' ? 'flex-end' : 'flex-start' }}>
            <View style={{ backgroundColor: item.userType === 'user' ? 'lightgreen' : 'lightblue', padding: 10, borderRadius: 5, margin: 5 }}>
                <Text>{item.text}</Text>
                <Text style={{ fontSize: 10, textAlign: 'right' }}>
                {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
            </View>
            </View>
        )}
        />
        <View style={{height:100}}>

        </View>
        <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignItems: 'center', justifyContent: 'space-between',flex:1}}>
                <TextInput
                    style={{flex:8}}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <IconButton style={{flex:2}} iconColor='blue' icon='send' onPress={sendMessage} />
        </View>
        </View>
  );
};

export default UserChat;
