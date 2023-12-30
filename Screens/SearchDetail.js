import React, { useEffect, useState } from "react";
import { FlatList, Image } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const SearchDetail=({route,navigation})=>{
    const{product}=route.params;
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
        setSearch(product);
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
            (item.Idcategory && removeDiacritics(item.Idcategory).toLowerCase().includes(removeDiacritics(search).toLowerCase()))||
            (item.Idcategory && removeDiacritics(item.description).toLowerCase().includes(removeDiacritics(search).toLowerCase()))
          )
        );
        setFilteredData(filteredResult);
      }, [search, allData]);
      
    
      const handleSearch = (text) => {
        setSearch(text);
      };
      
    const renderproduct=({item})=>{
        return(
            <TouchableOpacity style={{flex:5}} onPress={()=>navigation.navigate("ProductDetail",{product:item})}>
                 <Image style={{width:200,height:200}} source={{uri:item.img}} />
                 <View style={{alignItems:'center'}}>
                    <Text>{item.name}</Text>
                    <Text>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
                 </View>
            </TouchableOpacity>
        )}
    return(
        <View>
            <Searchbar
                placeholder="Type Here..."
                onChangeText={handleSearch}
                value={search}
                onIconPress={()=>setFilteredData(null)}
            />
            {filteredData.length>0 ?(
            <FlatList
                data={filteredData}
                renderItem={renderproduct}
                keyExtractor={item=>item.id.toString()}
                numColumns={2}
                key={2}
            />
            ):
                <Text>Không tìm thấy kết quả</Text>
            }
        </View>
    )
}
export default SearchDetail;