import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import firestore from '@react-native-firebase/firestore';
import  {AuthenticatedUserContext}  from '../providers';
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "react-native-paper";

const EditRent=({route})=>{
    const{id}= route.params;
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const { user } = useContext(AuthenticatedUserContext);
    console.log("vào m 1");
    useEffect(() => {
              // Truy vấn tất cả các documents từ collection "Products"
              const productsSnapshot =  firestore().collection('Product').get();
              const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              console.log("prod"+productsData);
              // Truy vấn document từ collection "Rent" với id nhất định
                const rentSnapshot =  firestore().collection('Rent').doc(id).get();
                const rentData = rentSnapshot.exists ? { id: rentSnapshot.id, ...rentSnapshot.data() } : null;
                console.log("renr"+rentData);
                // Nếu có dữ liệu từ collection "Rent", kết hợp với dữ liệu từ collection "Products"
                const mergedData = rentData
                ? { ...rentData, productData: productsData.find((product) => product.id === rentData.id_product) }
                : null;
              setData(mergedData);
      }, []);
      console.log(data)
    return(
        <View style={{flex:1}}>
            <Text style={{alignSelf:'center',fontSize:30}}>Chi tiết thuê</Text>
            <View style={{flexDirection:'row'}}>
                    <Image style={{height:150,width:150}} source={{uri:data.productData.img}} />
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:25,alignContent:'center'}}>{data.productData.name}</Text>
                        <Text style={{textAlign:'center'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.productData.rent)}/ngày</Text>
                    </View>
                    
            </View>
            <View style={{marginLeft:10,marginTop:20}}>
                <Text style={{fontSize:20}}>Tên khách hàng : {user.username}</Text>
                <Text style={{fontSize:20}}>Địa chỉ : {user.address}</Text>
                <Text style={{fontSize:20}}>Số điện thoại: {user.phone}</Text>
                <Text style={{fontSize:20}}>Thời gian thuê:</Text>
                <Text style={{fontSize:20}}>Số lượng : {quantity}</Text>
            </View>  
            <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignSelf:'space-around'}}>
                <Text style={{fontSize:30,fontWeight:'bold'}}>Tổng tiền: </Text>
                <Text style={{fontSize:30,fontWeight:'bold'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                <Button style={{alignContent:'flex-end',marginLeft:50}} onPress={()=>AddRent()}>Hoàn tất</Button>
            </View>             
        </View>
    )
}
export default EditRent;