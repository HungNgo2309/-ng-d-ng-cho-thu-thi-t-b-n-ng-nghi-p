import React, { useContext, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import  {AuthenticatedUserContext}  from '../providers';
import auth from '@react-native-firebase/auth';

const ProfileHome=({navigation})=>{
    const Profile = firestore().collection('Profile');
    const { user } = useContext(AuthenticatedUserContext);
    const[welcome,setWelcome]=useState(user.email);
    useEffect(() => {
        const fetchProfile = async () => {
                const profileSnapshot = await Profile.doc(user.uid).get();
                if (profileSnapshot.exists) {
                    const data = profileSnapshot.data();
                    setWelcome(data.username )
                }
            }
        fetchProfile();
    }, [Math.random()]);
    const handleLogout = () => {
        auth().signOut().catch(error => console.log('Error logging out: ', error));
        };
    return(
        <View>
            <View style={{flexDirection:'row',alignItems: 'center', justifyContent: 'space-between'}}>
                
                <View style={{marginLeft:20}}>
                    <Text style={{alignSelf:'center',fontSize:30,fontWeight:'bold'}}>Chào khách hàng</Text>
                    <Text>{welcome}</Text>
                </View>
                <Image style={{width:200,height:200}} source={require('../img/label.jpg')} />
            </View>
            <View style={{marginLeft:10,backgroundColor:'white',paddingLeft:20}}>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.navigate("Profile")}>
                    <IconButton icon="account-cog"/>
                    <Text>Thông tin khách hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}>
                    <IconButton icon="file-document-edit-outline"/>
                    <Text>Điều khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}>
                    <IconButton icon="chat-question"/>
                    <Text>Trợ giúp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={handleLogout}>
                     <IconButton icon="logout"/>
                    <Text>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default ProfileHome;