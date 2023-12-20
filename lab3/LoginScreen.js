import React, { useEffect, useState,useContext } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import {AuthenticatedUserContext} from './AuthenticatedUserProvider';

const LoginScreen=()=>{
    const navigation = useNavigation();
    const[email,setEmail]= useState('');
    const[password,setPassword]= useState('');
    const[hidepass,sethidepass]=useState(true)
    const hasErrors = () => {
        return !email.includes('@');
      };
    const handleLogin = () => {
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(({ user }) => {
            console.log(user);
          })
          .catch((error) => {
            console.error(error);
          });
      };
    const hasPassErrors = () => {
        return password.trim() === "";
      };
    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}
        enableOnAndroid={true}>
        <View style={{flex:1}}>
                <Image source={require('../img/label.jpg')} style={styles.logo} />
                <Text style={{fontWeight:'bold',fontSize:28, textAlign:'center'}}>Đăng nhập</Text>
            
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
                <HelperText type="error" visible={hasPassErrors()}>
                    Vui lòng nhập mật khẩu !
                </HelperText>
                <Button style={styles.login} onPress={()=>handleLogin()}>
                    Login
                </Button>
                <Button style={{color:'blue'}} onPress={() => navigation.navigate('Signup')}>
                    Create a new account?
                </Button>
                <Button style={{color:'blue'}} onPress={() =>navigation.navigate('Reset')}>
                    Forgot Password
                </Button>
        </View>
        </KeyboardAwareScrollView>
    )
}
export default LoginScreen;

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