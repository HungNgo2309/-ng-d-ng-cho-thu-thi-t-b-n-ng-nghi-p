import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore  from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

const AddProductScreen = ({route}) => {
  const{id}=route.params;
  const[id_p,setidP]=useState('');
  const [idCategory, setIdCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [rent, setRent] = useState(0);
  const [data,setdata]=useState([]);
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
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          // Sau khi có URL ảnh, thêm dịch vụ vào Firestore
          setidP(id)
          firestore().collection('Product').doc(id_p).set({
            name: name,
            price: price,
            img: downloadURL,
            Idcategory:idCategory,
            rent:rent,
            id:id_p,
            description:description,
            time:"ngày",
          });
          Alert.alert("Thêm thành công")
          // Đặt lại trạng thái sau khi hoàn thành
         setImgUrl(null);
         setDescription("");
         setIdCategory("");
         setName("");
         setPrice("");
         setRent("");

          // Hiển thị thông báo hoặc chuyển hướng người dùng nếu cần
          alert('Dịch vụ đã được thêm thành công!');
        });
      }
    );
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
    <View style={styles.container}>
      <Text style={styles.label}>Id Category</Text>
      <TextInput
        style={styles.input}
        value={idCategory}
        onChangeText={setIdCategory}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Price</Text>
      <TextInput style={styles.input} value={price.toString()} onChangeText={setPrice} />

      <Text style={styles.label}>Rent</Text>
      <TextInput style={styles.input} value={rent.toString()} onChangeText={setRent} />

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

      <Button onPress={uploadImageAndAddService}> Thêm sản phẩm</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    
  },
  label: {
    fontSize: 15,
    marginTop: 10,
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
    marginTop: 5,
    
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
   
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  
});


export default AddProductScreen;
