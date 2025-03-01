import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Modal, Alert, Animated } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from "react-native-feather";
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { MenuSearch, UserAddressCreate, UserAddressDelete, UserAddressUpdate, UserAuthApi, UserDetails } from '../apis/student-api';
import { Linking } from 'react-native';

export default function ProfileScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE REFS //////////////////////////////////////////////////////
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [searchMenus, setSearchMenus] = useState([])
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
                    const response = await UserAuthApi(token)
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
                    setUserDetails(response.user)
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

    ////////////////////////////////////////////////////// ADD ADDRESS //////////////////////////////////////////////////////
    const addAddress = async () => {
        if (landmark !="" && locality !="" && district !="") {
            setError("")
            let token = await SecureStore.getItemAsync('UserAccessToken')
            setReloadModalVisibleSecond(true)
            const response = await UserAddressCreate({id:user.id, landmark, locality, district}, token)
            setReloadModalVisibleSecond(false)
            if (response.status == "success") {
                setError("")
                setRefresh(!refresh)
                user.address = response.address
                setUser(user)
                setModalVisible(false)
            } else {
                setModalVisible(false)
                Alert.alert('Creation failed!', response.message ? response.message : "This address not created please try again", [
                    {text: 'OK', onPress: () => console.log("ok")},
                ]);
            }
        } else {
            if (landmark == "") {
                setError('Please enter landmark')
            } else if (locality == "") {
                setError('Please enter locality')
            } else {
                setError('Please enter district')
            }
        }
    }

    ////////////////////////////////////////////////////// MODAL //////////////////////////////////////////////////////
    const openEditModal = (obj) => {
        setId(obj._id);
        setLandmark(obj.landmark);
        setLocality(obj.locality);
        setDistrict(obj.district);
        setEditModalVisible(true);
    };

    ////////////////////////////////////////////////////// EDIT ADDRESS //////////////////////////////////////////////////////
    const editAddress = async () => {
        let token = await SecureStore.getItemAsync('UserAccessToken')
        setReloadModalVisibleSecond(true)
        const response = await UserAddressUpdate({user_id:user.id, address_id:id, landmark, locality, district}, token)
        setReloadModalVisibleSecond(false)
        if (response.status == "success") {
            setRefresh(!refresh)
            user.address = response.address
            setUser(user)
            setEditModalVisible(false)
        }
    }

    ////////////////////////////////////////////////////// SELECT ADDRESS //////////////////////////////////////////////////////
    const selectAddress = async (address_id) => {
        let token = await SecureStore.getItemAsync('UserAccessToken')
        setReloadModalVisibleSecond(true)
        const response = await UserAddressUpdate({user_id:user.id, address_id}, token)
        setReloadModalVisibleSecond(false)
        if (response.status == "success") {
            setRefresh(!refresh)
            user.address = response.address
            setUser(user)
        }
    }

    ////////////////////////////////////////////////////// DELETE ADDRESS //////////////////////////////////////////////////////
    const handleDelete = async (address_id) => {
        Alert.alert('Are you sure', 'You want to delete this address', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'Delete', onPress: () => ok()},
        ]);
        async function ok(){
            let token = await SecureStore.getItemAsync('UserAccessToken')
            setReloadModalVisibleSecond(true)
            const response = await UserAddressDelete(user.id, address_id, token)
            setReloadModalVisibleSecond(false)
            if (response.status == "success") {
                setRefresh(!refresh)
                if (response.address) {
                    user.address = response.address
                    setUser(user)
                }
            } else {
                Alert.alert('Deletion failed!', response.message, [
                    {text: 'OK', onPress: () => console.log("ok")},
                ]);
            }
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
                        <Text className="font-bold text-xl">{user?.full_name}</Text>
                        <View className="flex-row items-center mt-3 px-4">
                            <TouchableOpacity style={{ width:"100%" }} onPress={()=>{ navigation.navigate('Order') }} className="mr-2 flex-row py-1.5 rounded border-2 items-center justify-center border-green-700">
                                <Icon.Archive height="16" strokeWidth={3} width="16" stroke="#047857" />
                                <Text className="ml-2 font-bold text-green-700 uppercase">View Orders</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center mt-2 px-4">
                            <TouchableOpacity style={{ width:"100%" }} onPress={logout} className="mr-2 flex-row py-1.5 rounded border-2 items-center justify-center border-gray-700">
                                <Icon.LogOut height="16" strokeWidth={3} width="16" stroke="#4b5563" />
                                <Text className="ml-2 font-bold text-gray-700 uppercase">Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ minHeight:200 }} className="bg-gray-200 p-3 rounded-2xl shadow-2xl m-3">
                        <Text className="text-lg font-bold text-center mb-4">Location Address</Text>
                        {
                            userDetails?.address.map( obj => {
                                return (
                                    <View key={obj._id} className="flex flex-1 space-y-3 bg-white px-3 py-4 rounded-2xl my-1">
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center">
                                                {
                                                    obj.selected ?
                                                    <Image style={{ tintColor:"green" }} source={require('../assets/images/radio-on.png')} className="h-5 w-5"/>
                                                    :
                                                    <TouchableOpacity onPress={() => selectAddress(obj._id)}>
                                                        <Image source={require('../assets/images/radio-off.png')} className="h-5 w-5"/>
                                                    </TouchableOpacity>
                                                }
                                                <View className="ml-3">
                                                    <Text className="font-bold">Landmark: {obj.landmark}</Text>
                                                    <Text className="font-bold">Locality: {obj.locality}</Text>
                                                    <Text className="font-bold">District: {obj.district}</Text>
                                                </View>
                                            </View>
                                            <View className="items-center">
                                                <TouchableOpacity 
                                                        onPress={() => openEditModal(obj)}
                                                        className="mb-2 rounded-full" 
                                                    >
                                                    <Icon.Edit3 strokeWidth={3} height={16} width={14} stroke="#3477eb" />
                                                </TouchableOpacity>
                                                {
                                                    userDetails?.address.length > 1 &&
                                                    <TouchableOpacity 
                                                        onPress={() => handleDelete(obj._id)}
                                                        className="mt-2 rounded-full"
                                                    >
                                                        <Icon.Trash2 strokeWidth={3} height={16} width={14} stroke="#fa3434" />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                            <Modal
                                                visible={editModalVisible}
                                                animationType="slide"
                                                transparent={true}
                                            >
                                                <View className="flex-1 justify-center items-center bg-gray-500">
                                                    <View style={{ width: 300}} className="bg-white py-5 px-3 rounded">
                                                        <Text className="font-bold mt-2 text-lg text-center">Add Address</Text>
                                                        <Text className="font-bold">Landmark</Text>
                                                        <TextInput
                                                            className="mb-2 px-2 rounded border"
                                                            placeholder='Building name or Streent No'
                                                            onChangeText={(value) => setLandmark(value)}
                                                            multiline
                                                            value={landmark}
                                                        />
                                                        <Text className="font-bold">Locality</Text>
                                                        <TextInput
                                                            className="mb-2 px-2 rounded border"
                                                            placeholder='Current Place'
                                                            onChangeText={(value) => setLocality(value)}
                                                            multiline
                                                            value={locality}
                                                        />
                                                        <Text className="font-bold">District</Text>
                                                        <TextInput
                                                            className="mb-10 px-2 rounded border"
                                                            placeholder='District'
                                                            onChangeText={(value) => setDistrict(value)}
                                                            multiline
                                                            value={district}
                                                        />
                                                        <View className="flex-row justify-between items-end mt-3">
                                                            <TouchableOpacity style={{ width:80, borderRadius:9 }} className="py-1 bg-red-500" onPress={() => setEditModalVisible(false)}>
                                                                <Text className="font-bold text-center">Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ width:80, borderRadius:9 }} className="py-1 bg-blue-500" onPress={editAddress}>
                                                                <Text className="font-bold text-center">Edit</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Modal>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View className="flex-row items-center mt-3 px-4">
                            <TouchableOpacity style={{ width:"100%" }} className="mr-2 flex-row py-1.5 rounded border-2 items-center justify-center border-green-600" onPress={() => setModalVisible(true)}>
                                <Icon.PlusCircle height="16" strokeWidth={3} width="16" stroke="#38a169" />
                                <Text className="ml-2 font-bold text-green-600 uppercase">Add Address</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal
                            visible={modalVisible}
                            animationType="slide"
                            transparent={true}
                        >
                            <View className="flex-1 justify-center items-center bg-gray-500">
                                <View style={{ width: 300}} className="bg-white py-5 px-3 rounded">
                                    <Text className="font-bold mt-2 text-lg text-center">Add Address</Text>
                                    {
                                        error != "" &&
                                        <View className="bg-red-300 mb-3 py-1.5 px-2 rounded">
                                            <Text className="text-red-800">{error}</Text>
                                        </View>
                                    }
                                    <Text className="font-bold">Landmark</Text>
                                    <TextInput
                                        className="mb-2 px-2 rounded border"
                                        placeholder='Building name or Streent No'
                                        onChangeText={(value) => setLandmark(value)}
                                        multiline
                                    />
                                    <Text className="font-bold">Locality</Text>
                                    <TextInput
                                        className="mb-2 px-2 rounded border"
                                        placeholder='Current Place'
                                        onChangeText={(value) => setLocality(value)}
                                        multiline
                                    />
                                    <Text className="font-bold">District</Text>
                                    <TextInput
                                        className="mb-10 px-2 rounded border"
                                        placeholder='District'
                                        onChangeText={(value) => setDistrict(value)}
                                        multiline
                                    />
                                    <View className="flex-row justify-between items-end mt-3">
                                        <TouchableOpacity style={{ width:80, borderRadius:9 }} className="py-1 bg-red-500" onPress={() => setModalVisible(false)}>
                                            <Text className="font-bold text-center">Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ width:80, borderRadius:9 }} className="py-1 bg-green-500" onPress={addAddress}>
                                            <Text className="font-bold text-center">Add</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        {
                            userDetails?.address.length > 4 &&
                            <Text style={{ fontSize:12 }} className="text-red-500 text-center mt-2">Note : You can only create a maximum of 5 addresses</Text>
                        }
                    </View>

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