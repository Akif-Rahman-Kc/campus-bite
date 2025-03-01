import { View, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { OrderCreate } from '../apis/student-api';
import { useState } from 'react';
export default function PreparingOrderScreen() {
  
    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE ROUTES //////////////////////////////////////////////////////
    const {params:{ cart, cart_total, user_id, address}} = useRoute();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [block, setBlock] = useState(true)

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    React.useEffect(()=>{
      async function fetchData(){
        if (block) {
          let token = await SecureStore.getItemAsync('UserAccessToken')
          const response = await OrderCreate({cart, cart_total, user_id, address}, token)
          if (response.status == "failed" ) {
            navigation.navigate('Home');
          } else{
            setBlock(false)
          }
          setTimeout(()=>{
              navigation.navigate('Success');
          },3000);
        } else {
          navigation.navigate('Success');
        }
      }
      fetchData()
    },[])
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Image source={require('../assets/images/delivery.gif')} className="h-80 w-80" />
    </View>
  )
}