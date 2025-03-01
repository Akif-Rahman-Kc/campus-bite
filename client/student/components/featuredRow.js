import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import MenuCard from './menuCard';
import { useNavigation } from '@react-navigation/native';

export default function FeatureRow({menus, combo}) {

    const navigation = useNavigation()

    return (
        <View>
            <View className="flex-row justify-between items-center px-4">
                <View>
                    <Text className="font-bold text-white text-xl">{combo ? "Offers" : "Menus"}</Text>
                    {/* <Text className="text-gray-500 text-xs">
                        {description}
                    </Text> */}
                </View>
                
                <TouchableOpacity onPress={()=>{ combo ? navigation.navigate('AllCombo') : navigation.navigate('AllMenu') }}>
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
                    menus.map(menu=>{
                        return (
                            <MenuCard
                            key={menu._id}
                            id={menu._id}
                            image={menu.image}
                            name={menu.name}
                            rating={menu.rating}
                            rating_count={menu.rating_count}
                            old_price={menu.old_price}
                            offer_price={menu.offer_price}
                            items={menu.items}
                        />    
                        )
                    })
                }           
            </ScrollView>
        </View>
    )
}