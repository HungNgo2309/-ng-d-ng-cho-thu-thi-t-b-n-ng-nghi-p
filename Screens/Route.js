import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../lab3/LoginScreen";
import SignupScreen from "../lab3/SignupScreen";
import HomeScreen from "./Home";
import { Stacks } from "./Stack";
import BottomTab from "./BottomTab";
const Stack = createStackNavigator();
const Route=()=>{
    console.log("hi");
    return(
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Admin" component={LoginScreen}/>
            <Stack.Screen name="Customer" component={BottomTab}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Signup" component={SignupScreen}/>
        </Stack.Navigator>
    )
}
export default Route;