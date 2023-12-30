import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Image, View } from "react-native";
import { Button, Dialog, IconButton, Paragraph, Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { AuthenticatedUserContext } from '../providers';
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: '#673ab7' }}
  />
);

const History = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthenticatedUserContext);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'rent', title: 'Thuê' },
    { key: 'buy', title: 'Mua' },
  ]);
  const [data, setData] = useState([]);
  const [databuy, setDatabuy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [idremove, setIDremove] = useState("");
  const [statusremove, setStatusremove] = useState(0);
  const Cart =firestore().collection("Buy");
  const openDialog = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const toggleVisibility = () => {
    setIndex(index === 0 ? 1 : 0);
  };

  useEffect(() => {
    const unsubscribe = firestore().collection('Product').onSnapshot(productsSnapshot => {
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      const cartUnsubscribe = firestore().collection('Rent').where('id_user', '==', user.uid).onSnapshot(cartSnapshot => {
        const cartData = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        const buyUnsubscribe = firestore().collection('Buy').where('id_user', '==', user.uid).onSnapshot(buySnapshot => {
          const BuyData = buySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
          const mergedData = cartData.map(rentItem => {
            const matchingProduct = productsData.find(product => product.id === rentItem.id_product);
            return { ...rentItem, productData: matchingProduct };
          });
  
          const mergedBuyData = BuyData.map(rentItem => {
            const matchingProduct = productsData.find(product => product.id === rentItem.id_product);
            return { ...rentItem, productData: matchingProduct };
          });
  
          setDatabuy(mergedBuyData);
          setData(mergedData);
        });
      });
  
      // Hủy đăng ký lắng nghe khi không còn cần
      return () => {
        cartUnsubscribe();
        buyUnsubscribe();
      };
    }, [user.uid]);
  
    // Hủy đăng ký lắng nghe khi component unmount
    return () => {
      unsubscribe();
    };
  }, [user.uid]);
  

  async function RemoveItem() {
    if(statusremove === 1 && idremove !== null) {
      const Rent = firestore().collection("Rent");
      try {
        await Rent.doc(idremove).delete();
        Alert.alert("Hủy thành công");
        setLoading(!loading);
        closeDialog();
      } catch {
        Alert.alert("Không thể hủy");
      }
    } else {
      const Buy = firestore().collection("Buy");
      await Buy.doc(idremove).delete();
      Alert.alert("Hủy thành công");
      setLoading(!loading);
      closeDialog();
    }
  }

  const renderRent = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image style={{ height: 120, width: 120 }} source={{ uri: item.productData.img }} />
        <View style={{ marginLeft: 10, alignContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.productData.name}</Text>
          <Text>Thời gian thuê: {item.day > 0 ? `${item.day} ngày ${item.hour} giờ` : `${item.hour} giờ`}</Text>
          <Text>Số lượng : {item.quantity}</Text>
          <Text>Chi phí : {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(item.quantity * item.day * parseInt(item.productData.rent) + item.hour * ((parseInt(item.productData.rent)) / 24)))}</Text>
          <View style={{ flexDirection: "row" }}>
            {item.status === true ? <Text style={{ color: 'green', fontWeight: 'bold', alignSelf: 'center' }}>Đã duyệt</Text> :
              <Text style={{ color: 'red', fontWeight: 'bold', alignSelf: 'center' }}>Chưa duyệt</Text>}
            <IconButton icon='file-edit-outline' onPress={() => navigation.navigate('RentDetail', { product: { id_user: user.uid, id_product: item.productData.id, name: item.productData.name, rent: item.productData.rent, img: item.productData.img, quantity: item.quantity, day: item.day, hour: item.hour, id: item.id, datetime: item.datetime, } })} />
            <Button style={{ alignSelf: 'center' }} onPress={() => { openDialog(); setIDremove(item.id); setStatusremove(1) }}>Hủy</Button>
          </View>
        </View>
      </View>
    );
  };

  const renderBuy = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image style={{ height: 120, width: 120 }} source={{ uri: item.productData.img }} />
        <View style={{ marginLeft: 10, alignContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.productData.name}</Text>
          <Text>Số lượng : {item.quantity}</Text>
          <Text>Chi phí : {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productData.price * item.quantity)}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: 'red', fontWeight: 'bold', alignSelf: 'center' }}>Chưa hoàn thành</Text>
            <IconButton icon='file-edit-outline' onPress={() => navigation.navigate('BuyDetail', { product: { id_user: user.uid, id_product: item.productData.id, name: item.productData.name, price: item.productData.price, img: item.productData.img, quantity: item.quantity, id: item.id, } })} />
            <Button style={{ alignSelf: 'center' }} onPress={() => { openDialog(); setIDremove(item.id); setStatusremove(0) }}>Hủy</Button>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'rent':
              return (
                <FlatList
                  data={data}
                  renderItem={renderRent}
                />
              );
            case 'buy':
              return (
                <FlatList
                  data={databuy}
                  renderItem={renderBuy}
                />
              );
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        initialLayout={{ width: useWindowDimensions().width }}
        renderTabBar={renderTabBar}
      />

      {/* Dialog */}
      <Dialog visible={showDialog} onDismiss={closeDialog}>
        <Dialog.Title>Xác nhận</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Bạn có chắc chắn muốn hủy đơn hàng này ?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={closeDialog}>Hủy</Button>
          <Button onPress={() => RemoveItem()}>Xác nhận</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default History;
