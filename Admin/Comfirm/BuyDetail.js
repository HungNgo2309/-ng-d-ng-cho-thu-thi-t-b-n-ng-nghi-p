import React, { useEffect, useState } from "react";
import {  Alert, Image, View } from "react-native";
import { Text,Button, TextInput, IconButton } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const BuyDetail=({route,navigation})=>{
    const {name,price,img,quantity,id } = route.params;
    const[user,setUser]=useState([]);
    const[total,setTotal]=useState(0);
    const[username,setUsername]=useState("");
    const[address,setAddress]=useState("");
    const[phone,setPhone]=useState("")
    
    console.log(id);
    useEffect(()=>{
        const fetchData = async () => {
            const Rent = await firestore().collection('Buy');
            const profileSnapshot =  await Rent.doc(id).get();
            if (await profileSnapshot.exists) {
                   // Nếu tài liệu tồn tại, cập nhật state với dữ liệu từ tài liệu
                   const data = profileSnapshot.data();
                   console.log(data);
                        setUsername(data.username),
                        setPhone(data.phone),
                        setAddress(data.address)
            }
        }
        fetchData();
        },[])
    function Remove()
    {
        const Rent =  firestore().collection('Buy');
        Rent.doc(id).delete();
        Alert.alert("Xóa thành công");
        navigation.goBack();
    }
    return(
        <View style={{flex:1,backgroundColor:'#ffd9b3'}}>
            <IconButton style={{alignSelf:'flex-start',position:'absolute'}} icon="keyboard-backspace"  onPress={()=>navigation.goBack()}/>
            <Text style={{alignSelf:'center',fontSize:30}}>Chi tiết mua</Text>
            <View style={{flexDirection:'row'}}>
                    <Image style={{height:150,width:150}} source={{uri:img}} />
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:25,alignContent:'center'}}>{name}</Text>
                        <Text style={{textAlign:'center',color:'red'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</Text>
                    </View>
                    
            </View>
            <View style={{marginLeft:10,marginTop:20}}>
                 <Text style={{fontSize:20}} >Tên khách hàng : {username}</Text>
                <Text style={{fontSize:20}} >Địa chỉ: {address}</Text>
                <Text style={{fontSize:20}} >Số điện thoại : {phone}</Text>
                <Text style={{fontSize:20}}>Số lượng : {quantity}</Text>
            </View> 
            <Button style={{position:'absolute',bottom:0,alignSelf:'center',backgroundColor:"#47d147"}} labelStyle={{fontSize:20,color:"white"}} onPress={()=>Remove()}>Xóa</Button>          
        </View>
    ) 
}
export default BuyDetail;