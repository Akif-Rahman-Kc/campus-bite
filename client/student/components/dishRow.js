import { View, Text, TouchableOpacity, Image, Modal, ImageBackground, ToastAndroid } from 'react-native'
import React, {useState} from 'react'
import * as Icon from "react-native-feather";
import * as SecureStore from 'expo-secure-store';
import { UserCartCreate } from '../apis/student-api';
import { useFocusEffect } from '@react-navigation/native';

export default function DishRow({name, description, id, price, image, rating, rating_count, cart, user_id, refresh, setRefresh, stock}) {

    ///////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [quantity, setQuantity] = useState(0)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)

    ///////////////////////////////////////////////////// USE EFFECT //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            if (id && cart.length) {
                const cart_obj = cart.find((obj) => obj.item_id.toString() === id.toString())
                if (cart_obj) {
                    setQuantity(cart_obj.quantity)
                }else{
                    setQuantity(0)
                }
            }else{
                setQuantity(0)
            }
        },[id, refresh, cart])
    );

    ////////////////////////////////////////////////////// HANDLE QUANTITY //////////////////////////////////////////////////////
    const handleQuantity = async (count)=>{
        let token = await SecureStore.getItemAsync('UserAccessToken')
        setReloadModalVisible(true)
        const response = await UserCartCreate({user_id, item_id:id, item_name:name, item_image:image.path, item_price:price, count}, token)
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
            {
                stock ?
                <View style={{shadowColor: "#555", shadowRadius: 15}} className="flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-2 mx-1">
                    <Image className="rounded-3xl" style={{height: 100, width: 100}} source={{ uri: image.path }}/>
                    <View className="flex flex-1 space-y-2">
                        <View className="pl-3">
                            <Text className="text-xl">{name}</Text>
                            <Text className="text-gray-700">{description}</Text>
                        </View>
                        <View className="pl-3 flex-row items-center space-x-1">
                            <Image source={require('../assets/images/fullStar.png')} className="h-4 w-4" />
                            <Text className="text-xs">
                                <Text className="text-green-700">{rating}</Text>
                                <Text className="text-gray-700"> ({rating_count})</Text>
                            </Text>
                        </View>
                        <View className="flex-row pl-3 justify-between items-center">
                            <Text className="text-gray-700 text-lg font-bold">
                                ₹{price}
                            </Text>
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
                :
                <View style={{shadowColor: "#555", shadowRadius: 15, backgroundColor:"#abb7c7"}} className="flex-row items-center p-3 rounded-3xl shadow-2xl mb-2 mx-1">
                    <View style={{height: 100, width: 100}}>
                        <ImageBackground
                            source={{ uri: image.path }}
                            style={{flex: 1, resizeMode: 'cover', justifyContent: 'center', height: 100, width: 100, borderRadius:20, overflow: 'hidden'}}
                        >
                            <View style={{height: 100, width: 100, backgroundColor:'rgba(100, 100, 150, 0.6)'}} className="flex-1 items-center justify-center">
                                <Text></Text>
                            </View>
                        
                        </ImageBackground>
                    </View>
                    <View className="flex flex-1 space-y-2">
                        <View className="pl-3">
                            <Text className="text-xl">{name}</Text>
                            <Text className="text-gray-700">{description}</Text>
                        </View>
                        <View className="pl-3 flex-row items-center space-x-1">
                            <Image style={{ tintColor:"gray" }} source={require('../assets/images/fullStar.png')} className="h-4 w-4" />
                            <Text className="text-xs">
                                <Text className="text-green-700">{rating}</Text>
                                <Text className="text-gray-700"> ({rating_count})</Text>
                            </Text>
                        </View>
                        <View className="flex-row pl-3 justify-between items-center">
                            <Text className="text-gray-700 text-lg font-bold">
                                ₹{price}
                            </Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={() => {
                                    ToastAndroid.showWithGravity(
                                        'Item Not Available Now',
                                        ToastAndroid.SHORT,
                                        ToastAndroid.CENTER,
                                    );
                                }} className="p-1 rounded-full bg-gray-500">
                                    <Icon.Minus strokeWidth={2} height={20} width={20} stroke="white" />
                                </TouchableOpacity>
                                <Text className="px-3">
                                    {quantity}
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    ToastAndroid.showWithGravity(
                                        'Item Not Available Now',
                                        ToastAndroid.SHORT,
                                        ToastAndroid.CENTER,
                                    );
                                }} className="p-1 rounded-full bg-gray-500">
                                    <Icon.Plus strokeWidth={2} height={20} width={20} stroke="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            }
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