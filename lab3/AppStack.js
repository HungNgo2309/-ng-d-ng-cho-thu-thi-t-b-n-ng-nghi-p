import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import BottomTab from "../Screens/BottomTab";
import { AuthenticatedUserContext } from "../providers";
import firestore from '@react-native-firebase/firestore';
import Router from "../Admin/StackHome";
import MyTabs from "../Admin/TabAdmin";

 const Stack = createStackNavigator();
 export const AppStack = () => {
        const Profile = firestore().collection('Profile');
        const { user, setUser } = useContext(AuthenticatedUserContext);
        const [role,setRole]=useState("");
        console.log(user.uid);
        useEffect(()=>{
                const fetchProfile = async () => {
                    try {
                                console.log("hihi");
                            const profileSnapshot = await Profile.doc(user.email).get();
                            if (profileSnapshot.exists) {
                                // Nếu tài liệu tồn tại, cập nhật state với dữ liệu từ tài liệu
                                const data = profileSnapshot.data();
                                setRole(data.role);
                                console.log(data.role);
                        
                    }
                    } catch (error) {
                        console.error("Lỗi khi truy cập thông tin hồ sơ:", error);
                    }
                };
                fetchProfile();  
            },[user]);
            
        return (
        <Stack.Navigator initialRouteName={role} screenOptions={()=>({headerShown:false,} )}>
               {
                role==="admin"?<Stack.Screen name="admin" component={MyTabs} />:
                <Stack.Screen name="customer" component={BottomTab} />
               } 
                
        </Stack.Navigator>
        );
        };