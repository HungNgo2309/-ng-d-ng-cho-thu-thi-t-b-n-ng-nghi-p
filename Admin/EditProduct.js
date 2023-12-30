import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Alert, Image, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import storage from '@react-native-firebase/storage';

const EditService = ({ route, navigation }) => {
  const [data,setdata]=useState([]);
  const { product } = route.params;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rent,setRent]=useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [description,setDesciption]=useState("");
  const [idCategory, setIdCategory] = useState('');
  useEffect(() => {
      setName(product.name);
      setPrice(product.price);
      setRent(product.rent);
      setIdCategory(product.Idcategory);
      setImgUrl(product.img);
      setDesciption(product.description);
    },[]);
  const pickImage = () => {
      let options = {
        storageOptions: {
          path: 'image',
        },
      };
      launchImageLibrary(options, (response) => {
        if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
          const selectedImageUrl = response.assets[0].uri;
          setImgUrl(selectedImageUrl);
          console.log(selectedImageUrl);
        } else if (response.didCancel) {
          // Người dùng hủy chọn hình ảnh
          console.log('Hủy chọn hình ảnh');
        } else if (response.error) {
          // Xử lý lỗi khi người dùng không chọn ảnh
          Alert.alert('Lỗi', 'Không có ảnh được chọn.');
        }
      });
    };
    const uploadImageAndAddService = async () => {
      if(imgUrl!=product.img){
      const response = await fetch(imgUrl);
      const blob = await response.blob();
  
      const storageRef = storage().ref().child('Device/' + new Date().getTime());
  
      const uploadTask = storageRef.put(blob);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Theo dõi tiến trình upload nếu cần
          // snapshot.totalBytes và snapshot.bytesTransferred
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        () => {
          // Lấy URL của ảnh sau khi upload thành công
          uploadTask.snapshot.ref.getDownloadURL().then(async(downloadURL) => {
            console.log('File available at', downloadURL);
            // Sau khi có URL ảnh, thêm dịch vụ vào Firestore
            const Product =await firestore().collection("Product");
            await Product.doc(product.id).update({
              name: name,
              price: price,
              img: downloadURL,
              Idcategory:idCategory,
              rent:rent,
              description:description,
              time:"ngày",
            });
            Alert.alert("Thay đổi thành công")
            navigation.goBack();
          });
        }
      );
      }else{
             const Product =await firestore().collection("Product");
            await Product.doc(product.id).update({
              name: name,
              price: price,
              Idcategory:idCategory,
              rent:rent,
              description:description,
              time:"ngày",
            });
      }
    };
  useEffect(() => {
    const unsubscribe = firestore().collection('Category').onSnapshot((snapshot) => {
        const servicesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setdata(servicesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView>
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
       <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="name"
        valueField="name"
        placeholder="Chọn danh mục"
        searchPlaceholder="Search..."
        value={idCategory}
        onChange={item => {
          setIdCategory(item.name);
        }}
      />
      {imgUrl && <Image source={{ uri: imgUrl }} style={{ width: 200, height: 200 }} />}
     
     <Button onPress={pickImage}>Chọn ảnh</Button>

      <Button onPress={uploadImageAndAddService}> Cập nhật</Button>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default EditService;
