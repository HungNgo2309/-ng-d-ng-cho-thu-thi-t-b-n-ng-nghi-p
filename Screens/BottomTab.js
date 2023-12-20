import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { Stacks } from "./Stack";
import Cart from "./Cart";
import Home from "../Profile/Home";
import { StackPro } from "../Profile/Stack";
import History from "../History/History";
const Tab = createBottomTabNavigator();

const BottomTab = ()=>{
    return(
        <Tab.Navigator initialRouteName="HomeApp" screenOptions={()=>({headerShown:false,tabBarActiveBackgroundColor:"#b3ccff"} )} >
            <Tab.Screen name="HomeApp" component={Stacks} 
            options={{
                tabBarIcon: ({ color, size }) => (
                <FontAwesome name="home"  size={size}/>
                ),
            }}/>
            <Tab.Screen name="Cart" component={Cart} 
            options={{
                tabBarIcon: ({ color, size }) => (
                <FontAwesome name="shopping-cart"  size={size}/>
                ),
            }}/>
             <Tab.Screen name="History" component={History} 
            options={{
                tabBarIcon: ({ color, size }) => (
                <FontAwesome name="history"  size={size}/>
                ),
            }}/>
            <Tab.Screen name="User" component={StackPro} 
            options={{
                tabBarIcon: ({ color, size }) => (
                <FontAwesome name="user"  size={size}/>
                ),
            }}/>
        </Tab.Navigator>
    )
}
export default BottomTab;