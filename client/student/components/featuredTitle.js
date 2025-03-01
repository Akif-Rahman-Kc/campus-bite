import { View, Text } from 'react-native'
import React from 'react'
import DishRow from './dishRow';
import ComboRow from './comboRow';

export default function FeaturedTitle({menu, combo, cart, user_id, refresh, setRefresh}) {
  return (
    <View className="p-2">
        <View className="bg-gray-900 rounded py-1 px-3">
            <Text className="text-xl font-bold text-white">{menu.name}</Text>
        </View>
        <View className="mt-5">
            {
                combo ?
                    <ComboRow
                        key={menu._id}
                        id={menu._id}
                        old_price={menu.old_price}
                        offer_price={menu.offer_price}
                        items={menu.items}
                        name={menu.name}
                        image={menu.image}
                        cart={cart}
                        user_id={user_id}
                        refresh={refresh}
                        setRefresh={setRefresh}
                    />
                :
                    menu.items.map(item => {
                        return (
                            <DishRow
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                                rating={item.rating}
                                rating_count={item.rating_count}
                                stock={item.stock}
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