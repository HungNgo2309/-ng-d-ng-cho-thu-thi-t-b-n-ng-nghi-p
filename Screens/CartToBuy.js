import React, { useContext, useEffect, useState } from "react";
import {  Alert, FlatList, Image, View } from "react-native";
import { Text,Button, TextInput, IconButton } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { AuthenticatedUserContext } from "../providers";

const CartToBuy=({route,navigation})=>{
    const{data}=route.params;
    const[data2,setData2]=useState([]);
    const { user } = useContext(AuthenticatedUserContext);
    const[username,setUsername]=useState("");
    const[address,setAddress]=useState("");
    const[phone,setPhone]=useState("")
    const Profile = firestore().collection('Profile');
    async function AddBuy() {
        try {
            setData2(data);
            const Rent = await firestore().collection('Buy');
                data2.forEach(d=>{
                    
                    Rent.add({
                        username:username,
                        phone:phone,
                        address:address,
                        id_user: user.uid,
                        id_product: d.productData.id,
                        quantity: d.quantity,
                        state:false,
                    })
                    const Cart =  firestore().collection('Cart');
                    Cart.doc(d.id).delete();
                }
                )
                Alert.alert("Đặt hàng thành công")                    
        } catch (error) {
            console.error("Lỗi khi thêm dữ liệu mua:", error);
        }
    }
    useEffect(()=>{
        const fetchProfile = async () => {
            try {
                    const profileSnapshot = await Profile.doc(user.uid).get();
                    if (profileSnapshot.exists) {
                        // Nếu tài liệu tồn tại, cập nhật state với dữ liệu từ tài liệu
                        const data = profileSnapshot.data();
                        setUsername(data.username);
                        setAddress(data.address);
                        setPhone(data.phone);
                
            }
            } catch (error) {
                console.error("Lỗi khi truy cập thông tin hồ sơ:", error);
            }
        };
        fetchProfile();  
    },[ ]);
    const renderItem=({item})=>{
        return(
            <View style={{flexDirection:'row'}}>
                    <Image style={{height:150,width:150}} source={{uri:item.productData.img}} />
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:25,alignContent:'center'}}>{item.productData.name}</Text>
                        <Text style={{textAlign:'center',color:'red'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productData.price)}</Text>
                        <Text>số lượng{item.quantity}</Text>
                    </View>
                    
            </View>
        )
    }
    const total = data.reduce((accumulator, item) => {
        if(item.checked)
        {
            return accumulator + item.productData.price * item.quantity;
        }
        else return accumulator
      }, 0);
    return(
        <View style={{flex:1,backgroundColor:'#ffd9b3'}}>
            <View>
                <FlatList
                data={data}
                renderItem={renderItem}
                />
            </View>            
            <View style={{margin:10}}>
                 <TextInput style={{fontSize:20}} mode="outlined" value={username} onChangeText={setUsername} label="Tên khách hàng" />
                <TextInput style={{fontSize:20}}  mode="outlined" value={address} onChangeText={setAddress} label="Địa chỉ"/>
                <TextInput style={{fontSize:20}}  mode="outlined" value={phone} onChangeText={setPhone} label="Số điện thoại"/>
            </View> 
            <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignItems: 'center', justifyContent: 'space-between',flex:1}}>
                <Text style={{fontSize:22,fontWeight:'bold',flex:2}}>Tổng tiền: </Text>
                <Text style={{fontSize:22,fontWeight:'bold',flex:4,color:"red"}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                <Button style={{justifyContent:'flex-end',flex:2, backgroundColor:"#ff4500"}} labelStyle={{color:"white"}} onPress={()=>AddBuy()}>Đặt hàng</Button>
            </View> 
        </View>
    ) 
}
export default CartToBuy;