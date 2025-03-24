import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function Categories({menus, activeCategory, setActiveCategory}) {
    return (
        <View className="mt-4">
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="overflow-visible"
            contentContainerStyle={{
                paddingHorizontal: 15
            }}
        >
            {
                menus?.map((menu, index)=>{
                    let isActive = index == activeCategory;
                    let btnClass = isActive ? ' bg-gray-600' : ' bg-gray-200';
                    let textClass = isActive ? ' font-semibold text-gray-800' : ' text-gray-500';
                    return(
                        <View key={index} className="flex justify-center items-center mr-9">
                            <TouchableOpacity 
                                onPress={()=> setActiveCategory(index)}
                                className={"p-1 rounded-full shadow"+ btnClass}
                            >
                                <Image style={{width: 45, height: 45, borderRadius:50}} source={{ uri: menu.items[0].image.path }} />
                            </TouchableOpacity>
                            <Text className={"text-sm "+textClass}>{menu.category}</Text>
                        </View> 
                    )
                })
            }
            
        </ScrollView>
        </View>
    )
}