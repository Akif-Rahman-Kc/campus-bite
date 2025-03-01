import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Modal, Alert } from 'react-native'
import React from 'react'
import * as Icon from "react-native-feather";
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { OrderAllList, OrderDelete, OrderFilter, OrderUpdate } from '../apis/adminApi';
import moment from 'moment';

export default function OrderList({date, admin}) {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [ orders, setOrders ] = useState([])
    const [ refresh, setRefresh ] = useState(false)
    const [ dropdown, setDropdown ] = useState(null)
    const [ filter, setFilter ] = useState("ALL")
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)
    //Error
    const [loadError, setLoadError] = useState([]);

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    React.useEffect(() => {
        async function fetchData(){
            let token = admin ? await SecureStore.getItemAsync('AdminAccessToken') : await SecureStore.getItemAsync('VendorAccessToken')
            setReloadModalVisible(true)
            const response = await OrderAllList(date, token)
            setReloadModalVisible(false)
            setFilter("ALL")
            if (response.status == "success" ) {
                setOrders(response.orders)
            }else{
                alert(response.message ? response.message : "Please go to the back and try agian")
            }
        }
        fetchData()
    },[refresh])

    ////////////////////////////////////////////////////// FILTER ORDERs //////////////////////////////////////////////////////
    const filterOrders = async (item) => {
        let token = admin ? await SecureStore.getItemAsync('AdminAccessToken') : await SecureStore.getItemAsync('VendorAccessToken')
        setReloadModalVisible(true)
        const response = await OrderFilter(date, item, token)
        setReloadModalVisible(false)
        if (response.status == "success" ) {
            setFilter(item)
            setOrders(response.orders)
        }else{
            alert(response.message ? response.message : "Please go to the back and try agian")
        }
    }

    ////////////////////////////////////////////////////// CANCEL ORDER //////////////////////////////////////////////////////
    const cancelOrder = async (order_id, order_status) => {
        if (order_status != "Delivered") {
            Alert.alert('Are you sure', 'You want to cancel this order', [
                {
                    text: 'Back',
                    onPress: () => console.log('Back Pressed'),
                    style: 'cancel',
                },
                {text: 'Cancel Order', onPress: () => ok()},
            ]);
            async function ok(){
                let token = await SecureStore.getItemAsync('AdminAccessToken')
                const response = await OrderDelete(order_id, token)
                if (response.status == "success" ) {
                    setRefresh(!refresh)
                }
            }
        } else {
            setRefresh(!refresh)
        }
    }

    ////////////////////////////////////////////////////// STATUS CHANGE //////////////////////////////////////////////////////
    const statusChange = async (order_id, status) => {
        let token = admin ? await SecureStore.getItemAsync('AdminAccessToken') : await SecureStore.getItemAsync('VendorAccessToken')
        const response = await OrderUpdate({order_id, status}, token)
        if (response.status == "success" ) {
            setRefresh(!refresh)
        }
        setDropdown(null)
    }

    ////////////////////////////////////////////////////// CHECK IF ID EXISTS //////////////////////////////////////////////////////
    const checkIfIdExists = (idToCheck) => {
        return loadError.some(itemId => itemId === idToCheck);
    };

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        <>
            {/* filter */}
            <View className="border border-gray-800 m-2 rounded">
                <View className="flex-row bg-gray-700 px-3">
                    <Text className="font-bold text-lg text-white">Filter</Text>
                </View>
                <View className="flex-row space-x-3 p-2">
                    {
                        ["ALL","PENDING","DELIVERY STARTED", "DELIVERED"].map(item=>{
                            let isActive = item == filter;
                            let filterClass = isActive ? 'px-3 items-center rounded bg-gray-600 py-1' : 'px-3 items-center rounded bg-gray-300 py-1';
                            let filterTextClass = isActive ? 'font-bold text-white capitalize' : 'font-bold text-black capitalize';
                            return(
                                <View key={item}>
                                    <TouchableOpacity onPress={() => filterOrders(item)} className={filterClass}>
                                        <Text className={filterTextClass}>{item}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </View>
            </View>

            {/* refresh */}
            <View className="items-end -mt-1 mb-1">
                <TouchableOpacity onPress={() => setRefresh(!refresh)} className="w-9 justify-center rounded-full h-9 items-center mx-4 bg-gray-200">
                    <Icon.RefreshCcw height="20" strokeWidth={3} width="25" stroke="black" />
                </TouchableOpacity>
            </View>

            {/* main */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 170
                }}
            >
                {
                    orders.length > 0 ?
                    orders.map((order, index)=>{
                        let statusClass = order.status == "PENDING" ? 'flex-row items-center justify-center py-1 px-3 rounded bg-red-500' : order.status == "DELIVERY STARTED" ? 'flex-row items-center justify-center py-1 px-3 rounded bg-orange-400' : 'flex-row items-center justify-center py-1 px-3 rounded bg-green-600';
                        return (
                            <View key={order._id} style={{shadowColor: "#555", shadowRadius: 15}} className="bg-white p-3 rounded-3xl shadow-2xl my-3 mx-2">
                                <View className="flex-row items-center">
                                    <Text className="text-lg font-bold text-red-600">Order ID : {order.order_id}</Text>
                                    <Text style={{ fontSize:15 }} className="font-bold ml-auto">{moment(order.created_at).format('DD-MM-YYYY')}</Text>
                                </View>
                                <View className="flex-row items-center py-1.5">
                                    <Text className="font-bold">Order Time  :  {moment(order.created_at).format('h:mm A')}</Text>
                                    <Text className="font-bold ml-auto">Delivery Time  :  {moment(order.created_at + 40 * 60 * 1000).format('h:mm A')}</Text>
                                </View>
                                <View className="rounded p-2 space-y-1.5 border shadow">
                                    <Text className="font-extrabold text-base underline">User Details</Text>
                                    <Text className="font-bold">Name  :  {order.user_name}</Text>
                                    <Text className="font-bold">Phone No  :  {order.user_phone_no}</Text>
                                    <Text className="font-bold">Location  :  {order.user_address}</Text>
                                </View>
                                <View className="flex-row items-center pt-1.5 pb-1">
                                    
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
                                <View className="flex-row mb-1 justify-between items-center">
                                    <View className="flex-row items-center space-x-1 mt-4 mb-5 ">
                                        <Text className="text-black text-xl font-bold">Total Amount : ₹{order.cart_total}</Text>
                                    </View>
                                    <View className="items-center">
                                        <TouchableOpacity style={{ width:130 }} onPress={() => dropdown == index ? setDropdown(null) : setDropdown(index)} className={statusClass}>
                                            <Text className="font-bold text-white mr-3 capitalize">{order.status}</Text>
                                            <Icon.ChevronDown className="ml-auto" height="20" width="20" strokeWidth={2} stroke="white"/>
                                        </TouchableOpacity>
                                        {
                                            dropdown == index &&
                                            <View style={{ top: 29 }} className="absolute border items-center rounded">
                                                {
                                                    order.status == "PENDING" ?
                                                    <>
                                                        <TouchableOpacity style={{ width:130 }} onPress={() => statusChange(order._id, "DELIVERY STARTED")} className="flex-row items-center justify-center py-1 bg-orange-400">
                                                            <Text className="font-bold text-white mr-3">Delivery Started</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width:130 }} onPress={() => statusChange(order._id, "DELIVERED")} className="flex-row items-center justify-center py-1 bg-green-600">
                                                            <Text className="font-bold text-white mr-3">Delivered</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                    :
                                                    order.status == "DELIVERY STARTED" ?
                                                    <>
                                                        <TouchableOpacity style={{ width:130 }} onPress={() => statusChange(order._id, "PENDING")} className="flex-row items-center justify-center py-1 bg-red-500">
                                                            <Text className="font-bold text-white mr-3">Pending</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width:130 }} onPress={() => statusChange(order._id, "DELIVERED")} className="flex-row items-center justify-center py-1 bg-green-600">
                                                            <Text className="font-bold text-white mr-3">Delivered</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                    :
                                                    <>
                                                        <TouchableOpacity style={{ width:130 }} onPress={() => statusChange(order._id, "PENDING")} className="flex-row items-center justify-center py-1 bg-red-500">
                                                            <Text className="font-bold text-white mr-3">Pending</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width:130 }} onPress={() => statusChange(order._id, "DELIVERY STARTED")} className="flex-row items-center justify-center py-1 bg-orange-400">
                                                            <Text className="font-bold text-white mr-3">Delivery Started</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                }
                                            </View>
                                        }
                                    </View>
                                </View>
                                {
                                    (admin && order.status != "DELIVERED") &&
                                    <TouchableOpacity onPress={() => cancelOrder(order._id, order.status)} style={{ marginTop:-17 }} className="w-24 items-center py-1.5 rounded-full bg-red-500">
                                        <Text className="font-bold text-white">Cancel</Text>
                                    </TouchableOpacity>
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
            </ScrollView>
            <Modal
                visible={reloadModalVisible}
                animationType="slide"
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