import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { List, Searchbar, Text } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

const SearchAutoComplete = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firestore().collection('Product').get();
        const resultData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllData(resultData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
   // Fetch data only once when the component mounts
  useEffect(() => {
    const filteredResult = allData.filter((item) =>
      item &&
      (
        (item.name && removeDiacritics(item.name).toLowerCase().includes(removeDiacritics(search).toLowerCase())) ||
        (item.Idcategory && removeDiacritics(item.Idcategory).toLowerCase().includes(removeDiacritics(search).toLowerCase()))
      )
    );
    setFilteredData(filteredResult);
  }, [search, allData]);
  

  const handleSearch = (text) => {
    setSearch(text);
    setIsSearching(text.length > 0);
  };

  const handleSelectItem = (item) => {
    console.log('Selected item:', item);
    // Xử lý khi một mục được chọn
  };
  const  renderCategories=({item})=>{
        
    return(
      <TouchableOpacity style={{flexDirection:'row',marginLeft:20,backgroundColor:'white'}} onPress={()=>navigation.navigate("ProductDetail",{product:item})}>
        <Image style={{height:50,width:50}} source={{uri:item.img}}/>
        <Text>{item.name}</Text>  
      </TouchableOpacity>
            
    )
};
    const [isSearching, setIsSearching] = useState(false);
      return (
        <View style={{margin:10}} >
      <Searchbar
        placeholder="Type Here..."
        onChangeText={handleSearch}
        value={search}
        onIconPress={()=>navigation.navigate("SearchDetail",{product:filteredData})}
      />
      {isSearching ? (
      <FlatList
        style={{position: 'absolute', top: 60, zIndex: 1,backgroundColor:'white',alignSelf:'center'}}
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={item.price}
              left={()=><Image style={{height:50,width:50}} source={{uri:item.img}}/>}
            />
        )}
      />
      ) : null}
    </View>

      );
    };

export default SearchAutoComplete;
