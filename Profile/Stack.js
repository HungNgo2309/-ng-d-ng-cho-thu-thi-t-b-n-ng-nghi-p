import React, { useContext } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./Home";
import ProfileDetail from "./ProfileDetail";
import ProfileHome from "./Home";
import UserChat from "../Chat/Chat";

const Stack = createStackNavigator();
 export const StackPro = () => {
        return (
        <Stack.Navigator initialRouteName="ProfileHome">
                <Stack.Screen name="ProfileHome" component={ProfileHome} />
                <Stack.Screen name="Profile" component={ProfileDetail} />
                <Stack.Screen name="Chat" component={UserChat}/>
        </Stack.Navigator>
        );
        };