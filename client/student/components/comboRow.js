import { View, Text, TouchableOpacity, Image, Modal } from 'react-native'
import React, {useState} from 'react'
import * as Icon from "react-native-feather";
import { UserCartCreate } from '../apis/student-api';
import * as SecureStore from 'expo-secure-store';

export default function ComboRow({id, old_price, offer_price, items, name, image, cart, user_id, refresh, setRefresh}) {

    ///////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [quantity, setQuantity] = useState(0)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)

    ///////////////////////////////////////////////////// USE EFFECT //////////////////////////////////////////////////////
    React.useEffect(() => {
        if (id && cart.length) {
            const cart_obj = cart.find((obj) => obj.item_id.toString() === id.toString())
            if (cart_obj) {
                setQuantity(cart_obj.quantity)
            }else{
                setQuantity(0)
            }
        }
    },[id, refresh, cart])

    ////////////////////////////////////////////////////// HANDLE QUANTITY //////////////////////////////////////////////////////
    const handleQuantity = async (count)=>{
        let token = await SecureStore.getItemAsync('UserAccessToken')
        setReloadModalVisible(true)
        const response = await UserCartCreate({user_id, item_id:id, item_name:name, item_image:image.path, item_price:offer_price, count}, token)
        if (response.status == "success") {
            setRefresh(!refresh)
        }
        setTimeout(() => {
            setReloadModalVisible(false)
        }, 1000);
    }

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        <>
            <View style={{shadowColor: "#555", shadowRadius: 15}} className="flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-3 mx-1">
                <View className="flex flex-1 space-y-3">
                    {
                        items?.map(item => {
                            return (
                                <View key={item._id} className="flex flex-row justify-between px-4 py-1">
                                    <View className="flex-row items-center">
                                        <Image source={{ uri: item.image.path }} className="h-14 w-14 rounded" />
                                        <Text className="ml-2 text-lg font-bold">{item.name}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-lg text-right font-bold">{item.quantity}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View className="flex-row pl-3 justify-between items-center">
                        <View className="flex-row items-center space-x-1">
                            <Text className="text-gray-600 text-xl line-through font-bold">₹{old_price}</Text>
                            <Text className="text-black text-xl font-bold"> ₹{offer_price}</Text>
                        </View>
                        <View className="flex-row items-center">
                            {
                                quantity > 0 ?
                                <TouchableOpacity 
                                    onPress={() => handleQuantity(-1)}
                                    className="p-1 rounded-full" 
                                    style={{backgroundColor: "#222222"}}>
                                    <Icon.Minus strokeWidth={2} height={20} width={20} stroke="white" />
                                </TouchableOpacity>
                                :
                                <View className="p-1 rounded-full bg-gray-400">
                                    <Icon.Minus strokeWidth={2} height={20} width={20} stroke="white" />
                                </View>
                            }
                            <Text className="px-3">
                                {quantity}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => handleQuantity(1)} 
                                className="p-1 rounded-full" 
                                style={{backgroundColor: "#222222"}}>
                                <Icon.Plus strokeWidth={2} height={20} width={20} stroke="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <Modal
                visible={reloadModalVisible}
                transparent={true}
            >
                <View style={{ backgroundColor:'rgba(255, 255, 255, 0.2)' }} className="flex-1 justify-center items-center bg-gray-500">
                    <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                        <Image source={require('../assets/images/logo-reload.gif')} className="h-20 w-20" />
                    </View>
                </View>
            </Modal>
        </>
    )
}