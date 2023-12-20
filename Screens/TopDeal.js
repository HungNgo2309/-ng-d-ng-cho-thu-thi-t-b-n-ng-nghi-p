import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';

const TopDeals=()=>{
    const navigation = useNavigation();
    const [data,setData]=useState([]);
    useEffect(() => {
        const countProducts = async () => {
            const productData = {};
          
            // Truy vấn số lượng sản phẩm đã mua
            const buySnapshot = await firestore().collection('Buy').get();
            buySnapshot.forEach((doc) => {
              const data = doc.data();
              const productId = data.id_product;
          
              // Tăng số lượng sản phẩm đã mua
              if (productData[productId]) {
                productData[productId].buyCount += data.quantity;
              } else {
                productData[productId] = { buyCount: data.quantity, rentCount: 0 };
              }
            });
          
            // Truy vấn số lượng sản phẩm đã thuê
            const rentSnapshot = await firestore().collection('Rent').get();
            rentSnapshot.forEach((doc) => {
              const data = doc.data();
              const productId = data.id_product;
          
              // Tăng số lượng sản phẩm đã thuê
              if (productData[productId]) {
                productData[productId].rentCount += data.quantity;
              } else {
                productData[productId] = { buyCount: 0, rentCount: data.quantity };
              }
            });
          
            // Lấy thông tin sản phẩm từ collection 'product'
            const productSnapshot = await firestore().collection('Product').get();
            productSnapshot.forEach((doc) => {
              const productId = doc.id;
          
              // Nếu sản phẩm có trong ít nhất một trong hai collection 'buy' hoặc 'rent'
              if (productData[productId]) {
                const productInfo = doc.data();
                productData[productId] = { ...productData[productId], ...productInfo };
              }
            });
          
            return productData;
          };
          
          // Sử dụng hàm để lấy dữ liệu
          countProducts()
            .then((result) => {
              setData(result);
            })
            .catch((error) => {
              console.error('Error counting products:', error);
            });
      }, []);
    const renderproduct=({item})=>{
        return(
            <TouchableOpacity style={{backgroundColor:"white",borderRadius:10,margin:5}}
            onPress={()=>navigation.navigate("ProductDetail",{product:item})}>
                 <Image style={{width:200,height:200}} source={{uri:item.img}} />
                 <View style={{alignItems:'center'}}>
                    <Text style={{color:"#1a53ff",fontSize:20,textAlign:"center"}}>{item.name}</Text>
                    <Text style={{color:"red"}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
                    <Text >Đã mua: {item.buyCount}</Text>
                    <Text>Đã thuê: {item.rentCount}</Text>
                 </View>
            </TouchableOpacity>
        )}
    return(
        <View>  
            <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:"#6200ee",margin:10,borderRadius:10,padding:5}}>
                    <Text style={{fontSize:30,fontWeight:'bold',color:"white"}}>Top Deals</Text>
                
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{color:'white',fontFamily:"aria"}}>See more </Text>
                        <FontAwesome style={{alignItems:'center',}} color='blue' name='chevron-circle-right'/>
                    </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                renderItem={renderproduct}
                data={Object.values(data)} // Thay đổi ở đây
                keyExtractor={item => item.id.toString()}
                />
        </View>
    )
}
export default TopDeals;