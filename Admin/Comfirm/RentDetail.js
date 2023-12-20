import React, { useEffect, useState } from "react";
import {  Image, View } from "react-native";
import { Text,Button, TextInput, IconButton } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker'

const RentDetail=({route,navigation})=>{
    const {id,name,img,rent,quantity} = route.params;
    const Rent = firestore().collection('Rent');
    const[username,setUsername]=useState("");
    const[address,setAddress]=useState("");
    const[phone,setPhone]=useState("");
    const [date, setDate] = useState(new Date());
    const [status, setStatus] = useState(false);
    const [shouldUpdateDate, setShouldUpdateDate] = useState(true);
    const[day,setDay]=useState(1);
    const[hour,setHour]=useState(0);
    function ChangeStatus()
    {
        Rent.doc(id).update({
            status:!status,
        })
        navigation.goBack();
    }
    useEffect(()=>{
        const fetchData = async () => {
            try {
                    const profileSnapshot = await Rent.doc(id).get();
                     if (await profileSnapshot.exists) {
                            // Nếu tài liệu tồn tại, cập nhật state với dữ liệu từ tài liệu
                            const data = profileSnapshot.data();
                            setUsername(data.username);
                            setAddress(data.address);
                            setPhone(data.phone);
                            const datetimeDate = data.datetime.toDate();
                            setDate(new Date(datetimeDate));
                            setStatus(data.status);
                            setDay(data.day);
                            setHour(date.hour);
                        }
            } catch (error) {
                console.error("Lỗi khi truy cập thông tin hồ sơ:", error);
            }
        };
        
        fetchData()
    },[shouldUpdateDate]);
    return(
        <View style={{flex:1,backgroundColor:'#ffd9b3'}}>
            <IconButton style={{alignSelf:'flex-start',position:'absolute'}} icon="keyboard-backspace"  onPress={()=>navigation.goBack()}/>
            <Text style={{alignSelf:'center',fontSize:30,fontWeight:"bold"}}>Chi tiết thuê</Text>
            <View style={{flexDirection:'row'}}>
                    <Image style={{height:150,width:150}} source={{uri:img}} />
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:25,alignContent:'center',textAlign:'auto'}}>{name}</Text>
                        <Text style={{textAlign:'auto',color:"red"}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rent)}/ngày</Text>
                    </View>
                    
            </View>
            <View style={{marginLeft:10,marginTop:20,marginRight:10}}>
                <Text  style={{fontSize:20}}>Tên khách hàng :{username}</Text>
                <Text style={{fontSize:20}}>{address}</Text>
                <Text  style={{fontSize:20}}>{phone}</Text>
                <Text style={{fontSize:20}}>Thời gian thuê: {
                    day >0
                        ? `${day} ngày ${hour} giờ`
                        : `${hour} giờ`
                }</Text>
                <Text style={{fontSize:20}}>Số lượng : {quantity}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text>Ngày thuê : </Text>
                    <Text>{date.toDateString()} {date.toTimeString()}</Text>
                </View>
      
            </View> 
            <Button style={{position:'absolute',bottom:0,alignSelf:'center',backgroundColor:"#47d147"}} labelStyle={{fontSize:20,color:"white"}} onPress={()=>ChangeStatus()}>{status==true?`Hủy`:`Duyệt`}</Button>
                   
        </View>
    ) 
}
export default RentDetail;