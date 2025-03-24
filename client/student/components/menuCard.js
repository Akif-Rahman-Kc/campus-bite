import { View, Text, Image, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function MenuCard({id,  name, image, rating, items}) {
    
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={()=>{
        navigation.navigate('Menu', {
            id, name, image, rating, items})
        }}>
        <View style={{shadowColor: "gray", shadowRadius: 10}} className="mr-6 mb-2 bg-white rounded-3xl shadow-lg">
            <Image  className="h-36 w-64 rounded-t-3xl" source={{ uri: image.path }} />
            
            <View className="px-3 pb-4 space-y-2">
                <Text className="text-lg font-bold pt-2">{name}</Text>
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../assets/images/fullStar.png')} className="h-4 w-4" />
                    <Text className="text-xs">
                        <Text className="text-green-400">{rating}</Text>
                    </Text>
                </View>
                {/* {
                    price &&
                    <View className="flex-row items-center space-x-1">
                        <Text className="text-gray-500 text-lg line-through font-bold">₹{(price * 90) / 100}</Text>
                        <Text className="text-gray-200 text-lg font-bold"> ₹{price}</Text>
                    </View>
                } */}
            </View>
        </View>
        </TouchableWithoutFeedback>
        
    )
}