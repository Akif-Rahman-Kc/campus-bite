import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert, Modal, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from "react-native-feather";
import { StatusBar } from 'expo-status-bar';
import Categories from '../components/categories';
import FeatureRow from '../components/featuredRow';
import { useState } from 'react';
import DishRow from '../components/dishRow';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CartIcon from '../components/cartIcon';
import * as SecureStore from 'expo-secure-store';
import { MenuList, NotificationList, StudentAuthApi, StudentDetails } from '../apis/student-api';

export default function HomeScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchbox, setSearchBox] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [searchMenus, setSearchMenus] = useState([])
    const [menus, setMenus] = useState([])
    const [allMenus, setAllMenus] = useState([])
    const [notifications, setNotifications] = useState([])
    const [notiCount, setNotiCount] = useState(0)
    //UserDetails
    const [user, setUser] = useState(null)
    const [cart, setCart] = useState([])
    const [cartTotal, setCartTotal] = useState(null)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)

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

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////
    return (
        <>
            {activeCategory != null && <CartIcon cart={cart} cart_total={cartTotal}/>}
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
                    <TouchableOpacity className="flex-1 items-center" onPress={()=>{setActiveCategory(null)}}>
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
                
                    {/* categories */}
                    <Categories menus={menus} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

                    {
                        activeCategory == null ?
                            <View style={{ minHeight:430 }} className="mt-5">
                                <FeatureRow menus={menus} />
                            </View>
                        :
                            <View style={{ minHeight:400 }} className="mt-5">
                                {
                                    menus[activeCategory].items.length > 0 ?
                                    menus[activeCategory].items.map(item=>{
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
                                    :
                                    <View className="items-center bg-white py-28">
                                        <Icon.XCircle height="100" width="100" strokeWidth={2} stroke="#b0aeae"/>
                                        <Text style={{ fontWeight: '900', color:'#b0aeae' }} className="text-xl">No Items</Text>
                                    </View>
                                }
                            </View>
                    }
                    

                    {/* footer */}
                    <View style={{backgroundColor: "#f5d45d", marginTop: -120 }} className="justify-center px-4 pt-6 pb-24 items-center">
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
            </SafeAreaView>
        </>
    )
}