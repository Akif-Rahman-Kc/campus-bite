import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import MenuCard from './menuCard';
import { useNavigation } from '@react-navigation/native';

export default function FeatureRow({menus}) {

    const navigation = useNavigation()

    return (
        <View>
            <View className="flex-row justify-between items-center px-4">
                <View>
                    <Text className="font-bold text-black text-xl">Menus</Text>
                    {/* <Text className="text-gray-500 text-xs">
                        {description}
                    </Text> */}
                </View>
                
                <TouchableOpacity onPress={()=>{ navigation.navigate('AllMenu') }}>
                    <Text style={{color: "#999999"}} className="font-semibold">See All</Text>
                </TouchableOpacity>
            </View>

        

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal:15,
                }}
                className="overflow-visible py-5"
            >
                {
                    menus.map((menu, index)=>{
                        return (
                        <MenuCard
                            key={index}
                            id={menu.items[0]._id}
                            image={menu.items[0].image}
                            name={menu.category}
                            rating={menu.items[0].rating}
                            items={menu.items}
                        />    
                        )
                    })
                }           
            </ScrollView>
        </View>
    )
}