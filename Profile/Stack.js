import React, { useContext } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./Home";
import ProfileDetail from "./ProfileDetail";
import ProfileHome from "./Home";

const Stack = createStackNavigator();
 export const StackPro = () => {
        return (
        <Stack.Navigator initialRouteName="ProfileHome" screenOptions={()=>({headerShown:false,} )}>
                <Stack.Screen name="ProfileHome" component={ProfileHome} />
                <Stack.Screen name="Profile" component={ProfileDetail} />
        </Stack.Navigator>
        );
        };