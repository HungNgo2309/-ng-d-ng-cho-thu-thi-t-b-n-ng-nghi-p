import React, { useEffect, useState } from "react";
import {  Alert, Image, View } from "react-native";
import { Text,Button, TextInput, IconButton, HelperText } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const BuyDetail=({route,navigation})=>{
    const { id_user, id_product,name,price,img,quantity,id } = route.params.product;
    const[user,setUser]=useState([]);
    const[total,setTotal]=useState(0);
    const[username,setUsername]=useState("");
    const[address,setAddress]=useState("");
    const[phone,setPhone]=useState("")
    const Profile = firestore().collection('Profile');
    async function AddBuy() {
        try {
                
                // Nếu chưa tồn tại, thêm mới
                if(!hasAddressErrors()&&!hasNameErrors()&&!hasPhoneErrors())
                {
                    if(id!=null)
                    {
                        const Rent = await firestore().collection('Buy');
                        await Rent.doc(id).update({
                            username:username,
                            phone:phone,
                            address:address,
                        })
                        Alert.alert("Cập nhật thành công");
                        navigation.navigate("History");
                    }else{
                        const Rent = await firestore().collection('Buy');
                    await Rent.add({
                        id_user: id_user,
                        id_product: id_product,
                        quantity: quantity,
                        state:false,
                        username:username,
                        phone:phone,
                        address:address,
                    });
                    Alert.alert("Đặt hàng thành công. Nhấn vào mục Lịch sử để xem lại");
                }
                }else{
                    Alert.alert("Vui lòng kiểm tra lại thông tin");
                }
               
        } catch (error) {
            console.error("Lỗi khi thêm dữ liệu mua:", error);
        }
    }
    const hasNameErrors = () => {
        return username.trim() === "";
      };
      
      const hasAddressErrors = () => {
        return address.trim() === "";
      };
      
      const hasPhoneErrors = () => {
        return phone.trim() === "" || isNaN(phone) || phone.length !== 10;
    };
    useEffect(()=>{
        const fetchProfile = async () => {
            try {
                if(id!=null)
                {
                    const Rent = await firestore().collection('Buy');
                    const profileSnapshot = await Rent.doc(id).get();
                     if (await profileSnapshot.exists) {
                            // Nếu tài liệu tồn tại, cập nhật state với dữ liệu từ tài liệu
                            const data = profileSnapshot.data();
                            setUsername(data.username);
                            setAddress(data.address);
                            setPhone(data.phone);
                        }
                }else{
                    const profileSnapshot = await Profile.doc(id_user).get();
                    if (profileSnapshot.exists) {
                        // Nếu tài liệu tồn tại, cập nhật state với dữ liệu từ tài liệu
                        const data = profileSnapshot.data();
                        setUser(data);
                        setUsername(data.username);
                        setAddress(data.address);
                        setPhone(data.phone);
                }
            }
            } catch (error) {
                console.error("Lỗi khi truy cập thông tin hồ sơ:", error);
            }
        };
        fetchProfile();  
        setTotal(quantity*price);
    },[ ]);
    return(
        <View style={{flex:1,backgroundColor:'#ffd9b3'}}>
            <IconButton style={{alignSelf:'flex-start',position:'absolute'}} icon="keyboard-backspace"  onPress={()=>id!=null?navigation.navigate("History") :navigation.goBack()}/>
            <Text style={{alignSelf:'center',fontSize:30}}>Chi tiết mua</Text>
            <View style={{flexDirection:'row'}}>
                    <Image style={{height:150,width:150}} source={{uri:img}} />
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:25,alignContent:'center'}}>{name}</Text>
                        <Text style={{textAlign:'center',color:'red'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</Text>
                    </View>
                    
            </View>
            <View style={{marginLeft:10,marginTop:20}}>
                 <TextInput style={{fontSize:20}} mode="outlined" value={username} onChangeText={setUsername} label="Tên khách hàng" />
                 <HelperText type="error" visible={hasNameErrors()}>
                    Họ và tên không được để trống !
                </HelperText>
                <TextInput style={{fontSize:20}}  mode="outlined" value={address} onChangeText={setAddress} label="Địa chỉ"/>
                <HelperText type="error" visible={hasAddressErrors()}>
                    Địa chỉ không được để trống !
                </HelperText>
                <TextInput style={{fontSize:20}}  mode="outlined" value={phone} onChangeText={setPhone} label="Số điện thoại"/>
                <HelperText type="error" visible={hasPhoneErrors()}>
                    Số điện thoại không hợp lệ !
                </HelperText>
                <Text style={{fontSize:20}}>Số lượng : {quantity}</Text>
            </View> 
            {
                id!=null?<Button style={{position:'absolute',bottom:0,alignSelf:'center',backgroundColor:"#47d147"}} labelStyle={{fontSize:20,color:"white"}} onPress={()=>AddBuy()}>Lưu thay đổi</Button>:
             
            <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignSelf:'space-around'}}>
                <Text style={{fontSize:20,fontWeight:'bold',flex:2}}>Tổng tiền: </Text>
                <Text style={{fontSize:20,fontWeight:'bold',flex:4,color:'red'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                <Button style={{flex:2}} labelStyle={{fontSize:20}} onPress={()=>AddBuy()}>Hoàn tất</Button>
            </View>  
                }           
        </View>
    ) 
}
export default BuyDetail;