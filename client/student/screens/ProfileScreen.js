import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Modal, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from "react-native-feather";
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { MenuList, StudentAuthApi, StudentDetails } from '../apis/student-api';
import { Linking } from 'react-native';

export default function ProfileScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [searchMenus, setSearchMenus] = useState([])
    const [menus, setMenus] = useState([])
    const [allMenus, setAllMenus] = useState([])
    const [searchbox, setSearchBox] = useState(false);
    const [ selected, setSelected ] = useState("option1")
    const [refresh, setRefresh] = useState(false)
    //UserDetails
    const [user, setUser] = useState(null)
    const [userDetails, setUserDetails] = useState(null)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(true)
    const [ reloadModalVisibleSecond, setReloadModalVisibleSecond ] = useState(false)
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ editModalVisible, setEditModalVisible ] = useState(false)
    //FormData
    const [id, setId] = useState("")
    const [landmark, setLandmark] = useState("")
    const [locality, setLocality] = useState("")
    const [district, setDistrict] = useState("")
    //Error
    const [error, setError] = useState("")

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                let token = await SecureStore.getItemAsync('UserAccessToken')
                if (token) {
                    setReloadModalVisible(true)
                    const response = await StudentAuthApi(token)
                    setReloadModalVisible(false)
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

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    React.useEffect(() => {
        async function fetchData(){
            let token = await SecureStore.getItemAsync('UserAccessToken')
            if (user?._id) {
                const response = await StudentDetails(user._id, token)
                if (response.status == "success" ) {
                    setUserDetails(response.user)
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

    ////////////////////////////////////////////////////// LOGOUT //////////////////////////////////////////////////////
    const logout = () => {
        Alert.alert('Are you sure', 'You want to logout', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'Logut', onPress: () => ok()},
        ]);
        async function ok(){
            SecureStore.deleteItemAsync('UserAccessToken').then(() => navigation.navigate('Login'))
        }
    }

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
                    <TouchableOpacity className="flex-1 items-center">
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
                    <View className="justify-center m-3 py-5 items-center bg-gray-200 rounded-2xl ">
                        <Image source={require('../assets/images/account.png')} className="h-20 w-20"/>
                        <Text className="font-bold text-xl">{user?.username}</Text>
                        <Text className="font-semibold text-md">{user?.mobile_no}</Text>
                        <View className="flex-row items-center mt-3 px-4">
                            <TouchableOpacity style={{ width:"100%" }} onPress={()=>{ navigation.navigate('Order') }} className="mr-2 flex-row py-1.5 rounded border-2 items-center justify-center border-green-700">
                                <Icon.Archive height="16" strokeWidth={3} width="16" stroke="#047857" />
                                <Text className="ml-2 font-bold text-green-700 uppercase">View Orders</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center mt-3 px-4">
                            <TouchableOpacity style={{ width:"100%" }} onPress={()=>{ navigation.navigate('Order') }} className="mr-2 flex-row py-1.5 rounded border-2 items-center justify-center border-blue-700">
                                <Icon.Bell height="16" strokeWidth={3} width="16" stroke="#1D4ED8" />
                                <Text className="ml-2 font-bold text-blue-700 uppercase">Notifications</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center mt-2 px-4">
                            <TouchableOpacity style={{ width:"100%" }} onPress={logout} className="mr-2 flex-row py-1.5 rounded border-2 items-center justify-center border-gray-700">
                                <Icon.LogOut height="16" strokeWidth={3} width="16" stroke="#4b5563" />
                                <Text className="ml-2 font-bold text-gray-700 uppercase">Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* footer */}
                    <View style={{backgroundColor: "#f5d45d" }} className="justify-center px-4 pt-6 pb-24 items-center">
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
                    visible={reloadModalVisibleSecond}
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