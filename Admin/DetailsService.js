import React from 'react';
import { Image } from 'react-native';
import { View, Text, Button, Alert, Pressable} from 'react-native';
import { IconButton } from 'react-native-paper';
import { ScrollView } from 'react-native-virtualized-view';


const DetailService = ({ route,navigation }) => {
  const { product } = route.params;
  return (
    <ScrollView>
    <View>
        <View style={{flexDirection:'row'}}>
            <IconButton style={{alignSelf:'flex-start'}} icon="keyboard-backspace"  onPress={()=>navigation.goBack()}/>
            <Text style={{fontSize:30,textAlign:'center',fontWeight:"700",alignSelf:"center",alignItems:'center'}}>Chi tiết sản phẩm</Text>
        </View>
        
        <View style={{borderWidth:0,margin:20,alignItems:'center',borderRadius:25,backgroundColor:'white'}}>
            <Image style={{width:200,height:200}} source={{uri:product.img}} />
            <Text>{product.name}</Text>
            <Text>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</Text>
            <Text>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.rent)}/{product.time}</Text>
           
        </View>
        <View style={{margin:10}}>
            <Text style={{fontSize:25,fontWeight:"700"}}>Mô tả</Text>
            
                <Text>{product.description}
                </Text>
        </View>
    </View>
    </ScrollView>
  );
};

export default DetailService;
