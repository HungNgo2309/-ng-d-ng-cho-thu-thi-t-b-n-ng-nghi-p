import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Alert, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const EditService = ({ route, navigation }) => {
  const { product } = route.params;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rent,setRent]=useState("");
  const [img,setImg]=useState("");
  const [description,setDesciption]=useState("");
  const[category,setCategory]= useState("");
  useEffect(() => {
      setName(product.name);
      setPrice(product.price);
      setRent(product.rent);
      setCategory(product.Idcategory);
      setImg(product.img);
      setDesciption(product.description);
    },[]);

  const handleUpdate = async () => {
    try {
      const Product = firestore().collection("Product");
      Product.doc(product.id).update({
          name:name,
          description:description,
          price:price,
          rent:rent,
          Idcategory:category,
          img:img,
      })
      navigation.goBack();
    } catch (error) {
     
    }
  };

  return (
    <View style={{ justifyContent: 'center', margin: 10, borderRadius: 20 }}>
      <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Service name * </Text>
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Tên sản phẩm"
        value={name}
        underlineColor='transparent'
        onChangeText={setName}
      />
      <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Price </Text>
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Mô tả"
        value={description}
        underlineColor='transparent'
        onChangeText={setDesciption}
        multiline={true}
      />
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Giá sản phẩm"
        value={price.toString()}
        underlineColor='transparent'
        onChangeText={setPrice}
      />
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Giá thuê /ngày"
        value={rent.toString()}
        underlineColor='transparent'
        onChangeText={setRent}
      />
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Danh mục"
        value={category}
        underlineColor='transparent'
        onChangeText={setCategory}
      />
      <Image style={{height:200,width:200}} source={{uri:img}} />
      <Button onPress={handleUpdate}>Lưu thay đổi</Button>
    </View>
  );
};

const styles = StyleSheet.create({});

export default EditService;
