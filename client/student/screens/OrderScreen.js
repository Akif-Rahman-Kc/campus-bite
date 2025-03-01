import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert, Animated, Modal } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from "react-native-feather";
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { MenuSearch, OrderDelete, OrderList, OrderRating, UserAuthApi } from '../apis/student-api';
import moment from 'moment';
import { Linking } from 'react-native';

export default function OrderScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE REFS //////////////////////////////////////////////////////
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [ orders, setOrders ] = useState([])
    const [orderBox, setOrderBox] = useState("");
    const [id, setId] = useState("");
    const [searchMenus, setSearchMenus] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [searchbox, setSearchBox] = useState(false);
    //UserDetails
    const [user, setUser] = useState(null)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(true)
    const [ reloadLightModalVisible, setReloadLightModalVisible ] = useState(false)
    const [ rateModalVisible, setRateModalVisible ] = useState(false)
    //Error
    const [loadError, setLoadError] = useState([]);
    //Rating
    const [defaultRating, setDefaultRating] = useState(0);
    const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                if (token) {
                    setReloadModalVisible(true)
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
                const response = await OrderList(user?.id, token)
                setReloadModalVisible(false)
                if (response.status == "success" ) {
                    setOrders(response.orders)
                    setOrderBox(response.orders[0]._id)
                }else{
                    alert(response.message ? response.message : "Please go to the back and try agian")
                }
            }
        }
        fetchData()
    },[user, refresh])
    
    React.useEffect(() => {
        const startAnimation = () => {
        Animated.loop(
            Animated.timing(animatedValue, {
            toValue: 1,
            duration: 30000, // Adjust duration as needed
            useNativeDriver: true,
            })
        ).start();
        };
    
        startAnimation();
    }, [animatedValue]);

    ////////////////////////////////////////////////////// CANCEL ORDER //////////////////////////////////////////////////////
    const cancelOrder = async (order_id, created_at) => {
        if (Date.now() < (created_at + 5 * 60 * 1000)) {
            Alert.alert('Are you sure', 'You want to cancel this order', [
                {
                    text: 'Back',
                    onPress: () => console.log('Back Pressed'),
                    style: 'cancel',
                },
                {text: 'Cancel Order', onPress: () => ok()},
            ]);
            async function ok(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                const response = await OrderDelete(order_id, token)
                if (response.status == "success" ) {
                    setRefresh(!refresh)
                }
            }
        } else {
            setRefresh(!refresh)
        }
    }

    ////////////////////////////////////////////////////// SEARCH //////////////////////////////////////////////////////
    const search = async (text) => {
        let token = await SecureStore.getItemAsync('UserAccessToken')
        const response = await MenuSearch(text, token)
        if (response.status == "success" ) {
            setSearchMenus(response.menus)
        }
    }

    ////////////////////////////////////////////////////// MODAL //////////////////////////////////////////////////////
    const openModal = (id) => {
        setId(id);
        setDefaultRating(0)
        setRateModalVisible(true);
    };

    const rating = async () => {
        let token = await SecureStore.getItemAsync('UserAccessToken')
        setReloadLightModalVisible(true);
        const response = await OrderRating({id, rating:defaultRating}, token)
        setReloadLightModalVisible(false);
        if (response.status == "success" ) {
            setRefresh(!refresh)
            setRateModalVisible(false);
        }
    }

    ////////////////////////////////////////////////////// CHECK IF ID EXISTS //////////////////////////////////////////////////////
    const checkIfIdExists = (idToCheck) => {
        return loadError.some(itemId => itemId === idToCheck);
    };

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        <>
            <SafeAreaView className="bg-white" >
                <StatusBar
                    barStyle="dark-content" 
                />
                {/* <View className="justify-center items-center p-1">
                    <Text className="text-lg font-bold">CAFE ARRIVAL</Text>
                </View> */}
            
                {/* navbar */}
                <View style={{ backgroundColor:"#ffc803" }} className="flex-row items-center space-x-2 px-4 py-2">
                    <Image source={require('../assets/images/logo.png')} className="h-14 w-28"/>
                    <View style={{ width: "83%", borderRadius: 50 }} className="flex-row space-x-2 items-center p-3 border border-gray-800">
                        {/* First View */}
                        <View className="flex-1">
                            <View className="flex-row items-center space-x-1">
                                <Icon.Search height="25" width="25" stroke="black" />
                                <TextInput onChangeText={(text) => search(text)} onKeyPress={() => setSearchBox(true)} onBlur={() => setSearchBox(false)} placeholder='Dishes...' className="ml-2 flex-1 text-base" keyboardType='default' />
                            </View>
                        </View>

                        {/* Second View */}
                        <View className="flex-1">
                            <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-500">
                                <Icon.MapPin onPress={()=>{ navigation.navigate('Profile',) }} height="20" width="20" stroke="black" />
                                <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row" style={{ overflow: 'hidden'}}>
                                        {
                                            user != null &&
                                            <Animated.View style={{ flexDirection: 'row', transform: [{ translateX:animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, -500],}) }] }}>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}   ||   </Text>
                                                <Text className="text-gray-900 font-extrabold text-base">{user?.address.landmark}, {user?.address.locality}</Text>
                                            </Animated.View>
                                        }
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>

                {/* searchbox */}
                {
                    searchbox &&
                    <View style={{ width:"100%", top: 101 , zIndex:100 }} className="absolute items-center bg-white">
                        {
                            searchMenus.length > 0
                            ?
                            searchMenus.map(menu => (
                                <TouchableOpacity key={menu._id} onPress={() => { navigation.navigate('Menu', menu) }} style={{ width:"100%", borderColor:"#c7c5c5" }} className="flex-row py-3 px-5 border-b">
                                    <Image source={{ uri: menu.image.path }} className="h-12 w-12 rounded" />
                                    <View style={{ width:"80%" }} className="ml-2 items-center flex-row">
                                        <Text className="font-bold text-base">{menu.name}</Text>
                                        <Text className="ml-auto rounded-full px-3 bg-green-600 text-white font-bold text-base">{menu.items.length}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                            :
                            <Text className="text-gray-500 text-base font-bold text-center my-3">No items!</Text>
                        }
                    </View>
                }

                {/* selectbar */}
                <View className="flex-row fixed bottom-0 left-0 right-0 bg-gray-900 p-1.5">
                    <TouchableOpacity className="flex-1 items-center" onPress={()=>{ navigation.navigate('Home') }}>
                        <Image style={{ tintColor:"#ffc803" }} source={require('../assets/images/home.png')} className="h-6 w-6"/>
                        <Text style={{ color:"#ffc803" }} className="font-bold">Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center" onPress={()=>{ navigation.navigate('AllCombo') }}>
                        <Image style={{ tintColor:"#ffc803" }} source={require('../assets/images/offer.png')} className="h-6 w-6"/>
                        <Text style={{ color:"#ffc803" }} className="font-bold">Offers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center" onPress={()=>{ navigation.navigate('AllMenu') }}>
                        <Image style={{ tintColor:"#ffc803" }} source={require('../assets/images/menu.png')} className="h-6 w-6"/>
                        <Text style={{ color:"#ffc803" }} className="font-bold">Menu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center" onPress={()=>{ navigation.navigate('Profile') }}>
                        <Image style={{ tintColor:"#ffc803" }} source={require('../assets/images/profile.png')} className="h-6 w-6"/>
                        <Text style={{ color:"#ffc803" }} className="font-bold">Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* main */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 50
                    }}
                >
                    {
                        orders.length > 0 ?
                        orders?.map((order)=>{
                            return (
                                <View key={order._id} style={{shadowColor: "#555", shadowRadius: 15}} className="bg-white p-3 rounded-2xl shadow-2xl my-2 mx-2">
                                    <TouchableOpacity onPress={() => setOrderBox(order._id)} className="flex-row items-center">
                                        <Text className="text-lg font-bold text-red-600">Order ID : {order.order_id}</Text>
                                        <Text style={{ fontSize:15 }} className="font-bold ml-auto">{moment(order.created_at).format('DD-MM-YYYY')}</Text>
                                    </TouchableOpacity>
                                    {
                                        orderBox == order._id &&
                                        <>
                                            <View className="flex-row items-center py-1.5">
                                                <Text className="font-bold">Order Time  :  {moment(order.created_at).format('h:mm A')}</Text>
                                                <Text className="font-bold ml-auto">Delivery Time  :  {moment(order.created_at + 40 * 60 * 1000).format('h:mm A')}</Text>
                                            </View>
                                            <View className="flex-row items-center pt-1.5 pb-1">
                                                <View className="flex-row items-center">
                                                    <Image style={{ zIndex:100 }} source={require('../assets/images/track-completed.png')} className="h-11 w-11"/>
                                                </View>
                                                <View className="flex-row items-center ml-auto">
                                                    <Text className="font-bold">---------------------</Text>
                                                    {
                                                        order.status != "PENDING" ?
                                                        <Image source={require('../assets/images/track-completed.png')} className="h-11 w-11"/>
                                                        :
                                                        <Image source={require('../assets/images/track-not-completed.png')} className="h-11 w-11"/>
                                                    }
                                                    <Text className="font-bold">---------------------</Text>
                                                </View>
                                                <View className="flex-row items-center ml-auto">
                                                    {
                                                        order.status == "DELIVERED" ?
                                                        <Image style={{ zIndex:100 }} source={require('../assets/images/track-completed.png')} className="h-11 w-11"/>
                                                        :
                                                        <Image style={{ zIndex:100 }} source={require('../assets/images/track-not-completed.png')} className="h-11 w-11"/>
                                                    }
                                                </View>
                                            </View>
                                            <View className="flex-row items-center mb-4">
                                                <Text className="font-bold">Order Placed</Text>
                                                <Text className="font-bold ml-auto">Delivery Started</Text>
                                                <Text className="font-bold ml-auto">Delivered</Text>
                                            </View>
                                            <View className="p-3 rounded-2xl space-y-3 bg-gray-300">
                                                {
                                                    order.items.map((item)=>{
                                                        return (
                                                            <View key={item._id} className="flex-row items-center space-x-2">
                                                                <Text className="font-semibold">{item.quantity} x </Text>
                                                                {
                                                                    checkIfIdExists(item._id) ?
                                                                    <Image className="h-10 w-10 rounded-full" source={require('../assets/images/combo.jpg')} />
                                                                    :
                                                                    <Image onError={() => setLoadError([...loadError, item._id])} className="h-10 w-10 rounded-full" source={{ uri: item.item_image }} />
                                                                }
                                                                <Text className="flex-1 font-bold text-gray-800 text-base">{item.item_name}</Text>
                                                                <Text className="font-semibold text-base text-right">₹{item.item_total_price}</Text>
                                                            </View>
                                                        )
                                                    })
                                                }
                                                <View className="space-y-4 border-t pt-2">
                                                    <View className="flex-row justify-between">
                                                        <Text className="text-gray-800 text-base">Subtotal</Text>
                                                        <Text className="text-gray-800 text-base font-semibold">₹{order.cart_total}</Text>
                                                    </View>
                                                    <View className="flex-row justify-between">
                                                        <Text className="text-gray-800 text-base">Delivery Fee</Text>
                                                        <Text className="text-green-800 text-base font-semibold">Free</Text>
                                                    </View>
                                                    <View className="flex-row justify-between">
                                                        <Text className="font-extrabold text-base">Order Total</Text>
                                                        <Text className="font-extrabold text-base">₹{order.cart_total}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </>
                                    }
                                    {Date.now() < (order.created_at + 5 * 60 * 1000) && 
                                        <Text className="mt-2 text-red-700 font-semibold">Note : Cancel option is not available after 5 minutes</Text>
                                    }
                                    <View className="flex-row mt-1 mb-1 justify-between items-center">
                                        <View className="flex-row items-center space-x-1">
                                            <Text className="text-black text-xl font-bold">Total Amount  :  ₹{order.cart_total}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row mt-1 mb-1 justify-between items-center">
                                        {
                                            order.rated ?
                                            <View className="items-center flex-1">
                                                <View style={{ width:"100%" }} className="flex-row items-center space-x-1">
                                                    <Image source={require('../assets/images/fullStar.png')} className="h-5 w-5" />
                                                    <Text className="text-base font-bold text-green-700 mt-1">{order.rating}</Text>
                                                </View>
                                            </View>
                                            :
                                            <View className="items-center flex-1 ">
                                                <TouchableOpacity style={{ width:"100%" }} onPress={() => openModal(order._id)} className="mr-2 flex-1 py-2 rounded border-2 items-center border-yellow-500">
                                                    <Text className="font-bold text-yellow-500 uppercase">Rate Order</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        {Date.now() < (order.created_at + 5 * 60 * 1000) &&
                                            <View className="items-center flex-1">
                                                <TouchableOpacity style={{ width:"100%" }} onPress={() => cancelOrder(order._id, order.created_at)} className="ml-2 flex-1 py-2 rounded border-2 items-center border-red-500">
                                                    <Text className="font-bold text-red-500 uppercase">Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                    <Modal
                                        visible={rateModalVisible}
                                        animationType="slide"
                                        transparent={true}
                                    >
                                        <View style={{ backgroundColor:'rgba(255, 255, 255, 0.1)' }} className="flex-1 justify-center items-center bg-gray-500">
                                            <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                                                <View style={{ width:300, height:300, shadowColor: "gray", shadowRadius: 30 }} className="bg-white py-7 px-10 rounded-2xl shadow-2xl">
                                                    <TouchableOpacity 
                                                        onPress={()=>setRateModalVisible(false)} 
                                                        className="w-7 h-7 items-center justify-center bg-gray-100 -mt-4 -ml-6 mb-7 rounded-full shadow">
                                                        <Icon.ArrowLeft strokeWidth={3} height={17} width={17} stroke={"#222222"} />
                                                    </TouchableOpacity>
                                                    <View className="flex-row space-x-3 justify-center items-center">
                                                        {
                                                            maxRating.map((item) => {
                                                                return (
                                                                    <TouchableOpacity onPress={() => setDefaultRating(item)} key={item}>
                                                                        <Image source={item <= defaultRating ? require('../assets/images/star_filled.png') : require('../assets/images/star_corner.png')} className="h-7 w-7" />
                                                                    </TouchableOpacity>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                    <Text className="mt-8 text-center text-5xl font-bold italic capitalize space-x-1">{defaultRating == 1 ? 'very bad' : defaultRating == 2 ? 'bad' : defaultRating == 3 ? 'average' : defaultRating == 4 ? 'good' : defaultRating == 5 ? 'loved it' : ''}</Text>
                                                    <TouchableOpacity onPress={rating} className="py-1.5 rounded items-center bg-green-700 mt-8">
                                                        <Text className="uppercase font-bold text-white">Submit Your Feedback</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            )
                        })
                        :
                        <View className="items-center bg-white py-40">
                            <Icon.XCircle height="100" width="100" strokeWidth={2} stroke="#b0aeae"/>
                            <Text style={{ fontWeight: '900', color:'#b0aeae' }} className="text-xl">No Orders</Text>
                        </View>
                    }

                    {/* footer */}
                    <View style={{backgroundColor: "#fce486"}} className="mb-16 justify-center px-4 py-6 items-center">
                        <Image source={require('../assets/images/bikeGuy.png')} className="w-20 h-20 rounded-full" />
                        <Text className="flex-1 pl-4 text-base text-black font-semibold">Open - 3:00 PM - 12:00 PM</Text>
                        <Text className="flex-1 pl-4 text-xl text-black font-bold">Fast & Free Delivery</Text>
                        <Text className="flex-1 pl-4 text-black">(Around 5 Km Only Delivery Available)</Text>
                        <View className="flex-row space-x-6 mt-1">
                            <TouchableOpacity onPress={() => Linking.openURL('tel:+918136946137')}>
                                <Icon.Phone height="16" width="16" strokeWidth={3} stroke="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:risalkanu@gmail.com')}>
                                <Icon.Mail height="16" width="16" strokeWidth={3} stroke="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    visible={reloadModalVisible}
                    transparent={true}
                >
                    <View style={{ backgroundColor:'rgba(255, 255, 255, 1)', top:72 }} className="flex-1 justify-center items-center bg-gray-500">
                        <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                            <Image source={require('../assets/images/logo-reload.gif')} className="h-20 w-20" />
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={reloadLightModalVisible}
                    transparent={true}
                >
                    <View style={{ backgroundColor:'rgba(255, 255, 255, 0.2)' }} className="flex-1 justify-center items-center bg-gray-500">
                        <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                            <Image source={require('../assets/images/logo-reload.gif')} className="h-20 w-20" />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    )
}