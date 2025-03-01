import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView, Alert, Modal } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import * as Icon from "react-native-feather";
import * as SecureStore from 'expo-secure-store';
import { CartStockCheck, UserAuthApi, UserCartDelete, UserDetails } from '../apis/student-api';

export default function CartScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE ROUTES //////////////////////////////////////////////////////
    const {params} = useRoute();
    const total = params.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.item_total_price;
    }, 0);

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [refresh, setRefresh] = useState(false)
    //UserDetails
    const [user, setUser] = useState(null)
    const [cart, setCart] = useState(params)
    const [cartTotal, setCartTotal] = useState(total)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)
    //Error
    const [loadError, setLoadError] = useState([]);

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                if (token) {
                    const response = await UserAuthApi(token)
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
            if (user?.id) {
                const response = await UserDetails(user.id, token)
                if (response.status == "success" ) {
                    setCart(response.user.cart)
                    const total = response.user.cart.reduce((accumulator, currentValue) => {
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

    ////////////////////////////////////////////////////// REMOVE CART ITEM //////////////////////////////////////////////////////
    const removeCartItem = async (cart_id) => {
        let token = await SecureStore.getItemAsync('UserAccessToken')
        if (user?.id) {
            setReloadModalVisible(true)
            const response = await UserCartDelete(user.id, cart_id, token)
            setReloadModalVisible(false)
            if (response.status == "success" ) {
                setRefresh(!refresh)
            }else{
                alert(response.message ? response.message : "Please go to the back and try agian")
            }
        }
    }

    ////////////////////////////////////////////////////// PLACE ORDER //////////////////////////////////////////////////////
    const placeOrder = async () => {
        let token = await SecureStore.getItemAsync('UserAccessToken')
        if (user?.id) {
            setReloadModalVisible(true)
            const response = await CartStockCheck(user.id, token)
            setReloadModalVisible(false)
            if (response.status == "success" ) {
                if (response.no_stock_item != "") {
                    Alert.alert('Stock Out!', `${response.no_stock_item} not available now please remove that item`, [
                        {text: 'OK', onPress: () => console.log("ok")},
                    ]);
                } else {
                    Alert.alert('Note', 'Now only available Cash on Delivery', [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {text: 'Order Placed', onPress: () => ok()},
                    ]);
                    async function ok(){
                        navigation.navigate('PreparingOrder', {cart, cart_total:cartTotal, user_id:user?.id, address:user?.address.landmark + ", " + user?.address.locality + ", " + user?.address.district})
                    }
                }
            }else{
                alert(response.message ? response.message : "Please go to the back and try agian")
            }
        }
    }

    ////////////////////////////////////////////////////// CHECK IF ID EXISTS //////////////////////////////////////////////////////
    const checkIfIdExists = (idToCheck) => {
        return loadError.some(itemId => itemId === idToCheck);
    };

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <View className=" bg-white flex-1 pt-2">
                {/* top button */}
                <View className="relative py-4 shadow-sm">
                    <TouchableOpacity 
                        style={{backgroundColor: "#222222"}} 
                        onPress={navigation.goBack} 
                        className="absolute z-10 rounded-full p-1 shadow top-5 left-2">
                        <Icon.ArrowLeft strokeWidth={3} stroke="white" />
                    </TouchableOpacity>
                    <View>
                        <Text className="mt-2 text-center font-extrabold text-xl">Your cart</Text>
                    </View>
                </View>

                {/* delivery time */}
                <View style={{backgroundColor: "#fce486"}} className="flex-row px-4 items-center">
                    <Image source={require('../assets/images/bikeGuy.png')} className="w-20 h-20 rounded-full" />
                    <Text className="flex-1 pl-4">Deliver in 30-40 minutes</Text>
                    {/* <TouchableOpacity>
                        <Text style={{color: "#555555"}} className="font-bold">Change</Text>
                    </TouchableOpacity> */}
                </View>

                {/* dishes */}
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    className="bg-white pt-5"
                    contentContainerStyle={{
                        paddingBottom: 50
                    }}
                
                >
                    {
                        cart.length > 0 ?
                        cart.map((item, index)=>{
                            return (
                                <View style={{shadowColor: "#555", shadowRadius: 15}} key={item._id} className="flex-row items-center space-x-3 py-2 px-4 bg-white rounded-3xl mx-2 mb-3 shadow-md">
                                    <Text style={{color: "#555555"}} className="font-bold">{item.quantity} x </Text>
                                    {
                                        checkIfIdExists(item._id) ?
                                        <Image className="h-14 w-14 rounded-full" source={require('../assets/images/combo.jpg')} />
                                        :
                                        <Image onError={() => setLoadError([...loadError, item._id])} className="h-14 w-14 rounded-full" source={{ uri: item.item_image }} />
                                    }
                                    <Text className="flex-1 font-bold text-gray-700">{item.item_name}</Text>
                                    <Text className="font-semibold text-base">₹{item.item_total_price}</Text>
                                    <TouchableOpacity
                                    onPress={() => removeCartItem(item._id)}
                                        className="p-1 rounded-full" 
                                        style={{backgroundColor: "#222222"}}
                                    >
                                        <Icon.Minus strokeWidth={2} height={20} width={20} stroke="white" />
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                        :
                        <View className="items-center bg-white pt-14">
                            <Icon.ShoppingCart height="100" width="100" strokeWidth={2} stroke="#b0aeae"/>
                            <Text style={{ fontWeight: '900', color:'#b0aeae' }} className="text-xl">Cart is Empty</Text>
                        </View>
                    }
                </ScrollView>
                {/* totals */}
                <View style={{backgroundColor: "#fce486"}} className=" p-6 px-8 rounded-t-3xl space-y-4">
                    <View className="flex-row justify-between">
                        <Text className="text-gray-800">Subtotal</Text>
                        <Text className="text-gray-800">₹{cartTotal}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-800">Delivery Fee</Text>
                        <Text className="text-green-800">Free</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="font-extrabold text-lg">Order Total</Text>
                        <Text className="font-extrabold text-lg">₹{cartTotal}</Text>
                    </View>
                    <View>
                        <TouchableOpacity 
                        style={{backgroundColor: "#222222"}}
                        onPress={placeOrder}
                        className="p-3 rounded-full">
                            <Text className="text-white text-center font-bold text-lg">Place Order</Text>
                        </TouchableOpacity>
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