import { View, Text } from 'react-native'
import React from 'react'
import DishRow from './dishRow';
import ComboRow from './comboRow';

export default function FeaturedTitle({menu, cart, user_id, refresh, setRefresh}) {
  return (
    <View className="p-2">
        <View className="bg-gray-900 rounded py-1 px-3">
            <Text className="text-xl font-bold text-white">{menu.category}</Text>
        </View>
        <View className="mt-5">
            {
                menu.items.map(item => {
                    return (
                        <DishRow
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            image={item.image}
                            rating={item.rating}
                            stock={item.status === "IN STOCK" ? true : false}
                            cart={cart}
                            user_id={user_id}
                            refresh={refresh}
                            setRefresh={setRefresh}
                        />
                    )
                })
            }
        </View>
    </View>
  )
}