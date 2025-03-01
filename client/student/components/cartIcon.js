import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function CartIcon({cart, cart_total}) {
  const navigation = useNavigation();
  
  if(cart.length <= 0) return null;
  return (
    <View className="absolute bottom-16 mb-2 w-full z-50">
        <TouchableOpacity 
          style={{backgroundColor: "#ffc803"}}
          onPress={()=> navigation.navigate('Cart', cart)}
          className="flex-row justify-between items-center mx-5 rounded-full p-4 py-1.5 shadow-lg">
            <View className="p-2 px-4 rounded-full" style={{backgroundColor: "#f0db92"}}>
              <Text className="font-extrabold text-gray-900 text-lg">{cart.length}</Text>
            </View>
            
            <Text className="flex-1 text-center font-extrabold text-gray-900 text-lg">View Cart</Text>
            <Text className="font-extrabold text-gray-900 text-lg">₹{cart_total}</Text>
        
        </TouchableOpacity>
    </View>
  )
}