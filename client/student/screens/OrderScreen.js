import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert, Animated, Modal } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from "react-native-feather";
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { MenuList, NotificationList, OrderDelete, OrderList, OrderRating, StudentAuthApi } from '../apis/student-api';
import moment from 'moment';
import { Linking } from 'react-native';

export default function OrderScreen() {

    const navigation = useNavigation();

    const isFirstCall = React.useRef(true); // tracks if it's the first call

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [ menus, setMenus ] = useState([])
    const [ allMenus, setAllMenus ] = useState([])
    const [ orders, setOrders ] = useState([])
    const [orderBox, setOrderBox] = useState("");
    const [searchMenus, setSearchMenus] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [searchbox, setSearchBox] = useState(false);
    const [notifications, setNotifications] = useState([])
    const [notiCount, setNotiCount] = useState(0)
    //UserDetails
    const [user, setUser] = useState(null)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(true)
    const [ reloadLightModalVisible, setReloadLightModalVisible ] = useState(false)
    //Error
    const [loadError, setLoadError] = useState([]);

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                if (token) {
                    setReloadModalVisible(true)
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
                        setUser(response.student_details)
                    }
                } else {
                    navigation.navigate('Login')
                }
            }
            fetchData()
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                const response = await MenuList(token)
                if (response.status == "success" ) {
                    const groupedMenus = response.menus.reduce((acc, item) => {
                        const { _id, category, name, price, image, status, rating } = item;
                    
                        if (!acc[category]) {
                        acc[category] = {
                            category,
                            items: []
                        };
                        }
                    
                        acc[category].items.push({ _id, name, price, image, status, rating });
                    
                        return acc;
                    }, {});
                    const result = Object.values(groupedMenus);
                    setMenus(result)
                    setAllMenus(response.menus)
                }else{
                    alert(response.message ? response.message : "Please go to the back and try agian")
                }
            }
            fetchData()
        },[])
    );

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                if (user?._id) {
                    const response = await NotificationList(user?._id, token)
                    if (response.status == "success") {
                        const unReadCount = response.notifications.filter(noti => noti.status === "UN_READ").length;
                        setNotiCount(unReadCount)
                        setNotifications(response.notifications)
                    }else{
                        alert(response.message ? response.message : "Please go to the back and try agian")
                    }
                }
            }
            fetchData()
        },[user])
    );

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    React.useEffect(() => {
        let intervalId;

        async function fetchData(){
            let token = await SecureStore.getItemAsync('UserAccessToken')
            if (user?.student_id) {
                const response = await OrderList(user?.student_id, token)
                setReloadModalVisible(false)
                if (response.status == "success") {
                    setOrders(response.orders)

                    // run setOrderBox only on the first call
                    if (isFirstCall.current && response.orders.length > 0) {
                        setOrderBox(response.orders[0]._id);
                        isFirstCall.current = false; // Mark as executed
                    }
                    }else{
                    alert(response.message ? response.message : "Please go to the back and try agian")
                }
            }
        }
        fetchData()
        // set interval to fetch data every second
        intervalId = setInterval(fetchData, 1000);

        // cleanup function to clear interval on component unmount
        return () => clearInterval(intervalId);
    },[user, refresh])

    ////////////////////////////////////////////////////// SEARCH //////////////////////////////////////////////////////
    const search = async (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_menus = allMenus.filter(menu => menu.name.toLowerCase().includes(lowercase_value));
            setSearchMenus(filterd_menus)
            setRefresh(!refresh)
        } else {
            setSearchMenus(allMenus)
        }
    }
  
    const searchClick = (item_id, item) => {
        const menu = menus.find(category => 
            category.items.some(item => item._id === item_id)
        );
        navigation.navigate('Menu', {id: item_id, name: menu.category, image: item.image, rating: item.rating, items: menu.items})
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
                    <Image source={require('../assets/images/logo.png')} className="h-12 w-24 rounded-full"/>
                    <View style={{ width: "72%", borderRadius: 50 }} className="flex-row space-x-2 items-center p-3 border border-gray-800">
                        {/* First View */}
                        <View className="flex-1">
                            <View className="flex-row items-center space-x-1">
                                <Icon.Search height="25" width="25" stroke="black" />
                                <TextInput onChangeText={(text) => search(text)} onKeyPress={() => setSearchBox(true)} onBlur={() => setSearchBox(false)} placeholder='Dishes...' className="ml-2 flex-1 text-base" keyboardType='default' />
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
                                <TouchableOpacity key={menu._id} onPress={() => { searchClick(menu._id, menu) }} style={{ width:"100%", borderColor:"#c7c5c5" }} className="flex-row py-3 px-5 border-b">
                                    <Image source={{ uri: menu.image.path }} className="h-12 w-12 rounded" />
                                    <View style={{ width:"80%" }} className="ml-2 items-center flex-row">
                                        <Text className="font-bold text-base">{menu.name}</Text>
                                        {/* <Text className="ml-auto rounded-full px-3 bg-green-600 text-white font-bold text-base">{menu.items.length}</Text> */}
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
                    <TouchableOpacity className="flex-1 items-center" onPress={()=>{ navigation.navigate('AllMenu') }}>
                        <Image style={{ tintColor:"#ffc803" }} source={require('../assets/images/menu.png')} className="h-6 w-6"/>
                        <Text style={{ color:"#ffc803" }} className="font-bold">Menu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center" onPress={()=>{ navigation.navigate('Notification', {notification_array: notifications}) }}>
                        <Image style={{ tintColor:"#ffc803" }} source={require('../assets/images/notification.png')} className="h-6 w-6 relative"/>
                        <Text style={{ color:"#ffc803" }} className="font-bold">Notification</Text>
                        {
                            notiCount > 0 &&
                            (
                            <View style={{ bottom: 30, right: 35 }} className="absolute bg-red-700 rounded-full py-0.5 px-1.5">
                                <Text style={{ color:"#ffc803", fontSize: 8.5 }} className="font-bold">{notiCount}</Text>
                            </View>
                            )
                            
                        }
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
                                                {/* <Text className="font-bold ml-auto">Delivery Time  :  {moment(order.created_at + 40 * 60 * 1000).format('h:mm A')}</Text> */}
                                            </View>
                                            {
                                                order.status === "CANCELLED" ?
                                                <Text className="font-extrabold text-md text-red-700 uppercase mb-2 mt-1 text-center">Cancelled</Text>
                                                :
                                                <>
                                                    <View className="flex-row items-center pt-1.5 pb-1">
                                                        <View className="flex-row items-center">
                                                            <Image style={{ zIndex:100 }} source={require('../assets/images/track-completed.png')} className="h-8 w-8"/>
                                                        </View>
                                                        <View className="flex-row items-center ml-auto">
                                                            <Text className="font-bold">----------</Text>
                                                            {
                                                                order.status == "PREPARING" || order.status == "READY" || order.status == "PAYMENT PENDING" || order.status == "COMPLETED" ?
                                                                <Image source={require('../assets/images/track-completed.png')} className="h-8 w-8"/>
                                                                :
                                                                <Image source={require('../assets/images/track-not-completed.png')} className="h-8 w-8"/>
                                                            }
                                                        </View>
                                                        <View className="flex-row items-center ml-auto">
                                                            <Text className="font-bold">----------</Text>
                                                            {
                                                                order.status == "READY" || order.status == "PAYMENT PENDING" || order.status == "COMPLETED" ?
                                                                <Image source={require('../assets/images/track-completed.png')} className="h-8 w-8"/>
                                                                :
                                                                <Image source={require('../assets/images/track-not-completed.png')} className="h-8 w-8"/>
                                                            }
                                                            <Text className="font-bold">----------</Text>
                                                        </View>
                                                        <View className="flex-row items-center ml-auto">
                                                            {
                                                                order.status == "PAYMENT PENDING" || order.status == "COMPLETED" ?
                                                                <Image source={require('../assets/images/track-completed.png')} className="h-8 w-8"/>
                                                                :
                                                                <Image source={require('../assets/images/track-not-completed.png')} className="h-8 w-8"/>
                                                            }
                                                            <Text className="font-bold">----------</Text>
                                                        </View>
                                                        <View className="flex-row items-center ml-auto">
                                                            {
                                                                order.status == "COMPLETED" ?
                                                                <Image style={{ zIndex:100 }} source={require('../assets/images/track-completed.png')} className="h-8 w-8"/>
                                                                :
                                                                <Image style={{ zIndex:100 }} source={require('../assets/images/track-not-completed.png')} className="h-8 w-8"/>
                                                            }
                                                        </View>
                                                    </View>
                                                    <View className="flex-row items-center mb-4 space-x-7">
                                                        <Text className="font-bold text-center">Placed</Text>
                                                        <Text className="font-bold text-center">Preparing</Text>
                                                        <Text className="font-bold text-center"> Ready </Text>
                                                        <Text className="font-bold text-center"> Payment</Text>
                                                        <Text className="font-bold text-center">Completed</Text>
                                                    </View>
                                                </>
                                            }
                                            
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
                                    {
                                        order.status === "PAYMENT PENDING" &&
                                        <View className="flex-row mt-1 mb-1 justify-between items-center">
                                            <View className="items-center flex-1 ">
                                                <TouchableOpacity onPress={() => navigation.navigate('Payment', {order_id: order._id})} style={{ width:"100%" }} className="mr-2 flex-1 py-2 rounded items-center bg-green-700">
                                                    <Text className="font-extrabold text-white uppercase">Pay Now</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
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
                    <View style={{backgroundColor: "#f5d45d" }} className="justify-center px-4 pt-6 pb-24 items-center mt-2">
                        <Image source={require('../assets/images/ready-dish.gif')} className="w-20 h-20 rounded-full" />
                        <Text className="flex-1 pl-4 text-base text-black font-semibold">Open - 8:00 PM - 10:00 PM</Text>
                        <Text className="flex-1 pl-4 text-xl text-black font-bold">Fresh & Quality Foods</Text>
                        <Text className="flex-1 pl-4 text-black">Experience the taste of freshly prepared dishes</Text>
                        <View className="flex-row space-x-6 mt-1">
                            <TouchableOpacity onPress={() => Linking.openURL('tel:+919562696976')}>
                                <Icon.Phone height="16" width="16" strokeWidth={3} stroke="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:akifrahman24409@gmail.com')}>
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