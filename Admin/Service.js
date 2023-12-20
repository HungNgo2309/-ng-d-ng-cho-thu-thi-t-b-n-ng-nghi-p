import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-virtualized-view'

const Service = ({ navigation }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore().collection('Product').onSnapshot((snapshot) => {
            const servicesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setServices(servicesData);
        });

        return () => unsubscribe();
    }, []);

    const handleDetails = (service) => {
        navigation.navigate('DetailsService', {product:item});
    };

    const handleEdit = (service) => {
        navigation.navigate('EditService', { id: service.id });
    };

    const handleDelete = async (service) => {
        try {
            Alert.alert(
                'Warning',
                'Are you sure?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        onPress: async () => {
                            await firestore().collection('services').doc(service.id).delete();
                        },
                        style: 'destructive',
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Error deleting service: ', error);
            Alert.alert('Error', 'An error occurred while deleting the service');
        }
    };

    return (
        <View>
            <View style={styles.container}>
                <View>
                    <Text style={{ fontWeight: '600' }}>Danh sách sản phẩm</Text>
                </View>
                    <TouchableOpacity onPress={() => navigation.navigate('AddService',{id:services.length+1})}>
                        <Text>
                            <Icon name="add-circle" size={45} style={{ color: 'blue' }} />
                        </Text>
                    </TouchableOpacity>
            </View>
            <ScrollView>
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', margin: 5 }}>
                            <View style={styles.item}>
                                <TouchableOpacity onPress={() => navigation.navigate('DetailsService', {product:item})}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.name}</Text>
                                            <Text>{item.price + " đ"}</Text>
                                        </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Pressable onPress={() => navigation.navigate('EditService', {product:item})}>
                                                    <View style={{ backgroundColor: 'green', padding: 10, borderRadius: 50, marginRight: 10 }}>
                                                        <Text>
                                                            <Icon name="edit" size={20} style={{ color: 'white' }} />
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                                <Pressable onPress={() => handleDelete(item)}>
                                                    <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 50 }}>
                                                        <Text>
                                                            <Icon name="delete" size={20} style={{ color: 'white' }} />
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    item: {
        width: '100%',
        borderWidth: 1,
        padding: 15,
        borderColor: 'gray',
        borderRadius: 10,
    }
});

export default Service;
