import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";

const CarouselExample = () => {
    const [pcate, setPcate] = useState([]);
    const navigation = useNavigation();
	const Products = firestore().collection('Product');
    useEffect(() => {
        const unsubscribe = Products.onSnapshot((snapshot) => {
            const list = snapshot.docs.map((doc) => doc.data());
            // Lấy 3 phần tử cuối cùng
            
            setPcate(list);
        });// Hủy đăng ký theo dõi khi component unmount
        return () => unsubscribe();
        }, []);
//   const data = [
//     { id: 1, link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOIOzF2rXzhK_dwtOPNCvXDrUlFcoeKxIwLpRYd3S5HRdtHIp2z2yHMMwRkg1wd5PGyd8&usqp=CAU' },
//     { id: 2, link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdg6UQoZb_sACPpclLFpBd2YRrIydTQpVl9TR6eLnuajl08KoAsrBLAoo2gQTuxU9CrRo&usqp=CAU' },
//     { id: 3, link: 'https://live.staticflickr.com/65535/49932658111_30214a4229_b.jpg' },
//     // Add more data as needed
//   ];
  return (
    <Swiper style={styles.wrapper}  autoplay={true} autoplayTimeout={2.5} autoplayDirection={true}>
      {pcate.map((item) => (
        <View key={item.id}>
        <TouchableOpacity onPress={()=>navigation.navigate("ProductDetail",{product:item})}>
          <Image  source={{ uri: item.img }} style={styles.image}/>
          </TouchableOpacity>
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height:200,
    backgroundColor:"white"
  },
  swiperContainer: {
    marginTop:0,
  },
  slide: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});

export default CarouselExample;
