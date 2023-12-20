import React, { useContext,useEffect,useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { Checkbox, IconButton, Text,Dialog,Provider as PaperProvider,Portal, Paragraph, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import  {AuthenticatedUserContext}  from '../providers';
import { useNavigation } from "@react-navigation/native";

const Cart=()=>{
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const { user } = useContext(AuthenticatedUserContext);
    const [loading,setLoading]= useState(true);
    const [allchecked, setAllchecked]=useState(false);
    function InQuanity(id_product, quantity) {
        const Cart = firestore().collection('Cart');
        const cartSnapshot = Cart.where('id_product', '==', id_product).where('id_user', '==', user.uid);
        cartSnapshot.get().then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const firstDoc = querySnapshot.docs[0];
                Cart.doc(firstDoc.id).update({
                    quantity: quantity + 1,
                });
                setLoading(!loading);
            } else {
                // Handle the case where no matching document is found
                console.error('No matching document found.');
            }
        }).catch((error) => {
            // Handle any errors that occurred during the query
            console.error('Error getting documents: ', error);
        });
    } ;
    function DeQuanity(id_product, quantity) {
        const Cart = firestore().collection('Cart');
        const cartSnapshot = Cart.where('id_product', '==', id_product).where('id_user', '==', user.uid);
        cartSnapshot.get().then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const firstDoc = querySnapshot.docs[0];
                if(quantity==1)
                {
                    Cart.doc(firstDoc.id).delete();
                }else{
                    Cart.doc(firstDoc.id).update({
                        quantity: quantity - 1,
                    });
                }
               
                setLoading(!loading);
            } else {
                // Handle the case where no matching document is found
                console.error('No matching document found.');
            }
        }).catch((error) => {
            // Handle any errors that occurred during the query
            console.error('Error getting documents: ', error);
        });
    } ;
    async function Delete()
    {
        const Cart = firestore().collection('Cart').where('id_user', '==', user.uid).where('checked', '==', true);

      try {
        // Lấy tất cả các tài liệu đã được đánh dấu là 'checked' bằng true
        const querySnapshot = await Cart.get();

        // Tạo một mảng chứa tất cả các promises xóa
        const deletePromises = querySnapshot.docs.map((doc) => firestore().collection('Cart').doc(doc.id).delete());

        // Chạy tất cả các promises xóa đồng thời
        await Promise.all(deletePromises);
        setDialogVisible(false);
        // Đã xóa thành công, có thể set state hoặc thực hiện các công việc khác
        setLoading(true);
      } catch (error) {
        console.error('Error deleting documents: ', error);
        setLoading(false);
      }
    };    
    useEffect(() => {
      const fetchData = async () => {
        try {
            // Truy vấn tất cả các documents từ collection "Products"
            const productsSnapshot = await firestore().collection('Product').get();
            const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
            // Truy vấn tất cả các documents từ collection "Cart"
            const cartSnapshot = await firestore().collection('Cart').where('id_user','==',user.uid).get();
            const cartData = cartSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
            // Kết hợp dữ liệu từ cả hai collections
            const mergedData = cartData.map((cartItem) => {
              const matchingProduct = productsData.find((product) => product.id === cartItem.id_product);
              return { ...cartItem, productData: matchingProduct };
            });
            setData(mergedData);
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
    
        fetchData();
    }, [loading, Math.random()]);
    //console.log(data);
    
    const total = data.reduce((accumulator, item) => {
        if(item.checked)
        {
            return accumulator + item.productData.price * item.quantity;
        }
        else return accumulator
      }, 0);
      function setChecked(id, checked) {
        const Cart = firestore().collection('Cart').where('id_user', '==', user.uid);
        if (id === 0) {
          // Nếu id === 0, cập nhật toàn bộ tài liệu trong bộ sưu tập
          Cart.get()
            .then((querySnapshot) => {
              // Duyệt qua từng tài liệu và cập nhật thuộc tính 'checked'
              querySnapshot.forEach((doc) => {
                firestore().collection('Cart').doc(doc.id).update({
                  checked: !checked,
                });
              });
            })
            .then(() => {
              // Đã cập nhật thành công, có thể set state hoặc thực hiện các công việc khác
              setLoading(!loading);
            })
            .catch((error) => {
              console.error('Error updating documents: ', error);
            });
        } else {
          // Ngược lại, chỉ cập nhật một tài liệu cụ thể theo id
          firestore().collection('Cart').doc(id).update({
            checked: !checked,
          })
            .then(() => {
              // Đã cập nhật thành công, có thể set state hoặc thực hiện các công việc khác
              setLoading(!loading);
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
            });
        }
      }      
      //console.log(data);
    
    const rendercart=({item})=>{
        return(
            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',marginBottom:5}}>
            <View style={{flex:3,flexDirection:'row',alignItems:'center'}}>
                <Checkbox
                    status={item.checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(item.id,item.checked);
                    }}
                    />
                <Image style={{width:100,height:100}} source={{uri:item.productData.img}} />
            </View>
            <TouchableOpacity style={{flex:3,marginLeft:5}} onPress={()=>navigation.navigate('Home', { screen: 'ProductDetail', params: { product: item.productData }})}>
                <Text  style={{fontSize:20,fontWeight:"bold"}}>{item.productData.name}</Text> 
                <Text>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productData.price * item.quantity)}</Text>
                <Text>Loại DV</Text>
            </TouchableOpacity>
            
            <View style={{flexDirection:'row',flex:3,alignItems:'center'}}>
                <IconButton icon='plus-thick' onPress={()=>InQuanity(item.id_product,item.quantity)}/>
                <Text style={{fontSize:20}} >{item.quantity}</Text>
                <IconButton icon='minus-thick' onPress={()=>DeQuanity(item.id_product,item.quantity)}/>
            </View>
            
        </View>
        )};
        const [isDialogVisible, setDialogVisible] = useState(false);

        const showDeleteDialog = () => {
          setDialogVisible(true);
        };
      
        const hideDeleteDialog = () => {
          setDialogVisible(false);
        };
        const ConfirmDelete = ({ isVisible, onHide, onDelete }) => {
          return (
            <Portal>
              <Dialog visible={isVisible} onDismiss={onHide}>
                <Dialog.Title>Xác nhận xóa</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={onHide}>Hủy bỏ</Button>
                  <Button onPress={onDelete}>Xóa</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          );
        };
    return(
      <PaperProvider>
        <View style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems: 'center', justifyContent: 'space-between'}}>
            <Checkbox.Item label="Chọn tất" status={allchecked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setAllchecked(!allchecked);
                        setChecked(0,allchecked);
                    }}/>
            <IconButton icon='trash-can-outline' onPress={showDeleteDialog}/>
        </View>
        <ConfirmDelete isVisible={isDialogVisible} onHide={hideDeleteDialog} onDelete={Delete} />
        <FlatList
            data={data}
            renderItem={rendercart}
        />
        <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignItems: 'center', justifyContent: 'space-between',flex:1}}>
                <Text style={{fontSize:22,fontWeight:'bold',flex:2}}>Tổng tiền: </Text>
                <Text style={{fontSize:22,fontWeight:'bold',flex:4,color:"red"}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                <Button style={{justifyContent:'flex-end',flex:2, backgroundColor:"#ff4500"}} labelStyle={{color:"white"}} onPress={()=>navigation.navigate("CarttoBuy",{data:data})} >Đặt hàng</Button>
            </View>
        </View>
        </PaperProvider>
    )
}
export default Cart;