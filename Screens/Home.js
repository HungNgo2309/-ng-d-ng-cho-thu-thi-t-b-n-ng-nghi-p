import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import TopDeals from "./TopDeal";
import CategoriesData from "../Data/Category";
import myProductsData from "../Data/Product";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import CarouselExample from "./Swiper";
import SearchAutoComplete from "./Search";
import { SafeAreaView } from "react-native";

const initial = () => {
    const Products = firestore().collection('Product');
    const Categories = firestore().collection('Category');

    myProductsData.forEach(b => {
        const path = "Device/" + b.img;

        storage().ref(path).getDownloadURL()
            .then(url => {
                b.img = url;

                Products.doc(b.id + '').set(b)
                    .then(() => console.log("Add new product!"))
                    .catch((e) => console.log("Error: " + e));
            })
            .catch(e => console.log("Error: " + e));
    });

    CategoriesData.map(c => {
        Categories.doc(c.name + "").set(c)
            .then(() => console.log("Add new Categories!"));
    });
};

const HomeScreen = () => {
    const [selected, setSelected] = useState("Máy móc nông nghiệp");
    const [lstProduct, setListProduct] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const Products = firestore().collection('Product').where("Idcategory", '==', selected);
        Products.onSnapshot((lst) => {
            const list = [];
            lst.forEach(doc => list.push(doc.data()));
            setListProduct(list);
        });
    }, [selected]);

    const renderListItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.shadow} onPress={() => navigation.navigate("ProductDetail", { product: item })}>
                <View style={{ alignSelf: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: "blue", fontFamily: 'OpenSans-Regular' }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center' }}>Giá bán:</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', color: "red" }}> {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', fontWeight: '800' }}>Giá thuê:{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.rent)}/{item.time}</Text>
                </View>
                <Image style={{ width: 200, height: 200, flex: 1 }} source={{ uri: item.img }} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={
                    <View style={{ backgroundColor: '#f5f5f0' }}>
                        <Avatar.Image size={50} source={require('../img/avatar.png')} />
                        <View style={{ flex: 1 }}>
                            <CarouselExample />
                        </View>
                        <View>
                            <SearchAutoComplete />
                        </View>
                        <View>
                            <TopDeals />
                        </View>
                        <FlatList
                            style={{ marginBottom: 10 }}
                            horizontal
                            data={CategoriesData}
                            renderItem={({ item }) => (
                                <Button mode={selected === item.name ? 'contained' : 'outlined'} style={{ margin: 5 }} onPress={() => setSelected(item.name)}>
                                    {item.name}
                                </Button>
                            )}
                        />
                    </View>
                }
                data={lstProduct}
                renderItem={renderListItem}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    shadow: {
        backgroundColor: 'white',
        flexDirection: 'row',
        margin: 10,
        shadowColor: '#000',
        borderRadius: 10,
    },
});
