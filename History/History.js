import React, { useContext, useEffect, useState } from "react";
import {  Alert, FlatList, Image, View } from "react-native";
import {Button, Dialog, Icon, IconButton, Paragraph, Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import  {AuthenticatedUserContext}  from '../providers';
import { useNavigation } from "@react-navigation/native";

const History=()=>{
    const [isVisible, setIsVisible] = useState(true);
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [databuy, setDatabuy] = useState([]);
    const[loading,setLoading]=useState(true);
    const { user } = useContext(AuthenticatedUserContext);
    const [showDialog, setShowDialog] = useState(false);
    const[idremove,setIDremove]=useState("");
    const[statusremove,setStatusremove]=useState(0);
    const openDialog = () => {
        setShowDialog(true);
      };
    
      // Hàm này sẽ đóng dialog
      const closeDialog = () => {
        setShowDialog(false);
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
              const cartSnapshot = await firestore().collection('Rent').where('id_user','==',user.uid).get();
              const cartData = cartSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

              const BuySnapshot = await firestore().collection('Buy').where('id_user','==',user.uid).get();
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

    async function RemoveItem()
    {
        if(statusremove==1&&idremove!=null)
        {
            const Rent=firestore().collection("Rent");
            try{
                await Rent.doc(idremove).delete();
                Alert.alert("Hủy thành công");
                setLoading(!loading);
                closeDialog();
            }catch{
                Alert.alert("Không thể hủy");
            }
        }else{
            const Buy=firestore().collection("Buy");
            await Buy.doc(idremove).delete();
            Alert.alert("Hủy thành công");
            setLoading(!loading);
            closeDialog();
        }
    }
    const renderRent=({item})=>{
        return(
            <View style={{flexDirection:'row'}}>
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
                <View style={{flexDirection:"row",}}>
                    {
                        item.status==true?<Text style={{color:'green',fontWeight:'bold',alignSelf:'center'}}>Đã duyệt</Text>:
                        <Text style={{color:'red',fontWeight:'bold',alignSelf:'center'}}>
                            Chưa duyệt
                        </Text>
                    }
                    
                    <IconButton icon='file-edit-outline' onPress={()=>navigation.navigate('RentDetail',{ product: {
                                                                                                                     id_user:user.uid,
                                                                                                                     id_product:item.productData.id,
                                                                                                                     name: item.productData.name, // Đổi thành name
                                                                                                                     rent:item.productData.rent ,
                                                                                                                     img:item.productData.img,
                                                                                                                     quantity:item.quantity,
                                                                                                                     day:item.day, 
                                                                                                                     hour:item.hour,
                                                                                                                     id:item.id,
                                                                                                                     datetime:item.datetime,
                                                                                                                       }
                                                                                                                  })}/>
                    
                    <Button style={{alignSelf:'center'}} onPress={() =>{ openDialog();setIDremove(item.id);setStatusremove(1)} }>Hủy</Button>
                </View>
            </View>
        </View>
        )};
        const renderBuy=({item})=>{
            return(
                <View style={{flexDirection:'row'}}>
                <Image style={{height:120,width:120}} source={{uri:item.productData.img}} />
                <View style={{marginLeft:10,alignContent:'center'}}>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>{item.productData.name}</Text>
                    <Text>Số lượng : {item.quantity}</Text>
                    <Text>Chi phí : {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productData.price*item.quantity)}</Text>
                    <View style={{flexDirection:"row",}}>
                        <Text style={{color:'red',fontWeight:'bold',alignSelf:'center'}}>Chưa hoàn thành</Text>
                        <IconButton icon='file-edit-outline' onPress={()=>navigation.navigate('BuyDetail',{ product: {
                                                                                                                     id_user:user.uid,
                                                                                                                     id_product:item.productData.id,
                                                                                                                     name: item.productData.name, // Đổi thành name
                                                                                                                     price:item.productData.price ,
                                                                                                                     img:item.productData.img,
                                                                                                                     quantity:item.quantity,
                                                                                                                     id:item.id,
                                                                                                                       }
                                                                                                                  })}/>

                        <Button style={{alignSelf:'center'}} onPress={() =>{ openDialog();setIDremove(item.id);setStatusremove(0)} }>Hủy</Button>
                    </View>
                </View>
            </View>
            )}
    return(
        <View>
            <Text style={{fontSize:25,fontWeight:"bold",textAlign:'center',marginBottom:20}}>Lịch sử</Text>
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
            {/* Dialog */}
      <Dialog visible={showDialog} onDismiss={closeDialog}>
        <Dialog.Title>Xác nhận</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Bạn có chắc chắn muốn hủy đơn hàng này ?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={closeDialog}>Hủy</Button>
          <Button onPress={() =>RemoveItem()}>Xác nhận</Button>
        </Dialog.Actions>
      </Dialog>
        </View>
    )
}
export default History;