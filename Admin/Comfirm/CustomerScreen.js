import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Image } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

const CustomerScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const[loading,setLoading]=useState(true);
  const [databuy, setDatabuy] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  function ChangeStatus(id,status)
    {
      const Rent = firestore().collection('Rent');
        Rent.doc(id).update({
            status:!status,
        });
        setLoading(!loading);
    };
    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };
  useEffect(() => {
    const fetchData = async () => {
      try {
          // Truy vấn tất cả các documents từ collection "Products"
          const productsSnapshot = await firestore().collection('Product').get();
          const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
          // Truy vấn tất cả các documents từ collection "Cart"
          const cartSnapshot = await firestore().collection('Rent').get();
          const cartData = cartSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          const BuySnapshot = await firestore().collection('Buy').get();
              const BuyData = BuySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
          // Kết hợp dữ liệu từ cả hai collections
          const mergedData = cartData.map((rentItem) => {
            const matchingProduct = productsData.find((product) => product.id === rentItem.id_product);
            return { ...rentItem, productData: matchingProduct };
          });
          const mergedBuyData = BuyData.map((rentItem) => {
            const matchingProduct = productsData.find((product) => product.id === rentItem.id_product);
            return { ...rentItem, productData: matchingProduct };
          });
          setDatabuy(mergedBuyData);
          setData(mergedData);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
  
      fetchData();
  }, [loading]);
  const renderBuy=({item})=>{
    return(
        <View style={{flexDirection:'row'}}>
        <Image style={{height:120,width:120}} source={{uri:item.productData.img}} />
        <View style={{marginLeft:10,alignContent:'center'}}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>{item.productData.name}</Text>
            <Text>Số lượng : {item.quantity}</Text>
            <Text>Chi phí : {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productData.price*item.quantity)}</Text>
            <View style={{flexDirection:"row",}}>
                <IconButton icon='file-edit-outline' onPress={()=>navigation.navigate('BuyDetail',{ 
                                                                                                             name: item.productData.name, // Đổi thành name
                                                                                                             price:item.productData.price ,
                                                                                                             img:item.productData.img,
                                                                                                             quantity:item.quantity,
                                                                                                             id:item.id,
                                                                                                               
                                                                                                          })}/>
            </View>
        </View>
    </View>
    )}
  const renderRent=({item})=>{
    return(
        <View style={{flexDirection:'row',backgroundColor:'white'}}>
        <Image style={{height:120,width:120}} source={{uri:item.productData.img}} />
        <View style={{marginLeft:10,alignContent:'center'}}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>{item.productData.name}</Text>
            <Text>Thời gian thuê:  {
                item.day >0 
                ? `${item.day} ngày ${item.hour} giờ`
                : `${item.hour} giờ`
                }</Text>
            <Text>Số lượng : {item.quantity}</Text>
            <Text>Chi phí : {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(item.quantity*item.day* parseInt(item.productData.rent)+item.hour* ((parseInt(item.productData.rent))/24)))}</Text>
            {
                    item.status==true?<Text style={{color:'green'}}>Đã duyệt</Text>:
                    <Text style={{color:"red"}}>
                        Chưa duyệt
                    </Text>
                }
            <View style={{flexDirection:"row",}}>
                {
                    item.status==false?<Button onPress={()=>ChangeStatus(item.id,item.status)}>Duyệt</Button>:
                    <Button onPress={()=>ChangeStatus(item.id,item.status)}>
                        Hủy
                    </Button>
                }
                
                <IconButton icon='file-edit-outline' onPress={()=>navigation.navigate("RentDetail",{id:item.id
                                                                                                     ,name: item.productData.name
                                                                                                     ,img:item.productData.img,
                                                                                                     rent:item.productData.rent
                                                                                                     ,quantity:item.quantity})}/>
            </View>
        </View>
    </View>
    )};

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontWeight: '600',fontSize:25,textAlign:'center' }}>Xác nhận đơn hàng</Text>
      </View>
      <View style={{flexDirection:'row'}}>
                <Button style={{flex:1}} mode={isVisible? 'contained' : 'outlined'} onPress={toggleVisibility}>Thuê</Button>
                <Button  style={{flex:1}} mode={!isVisible? 'contained' : 'outlined'} onPress={toggleVisibility}>Mua</Button>
            </View>
            {isVisible ? (
                <FlatList
                 data={data}
                 renderItem={renderRent}
                />
            ) : 
                (
                    <FlatList
                    data={databuy}
                    renderItem={renderBuy}
                   />
                )
            }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#888888',
  },
});

export default CustomerScreen;
