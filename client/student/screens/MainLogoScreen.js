import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function MainLogoScreen() {

  const navigation = useNavigation();

  useEffect(()=>{
      setTimeout(()=>{
          navigation.navigate('Register');
      },2000);
  },[])

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Image source={require('../assets/images/logo.png')} className="h-32 w-32" />
      <Text style={{ fontSize:25 }} className="font-extrabold mt-1.5">CAFE ARRIVAL</Text>
    </View>
  )
}