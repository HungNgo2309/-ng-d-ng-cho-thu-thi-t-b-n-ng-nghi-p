import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Modal } from "react-native";
import { IconButton, Text, Button, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const Category = () => {
  const [data, setdata] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newName, setNewName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

  const renderCategories = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: 'white', borderRadius: 10, margin: 5, padding: 10 }}
        onPress={() => {
          setSelectedCategory(item);
          setNewName(item.name);
          setModalVisible(true);
        }}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const updateCategory = async () => {
    if (selectedCategory && newName.trim() !== '') {
      try {
        await firestore().collection('Category').doc(selectedCategory.id).update({
          name: newName,
        });
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  const deleteCategory = async () => {
    if (selectedCategory) {
      try {
        await firestore().collection('Category').doc(selectedCategory.id).delete();
        setModalVisible(false);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Thêm danh mục</Text>
        <IconButton icon="plus-circle" size={30} iconColor="blue" />
      </View>

      <FlatList data={data} renderItem={renderCategories} />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Chọn hành động</Text>

            {/* Input for new name */}
            <TextInput
              label="Tên mới"
              value={newName}
              onChangeText={(text) => setNewName(text)}
              style={{ marginBottom: 10 }}
            />

            {/* Button Update */}
            <Button
              mode="contained"
              onPress={() => {
                updateCategory();
              }}
              style={{ marginBottom: 10 }}
            >
              Cập nhật
            </Button>

            {/* Button Delete */}
            <Button mode="outlined" onPress={() => deleteCategory()} color="red">
              Xóa
            </Button>

            {/* Button Close */}
            <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              Đóng
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Category;
