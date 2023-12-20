import React, { useEffect, useState } from "react";
import { View } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { Image } from "react-native";
import { Text } from "react-native-paper";
const EditBuy =({route})=>{
    const [data, setData] = useState([]);
    const [total,setTotal]=useState(0);
    useEffect(()=>{
        const{id}=route.params;
        console.log(id);
        const fetchData = async () => {
            const productsSnapshot = await firestore().collection('Product').get();
            const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            //console.log(productsData);
            const rentSnapshot = await firestore().collection('Buy').doc(id).get();
            const rentData = rentSnapshot.exists ? { id: rentSnapshot.id, ...rentSnapshot.data() } : null;
            console.log("renr"+rentData);
            // Nếu có dữ liệu từ collection "Rent", kết hợp với dữ liệu từ collection "Products"
            const mergedData = rentData
            ? { ...rentData, productData: productsData.find((product) => product.id === rentData.id_product) }
            : null;
          setData(mergedData);
        }
        fetchData();
        
    },[])
    console.log(data);
    return(
        <View style={{flex:1}}>
            <Text style={{alignSelf:'center',fontSize:30}}>Chi tiết thuê</Text>
            <View style={{flexDirection:'row'}}>
                    {/* <Image style={{height:150,width:150}} source={{uri:data.productData.img}} /> */}
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:25,alignContent:'center'}}>{data.productData.name}</Text>
                    </View>
                    
            </View>
            {/* <View style={{marginLeft:10,marginTop:20}}>
                <Text style={{fontSize:20}}>Tên khách hàng : {user.username}</Text>
                <Text style={{fontSize:20}}>Địa chỉ : {user.address}</Text>
                <Text style={{fontSize:20}}>Số điện thoại: {user.phone}</Text>
                <Text style={{fontSize:20}}>Thời gian thuê:</Text>
                <Text style={{fontSize:20}}>Số lượng : {quantity}</Text>
            </View>   */}
            <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignSelf:'space-around'}}>
                <Text style={{fontSize:30,fontWeight:'bold'}}>Tổng tiền: </Text>
                <Text style={{fontSize:30,fontWeight:'bold'}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                <Button style={{alignContent:'flex-end',marginLeft:50}}>Hoàn tất</Button>
            </View>             
        </View>
    )
}
export default EditBuy;