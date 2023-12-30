// components/AdminChat.js
import React, { useState, useEffect, useId } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { IconButton } from 'react-native-paper';

const AdminChat = () => {
  const { params } = useRoute();
  const { userId, userType } = params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading,setLoading]=useState(true);
    
  const sendMessage = () => {
    database().ref('/messages').push({
      text: newMessage,
      userId:userId,
      userType:"admin",
      to:userId,
      timestamp: database.ServerValue.TIMESTAMP,
    });
    setNewMessage('');
    setLoading(!loading)
  };

  useEffect(() => {
    const messagesRef = database().ref('/messages');
    messagesRef.on('value', (snapshot) => {
      const messageList = [];
      snapshot.forEach((child) => {
        const message = child.val();
        if (message.userId === userId||message.to===userId) {
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
  }, [userId,loading]);
  return (
    <View style={{flex:1}}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: item.userType === 'user' ? 'flex-start' : 'flex-end' }}>
            <View style={{ backgroundColor: item.userType === 'user' ? 'lightblue' : 'lightgreen', padding: 10, borderRadius: 5, margin: 5 }}>
                <Text>{item.text}</Text>
                <Text style={{ fontSize: 10, textAlign: 'right' }}>
                {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
            </View>
            </View>
        )}
        />
        <View style={{height:70}}>

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

export default AdminChat;
