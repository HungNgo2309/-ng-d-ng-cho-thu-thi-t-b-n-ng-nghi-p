import React, { useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import  {AuthStack}  from './AuthStack';
import  {LoadingIndicator}  from './LoadingIndicator';
import {AuthenticatedUserContext} from '../providers';
import BottomTab from '../Screens/BottomTab';
import { Stacks } from '../Screens/Stack';
import { AppStack } from './AppStack';

export const RootNavigator = () => {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    //console.log("user1123"+user);   
    const [isLoading, setIsLoading] = useState(true);
    const [role,setRole]=useState("");
    useEffect(() => {
        //console.log("jj");
        const unsubscribeAuthStateChanged = auth().onAuthStateChanged(
            authenticatedUser => {
                //console.log("use"+ authenticatedUser);
                authenticatedUser ? setUser(authenticatedUser) : setUser(null);
                //console.log("authenticatedUser: ha  ", authenticatedUser);        
                setIsLoading(false);
            }    
        );
            // unsubscribe auth listener on unmount
        return unsubscribeAuthStateChanged;
        }, [user]);
        
    if (isLoading) {
        return <LoadingIndicator />;
    }
    //console.log("user1123"+user);
    return (
    <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
    );  
};