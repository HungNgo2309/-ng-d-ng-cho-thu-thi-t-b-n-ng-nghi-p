import React, { useEffect, useState } from "react";
import {  Alert, Image, View } from "react-native";
import { Text,Button, TextInput, IconButton, HelperText } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker'

const RentDetail=({route,navigation})=>{
    const { id_user, id_product, day, hour,name,rent,img,quantity,id,datetime } = route.params.product;
    
    const[user,setUser]=useState([]);
    const[total,setTotal]=useState(0);
    const Profile = firestore().collection('Profile');
    const[username,setUsername]=useState("");
    const[address,setAddress]=useState("");
    const[phone,setPhone]=useState("");
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [shouldUpdateDate, setShouldUpdateDate] = useState(true);
    async function AddRent() {
        try {
            if(!hasAddressErrors()&&!hasNameErrors()&&!hasPhoneErrors())
            {
                    if(id!=null) {
                        const Rent = await firestore().collection('Rent');
                        await Rent.doc(id).update({
                            username:username,
                            datetime:date,
                            address:address,
                            phone:phone,
                        });
                        Alert.alert("Cập nhật thành công");
                        navigation.goBack();
                    } else  if (user && id_product && day !== undefined && hour !== undefined && quantity !== undefined) {
                        const Rent = await firestore().collection('Rent');
                        // Nếu chưa tồn tại, thêm mới
                        await Rent.add({
                            id_user: id_user,
                            id_product: id_product,
                            day: day,  
                            hour: hour,
                            quantity: quantity,
                            username:username,
                            datetime:date,
                            address:address,
                            phone:phone,
                        });
                        Alert.alert("Đặt hàng thành công. Nhấn vào mục Lịch sử để xem lại");
            }else {
                console.error("Một số giá trị không hợp lệ để thêm vào Firestore.");
            }
        }else{
            Alert.alert("Vui lòng kiểm tra lại thông tin");
        }
        } catch (error) {
            console.error("Lỗi khi thêm dữ liệu thuê:", error);
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
        const fetchData = async () => {
            try {
                        if(id!=null)
                        {
                            const Rent = await firestore().collection('Rent');
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
        
        fetchData();        
        if(id!=null)
        {
            const datetimeDate = datetime.toDate();
            setDate(new Date(datetimeDate));
            setShouldUpdateDate(false);
        }
        setTotal(Math.round(quantity*day* parseInt(rent)+hour* ((parseInt(rent))/24)));
    },[shouldUpdateDate]);
    return(
        <View style={{flex:1,backgroundColor:'#ffd9b3'}}>
            <IconButton style={{alignSelf:'flex-start',position:'absolute'}} icon="keyboard-backspace"  onPress={()=>id!=null?navigation.navigate("History") :navigation.goBack()}/>
            <Text style={{alignSelf:'center',fontSize:30,fontWeight:"bold"}}>Chi tiết thuê</Text>
            <View style={{flexDirection:'row'}}>
                    <Image style={{height:150,width:150}} source={{uri:img}} />
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:25,alignContent:'center',textAlign:'auto'}}>{name}</Text>
                        <Text style={{textAlign:'auto',color:"red"}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rent)}/ngày</Text>
                    </View>
                    
            </View>
            <View style={{marginLeft:10,marginTop:20,marginRight:10}}>
            <TextInput style={{fontSize:20}} mode="outlined" value={username} onChangeText={setUsername} label="Tên khách hàng" />
                 <HelperText type="error" visible={hasNameErrors()}>
                    Họ và tên không được để trống !
                </HelperText>
                <TextInput style={{fontSize:20}}  mode="outlined" value={address} onChangeText={setAddress} label="Địa chỉ"/>
                <HelperText type="error" visible={hasAddressErrors()}>
                    Địa chỉ không được để trống !
                </HelperText>
                <TextInput style={{fontSize:20}} keyboardType="number-pad"  mode="outlined" value={phone} onChangeText={setPhone} label="Số điện thoại"/>
                <HelperText type="error" visible={hasPhoneErrors()}>
                    Số điện thoại không hợp lệ !
                </HelperText>
                <Text style={{fontSize:20}}>Thời gian thuê: {
                    total >= rent
                        ? `${day} ngày ${hour} giờ`
                        : `${hour} giờ`
                }</Text>
                <Text style={{fontSize:20}}>Số lượng : {quantity}</Text>
                <View style={{flexDirection:'row'}}>
                    
                        <Text>Ngày thuê : {date.toDateString()} {date.toTimeString()}</Text>
                
                    
                    <DatePicker
                        modal
                        open={open}
                        date={date}
                        onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        }}
                        onCancel={() => {
                        setOpen(false)
                        }}
                    />
                    <IconButton style={{alignContent:"center"}} icon="calendar-clock" onPress={() => setOpen(true)}/>
                </View>       
            </View> 
            {
                id!=null?<Button style={{position:'absolute',bottom:0,alignSelf:'center',backgroundColor:"#47d147"}} labelStyle={{fontSize:20,color:"white"}} onPress={()=>AddRent()}>Lưu thay đổi</Button>:
            
            <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignSelf:'space-around'}}>
                <Text style={{fontSize:25,fontWeight:'bold',flex:2}}>Tổng tiền: </Text>
                <Text style={{fontSize:25,fontWeight:'bold',flex:4,color:'red'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                <Button style={{alignContent:'flex-end',marginLeft:50,flex:2}} onPress={()=>AddRent()}>Hoàn tất</Button>
            </View>  
            }          
        </View>
    ) 
}
export default RentDetail;