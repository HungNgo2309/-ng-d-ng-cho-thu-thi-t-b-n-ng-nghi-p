import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, HelperText, IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { AuthenticatedUserContext } from '../providers';
import { Alert } from "react-native";

const ProfileDetail = ({navigation}) => {
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const { user } = useContext(AuthenticatedUserContext);
    const Profile = firestore().collection('Profile');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileSnapshot = await Profile.doc(user.uid).get();

                if (profileSnapshot.exists) {
                    // Nếu tài liệu tồn tại, cập nhật state với dữ liệu từ tài liệu
                    
                    const data = profileSnapshot.data();
                    setUsername(data.username);
                    setPhone(data.phone);
                    setAddress(data.address);
                } else if (!loading) {
                    // Nếu đang không trong quá trình loading, thì mới set thông tin profile thành rỗng
                    setLoading(true);
                    await Profile.doc(user.uid).set({
                        username: "",
                        phone: "",
                        address: "",
                    });
                 }
            } catch (error) {
                console.error("Lỗi khi truy cập thông tin hồ sơ:", error);
            }
        };

        fetchProfile();
    }, [user.uid, loading]);

    const updateProfile = async () => {
        try {
            // Cập nhật thông tin trong tài liệu
            await Profile.doc(user.uid).update({
                username: username,
                phone: phone,
                address: address,
            });
            setLoading(!loading);
            Alert.alert("Đã cập nhật thông tin hồ sơ.");
            navigation.navigate("ProfileHome");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin hồ sơ:", error);
        }
    };
    const hasNameErrors = () => {
        return username.trim() === "";
      };
      
      const hasAddressErrors = () => {
        return address.trim() === "";
      };
      
      const hasPhoneErrors = () => {
        return phone.trim() === "" || isNaN(phone) || phone.trim().length !== 10;
    };
    
    console.log(phone.trim().length);
    return (
        <View>
            <IconButton style={{alignSelf:'flex-start',position:'absolute'}} icon="keyboard-backspace"  onPress={()=>navigation.goBack()}/>
            <Text style={{fontSize:25,fontWeight:'bold',textAlign:'center'}}>Thông tin cá nhân</Text>
            <TextInput label="Họ và tên" mode="outlined" on placeholder="Họ và tên" value={username} onChangeText={setUsername} />
            <HelperText type="error" visible={hasNameErrors()}>
                Họ và tên không được để trống !
            </HelperText>
            <TextInput label="Địa chỉ" mode="outlined" placeholder="Địa chỉ nhận hàng" value={address} onChangeText={setAddress} />
            <HelperText type="error" visible={hasAddressErrors()}>
                Địa chỉ không được để trống !
            </HelperText>
            <TextInput label="Số điện thoại" keyboardType="number-pad" maxLength={10} mode="outlined" placeholder="Nhập số điện thoại liên hệ của bạn" value={phone} onChangeText={setPhone} />
            <HelperText type="error" visible={hasPhoneErrors()}>
                Số điện thoại không hợp lệ !
            </HelperText>
            <Button onPress={updateProfile}>Cập nhật</Button>
        </View>
    )
}

export default ProfileDetail;
