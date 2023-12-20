import React, { useContext } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./Home";
import ProductDetail from "./ProductDetail";
import RentDetail from "./RentDetail";
import BuyDetail from "./BuyDetail";
import EditRent from "../History/EditRent";
import SearchDetail from "./SearchDetail";
import EditBuy from "../History/EditBuy";
import CartToBuy from "./CartToBuy";
const Stack = createStackNavigator();
 export const Stacks = () => {
        return (
        <Stack.Navigator initialRouteName="Home" screenOptions={()=>({headerShown:false,} )}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="ProductDetail" component={ProductDetail}/>
                <Stack.Screen name="RentDetail" component={RentDetail}/>
                <Stack.Screen name="EditRent" component={EditRent}/>
                <Stack.Screen name="EditBuy" component={EditBuy}/>
                <Stack.Screen name="BuyDetail" component={BuyDetail}/>
                <Stack.Screen name="SearchDetail" component={SearchDetail}/>
                <Stack.Screen name="CarttoBuy" component={CartToBuy}/>
        </Stack.Navigator>
        );
        };