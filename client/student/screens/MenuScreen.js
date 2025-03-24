import { View, Text, StatusBar, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import DishRow from '../components/dishRow';
import * as Icon from "react-native-feather";
import CartIcon from '../components/cartIcon';
import ComboRow from '../components/comboRow';
import * as SecureStore from 'expo-secure-store';
import { StudentAuthApi, StudentDetails, UserDetails } from '../apis/student-api';
import { useState } from 'react';

export default function MenuScreen() {
    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE ROUTES //////////////////////////////////////////////////////
    const {params: {id,  name, image, rating, items}} = useRoute();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [refresh, setRefresh] = useState(false)
    //UserDetails
    const [user, setUser] = useState(null)
    const [cart, setCart] = useState([])
    const [cartTotal, setCartTotal] = useState(null)
    
    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                if (token) {
                    const response = await StudentAuthApi(token)
                    if (!response.auth) {
                        if (response.message) {
                            Alert.alert('Blocked!', response.message, [
                                {text: 'OK', onPress: () => navigation.navigate('Login')},
                            ]);
                        } else {
                            navigation.navigate('Login')
                        }
                    } else {
                        setUser(response.user_details)
                    }
                } else {
                    navigation.navigate('Login')
                }
            }
            fetchData()
        }, [])
    );

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    React.useEffect(() => {
        async function fetchData(){
            let token = await SecureStore.getItemAsync('UserAccessToken')
            if (user?._id) {
                const response = await StudentDetails(user._id, token)
                if (response.status == "success" ) {
                    setCart(response.student.cart)
                    const total = response.student.cart.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.item_total_price;
                    }, 0);
                    setCartTotal(total)
                }else{
                    alert(response.message ? response.message : "Please go to the back and try agian")
                }
            }
        }
        fetchData()
    },[user, refresh])

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        <>
            <CartIcon cart={cart} cart_total={cartTotal}/>
            <StatusBar barStyle="light" />
            <ScrollView  >
                <View className="relative">
                    <Image className="w-full h-72" source={{ uri: image.path }} />
                    <TouchableOpacity 
                        onPress={()=>navigation.goBack()} 
                        className="absolute top-14 left-4 bg-gray-50 p-2 rounded-full shadow">
                        <Icon.ArrowLeft strokeWidth={3} stroke={"#222222"} />
                    </TouchableOpacity>
                </View>
                <View 
                    style={{borderTopLeftRadius: 40, borderTopRightRadius: 40, shadowColor: '#222', shadowOffset: { width: 0, height: 2 }, shadowOpacity:0.4, shadowRadius: 4, elevation: 45}}
                    className="bg-white -mt-12 pt-6">
                    <View className="px-5">
                        <Text className="text-3xl font-bold">{name}</Text>
                        {/* copy this code from restaurant card */}
                        <View className="flex-row space-x-2 my-1">
                            <View className="flex-row items-center space-x-1">
                                <Image 
                                    source={require('../assets/images/fullStar.png')} 
                                    className="h-4 w-4" />
                                <Text className="text-xs">
                                    <Text className="text-green-700 font-bold">{rating}</Text>
                                </Text>
                            </View>
                            {/* {
                                offer_price &&
                                <View className="flex-row items-center space-x-1">
                                    <Text className="text-gray-600 text-lg line-through font-bold">₹{old_price}</Text>
                                    <Text className="text-black text-lg font-bold"> ₹{offer_price}</Text>
                                </View>
                            } */}
                        </View>
                    </View>
                </View>
                {
                    items.length > 0 ?
                    <View style={{ minHeight:480 }} className="pb-36 bg-white">
                        <Text className="px-4 py-4 text-2xl font-bold">Items</Text>
                        {/* dishes */}
                        {
                            items.map(item=>{
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
                                        user_id={user?._id}
                                        refresh={refresh}
                                        setRefresh={setRefresh}
                                    />
                                )
                            })
                        }
                    </View>
                    :
                    <View style={{ minHeight:480 }} className="items-center bg-white py-20">
                        <Icon.XCircle height="100" width="100" strokeWidth={2} stroke="#b0aeae"/>
                        <Text style={{ fontWeight: '900', color:'#b0aeae' }} className="text-xl">No Items</Text>
                    </View>
                }
            </ScrollView>
        </>
    )
}