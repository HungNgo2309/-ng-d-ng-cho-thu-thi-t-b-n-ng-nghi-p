import React, { useEffect, useState,useContext, useCallback } from "react";
import { FlatList, Image, ScrollView, TouchableOpacity, View,Modal, StyleSheet, Alert } from "react-native";
import { Button, IconButton, Text,Provider, Portal, TextInput } from "react-native-paper";
import myProductsData from "../Data/Product";
import firestore from '@react-native-firebase/firestore';
import  {AuthenticatedUserContext}  from '../providers';
import { AirbnbRating } from "react-native-ratings";

const ProductDetail=({route,navigation})=>{
    const { user } = useContext(AuthenticatedUserContext);
    const {product}=route.params;
    const [pcate,setPcate]=useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [rent,setRent]=useState(true);
    const Products = firestore().collection('Product');
    const Profile = firestore().collection('Profile');
    const [quantity, setQuantity] = useState(1);
    const[day,setDay]=useState(1);
    const[hour,setHour]=useState(0);
    const [rating, setRating] = useState(0);
    const [review,setReview] = useState("");
    const [listreview,setListReview]=useState([]);
    const Reviews = firestore().collection('Review');
    const [loading,setLoading]=useState(false);
    const handleRatingChange = (value) => {
      setRating(value);
    };

    const handleSubmit = () => {
      // Xử lý đánh giá, có thể gửi đến máy chủ hoặc thực hiện hành động khác tùy thuộc vào yêu cầu của bạn
     
      Reviews.add({
        id_user: user.uid,
        id_product: product.id,
        context:review,
        star:rating,
      });
      setReview("");
      setRating(0);
      setLoading(!loading);
    };
    useEffect(() => {
        Products.where('Idcategory', '==', product.Idcategory)
          .where('id', '!=', product.id)
          .onSnapshot((lst) => {
            if (lst) {
              const list = [];
              lst.forEach((doc) => list.push(doc.data()));
              setPcate(list);
            } else {
              // Xử lý khi lst là null (không có dữ liệu trả về)
              //console.log('Không có dữ liệu trả về từ truy vấn.');
            }
          });
      }, []);
    
      async function AddCart() {
        const Cart = firestore().collection('Cart');    
      
        // Kiểm tra xem đã có bản ghi nào có id_user và id_product nhất định hay chưa
        const existingRecord = await Cart
          .where('id_user', '==', user.uid)
          .where('id_product', '==', product.id)
          .get();
      
        if (!existingRecord.empty) {
          // Nếu đã tồn tại, cập nhật số lượng
          const firstDoc = existingRecord.docs[0];
          Cart.doc(firstDoc.id).update({
            quantity: firstDoc.data().quantity + 1,
          });
        } else {
          // Nếu chưa tồn tại, thêm mới
          Cart.add({
            id_user: user.uid,
            id_product: product.id,
            quantity: 1,
          });
          Alert.alert("Đã thêm vào giỏ hàng");
        }
      };
      async function AddRent() {
        // const Rent = firestore().collection('Rent'); 
        //   // Nếu chưa tồn tại, thêm mới
        //   Rent.add({
        //     id_user: user.uid,
        //     id_product: product.id,
        //     day:day,
        //     hour:hour,
        //   });
        if(rent)
        {
          navigation.navigate("RentDetail", {
            product: {
              id_user: user.uid,
              id_product: product.id,
              day:day,
              hour:hour,
              name:product.name,
              rent:product.rent,
              img:product.img,
              quantity:quantity,
              id:null,
              datetime:null,
            },
          });
        }
        else{
          navigation.navigate("BuyDetail", {
            product: {
              id_user: user.uid,
              id_product: product.id,
              name:product.name,
              price:product.price,
              img:product.img,
              quantity:quantity,
              id:null,
            },
          });
        }
          setModalVisible(!modalVisible)
        };
      
      
    const renderproduct=({item})=>{
        return(
            <TouchableOpacity>
                 <Image style={{width:200,height:200}} source={{uri:item.img}} />
                 <View style={{alignItems:'center'}}>
                    <Text>{item.name}</Text>
                    <Text>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
                 </View>
            </TouchableOpacity>
        )}
    
    function Review()
    {
      return(
        <View style={{marginLeft:10}}>
          <Text style={{fontSize:25,fontWeight:'700'}}>Đánh giá:</Text>
          <AirbnbRating
            count={5}
            reviews={['Kém', 'Tạm được', 'Bình thường', 'Tốt', 'Tuyệt vời']}
            defaultRating={0}
            size={24}
            onFinishRating={handleRatingChange}
          />
          <TextInput
            style={{marginLeft:10,marginRight:10}}
            placeholder="Ý kiến của bạn"
            value={review}
            mode="outlined"
            multiline={true}
            onChangeText={setReview}
          />
          <TouchableOpacity onPress={handleSubmit} style={{backgroundColor:"green",alignSelf:'center',margin:5}}>
            <Text style={{color:'white'}}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
      )
    }
   // Hàm để lấy thông tin username từ id_user
const getUsername = async (id_user) => {
  try {
    const profileRef = firestore().collection('Profile').doc(id_user);
    const profileDoc = await profileRef.get();

    if (profileDoc.exists) {
      const profileData = profileDoc.data();
      return profileData.username;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin username:', error);
    throw error;
  }
};

// Const renderReview
const renderReview = ({ item }) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      <View>
        <Text style={{color:"red"}}>Khách hàng :{item.username}</Text>
        <AirbnbRating count={5} defaultRating={item.star} size={24} />
      </View>
      <Text>{item.context}</Text>
    </View>
  );
};

// Sử dụng hàm getUsername trong useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      const reviewsSnapshot = await firestore().collection('Review').where("id_product", '==', product.id).get();
      const reviewsData = reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Kết hợp dữ liệu từ collection "Review" và "Profile"
      const mergedReviewData = reviewsData.map(async (reviewItem) => {
        const username = await getUsername(reviewItem.id_user);
        return { ...reviewItem, username: username };
      });

      // Đợi tất cả các promises hoàn thành và in ra kết quả
      Promise.all(mergedReviewData)
        .then((results) => {
          //console.log(results);
          setListReview(results);
        })
        .catch((error) => {
          console.error('Lỗi khi kết hợp dữ liệu:', error);
        });
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  fetchData();
}, [loading]);

    
    return(
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
                <View style={{flexDirection:'row'}}>
                    <Button mode="contained" style={{alignSelf:'center'}} onPress={() => {setModalVisible(true);setRent(false);}}>
                        Buy Now
                    </Button>
                    <Button mode="outlined" style={{alignSelf:'center'}} onPress={() => {setModalVisible(true);setRent(true);}}>
                        Rent Now
                    </Button>
                    <IconButton icon='cart' onPress={()=>AddCart()}/>     
                </View>
            </View>
            <View style={{margin:10}}>
                <Text style={{fontSize:25,fontWeight:"700"}}>Mô tả</Text>
                
                    <Text>{product.description}
                    </Text>
                
            </View>
            {Review()}
            <View style={{margin:10}}>
                <FlatList
                  data={listreview}
                  renderItem={renderReview}
                  keyExtractor={item=>item.id.toString()}
                />
            </View>
           
            <View>
                <Text style={{fontSize:25,fontWeight:'700',marginLeft:10}}>Các sản phẩm liên quan</Text>
                <FlatList
                horizontal
                renderItem={renderproduct}
                data={pcate}
                keyExtractor={item=>item.id.toString()}
            />
            </View>
        </View>
           {/* Modal */}
      <Provider>
        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:20 }}>
                <Text>Chọn số lượng:</Text>
                <IconButton icon='plus-thick' onPress={() => setQuantity(quantity + 1)} />
                <TextInput value={quantity.toString()} keyboardType="number-pad" onChangeText={(text) => setQuantity(parseInt(text) || 0)} />
                <IconButton icon='minus-thick'  onPress={() => {
                          // Kiểm tra nếu giá trị day không phải 0 thì mới giảm
                          if (quantity > 0) {
                            setQuantity(quantity - 1);
                          }
                        }}
                        disabled={quantity === 0} />
              </View>
              {rent?(
              <View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:20  }}>
                <Text>Chọn số ngày thuê:</Text>
                <IconButton icon='plus-thick' onPress={() => setDay(day + 1)} />
                <TextInput value={day.toString()} keyboardType="number-pad" onChangeText={(text) => setDay(parseInt(text) || 0)} />
                <IconButton icon='minus-thick' onPress={() => {
                  // Kiểm tra nếu giá trị day không phải 0 thì mới giảm
                  if (day > 0) {
                    setDay(day - 1);
                  }
                }}
                disabled={day === 0} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:20 }}>
                <Text>Chọn số giờ thuê:</Text>
                <IconButton icon='plus-thick' onPress={() => setHour(hour + 1)} />
                <TextInput value={hour.toString()} keyboardType="number-pad" onChangeText={(text) => setHour(parseInt(text) || 0)} />
                <IconButton icon='minus-thick'  onPress={() => {
                          // Kiểm tra nếu giá trị day không phải 0 thì mới giảm
                          if (hour > 0) {
                            setHour(hour - 1);
                          }
                        }}
                        disabled={hour === 0} />
              </View>
              </View>
              ):null}
              <View style={{flexDirection:'row'}}>
                <Button onPress={()=>AddRent()}>{
                  rent?`Thuê ngay`:`Mua ngay`
                }</Button>
                <Button onPress={() => setModalVisible(!modalVisible)}>Đóng</Button>
              </View>
              </View>
            </View>
          </Modal>
        </Portal>
      </Provider>
        </ScrollView>
    )
}
export default ProductDetail;
const styles= StyleSheet.create(
    {
        shadow:{
            backgroundColor:'white',
            flexDirection:'row'
            ,margin:10,
            shadowColor: '#000',
        },
        modalBackground: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu làm mờ
        },
        modalView: {
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 35,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
        root: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        text: {
          fontSize: 17,
          marginTop: 20,
        },
    }
 )