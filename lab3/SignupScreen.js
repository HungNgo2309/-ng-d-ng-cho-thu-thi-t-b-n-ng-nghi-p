import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

const SignupScreen=()=>{
    const navigation = useNavigation();
    const[email,setEmail]= useState('');
    const[password,setPassword]= useState('');
    const[enterpassword,setenterPassword]= useState('');
    const[hidepass,sethidepass]=useState(true)
    const[hide_enter_pass,set_enter_hidepass]=useState(true)
    const[hidebutton,sethidebutton]=useState(true)
   
    database().ref('/users').push({
        userId: 'hungnnvh@gmail.com',
        userType: 'user',
      });
    const hasErrors = () => {
        return !email.includes('@');
      };
      const handleSignup = async () => {
        try {
          const userCredential = await auth().createUserWithEmailAndPassword(email, password);
          const uid = userCredential.user.uid; // Lấy uid từ userCredential
      
          const Profile = firestore().collection('Profile');
          Profile.doc(uid).set({
            username: "",
            phone: "",
            address: "",
            password: password,
            role: "customer"
          });
          database().ref('/users').push({
            userId: email,
            userType: 'user',
          });
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
      
          console.error(error);
        }
      };
      
    const checkSign=()=>{
        if(password===enterpassword)
        {
            handleSignup();
            navigation.navigate('Login')
        }else{
            console.log('Enter Password invalid!');
        }
    }
    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}
        enableOnAndroid={true}>
        <View style={{flex:1}}>
                <Image source={require('../img/label.jpg')} style={styles.logo} />
                <Text style={{fontWeight:'bold',fontSize:28, textAlign:'center'}}>Craete a new account!</Text>
            
                <TextInput
                    placeholder='Enter Your Email'
                    style={styles.ti}
                    value={email}
                    onChangeText={setEmail}
                    left={<TextInput.Icon icon="email" />}
                />
                <HelperText type="error" visible={hasErrors()}>
                    Địa chỉ Email không hợp lệ !
                </HelperText>
                <TextInput
                    placeholder='Enter Password'
                    style={styles.ti}
                    secureTextEntry={hidepass}
                    value={password}
                    onChangeText={setPassword}
                    left={<TextInput.Icon icon="key" />}
                    right={<TextInput.Icon icon="eye" onPress={()=>sethidepass(!hidepass)}/>}
                />
                <TextInput
                    placeholder='Confirm Password'
                    style={styles.ti}
                    secureTextEntry={hide_enter_pass}
                    value={enterpassword}
                    onChangeText={setenterPassword}
                    left={<TextInput.Icon icon="key"/>}
                    right={<TextInput.Icon icon="eye" onPress={()=>set_enter_hidepass(!hide_enter_pass)}/>}
                />
                <Button style={styles.login} onPress={()=>checkSign()} >
                    Signup
                </Button>
                <Button style={{color:'blue'}} onPress={()=>navigation.navigate('Login')}>
                    Already have an account?
                </Button>
        </View>
        </KeyboardAwareScrollView>
    )
}
export default SignupScreen;

const styles = StyleSheet.create(
    {
        logo:{
            maxHeight:250,
            maxWidth:250,
            justifyContent:'center',
            alignSelf:'center',
        },
        ti:{
            marginTop:20,
            marginLeft:20,
            marginRight:20,
        },
        login:{
            backgroundColor:'yellow',
            margin: 20,
            color:'white'
        }
    }
)