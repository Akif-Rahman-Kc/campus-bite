import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Button, Modal, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import * as Icon from "react-native-feather";
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RegisterApi, UserAuthApi } from '../apis/student-api';
import * as SecureStore from 'expo-secure-store';

export default function RegisterAddressScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE ROUTES //////////////////////////////////////////////////////
    const {params: {full_name, phone_no, password, verify}} = useRoute();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [render, setRender] = useState(false)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)
    //FormData
    const [landmark, setLandmark] = useState("")
    const [locality, setLocality] = useState("")
    const [district, setDistrict] = useState("")
    //Error
    const [error, setError] = useState("")

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData(){
                setRender(false)
                let token = await SecureStore.getItemAsync('UserAccessToken')
                if (token) {
                    setReloadModalVisible(true)
                    const response = await UserAuthApi(token)
                    setReloadModalVisible(false)
                    if (response.auth) {
                        navigation.navigate('Home')
                    } else {
                        setRender(true)
                    }
                } else {
                    setRender(true)
                }
            }
            fetchData()
        }, [])
    );

    ////////////////////////////////////////////////////// REGISTER SUBMIT //////////////////////////////////////////////////////
    const handleSubmit = async () => {
        const data = {
            full_name:full_name,
            phone_no:phone_no,
            password:password,
            verify:verify,
            address:{
                landmark:landmark,
                locality:locality,
                district:district,
                selected:true
            }
        }
        if(landmark !="" && locality !="" && district != ""){
            setError("")
            setReloadModalVisible(true)
            const response = await RegisterApi(data)
            setTimeout(() => {
                setReloadModalVisible(false)
            }, 1000);
            if (response.status == "success") {
                setError("")
                SecureStore.setItemAsync('UserAccessToken', response.token)
                navigation.navigate('Home')
            }else{
                setError(response.message)
            }
        }else{
            setError('Please enter your all address details')
        }
    }

    return (
        render ?
        <SafeAreaView className="bg-white" >
            <StatusBar
                barStyle="dark-content" 
            />
        
            {/* navbar */}
            <View style={{ backgroundColor:"#ffc803" }} className="flex-row items-center space-x-2 px-4 py-2">
                <Image source={require('../assets/images/logo.png')} className="h-14 w-28"/>
                <View className="flex-row flex-1 justify-end p-3">
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className="font-bold">Register</Text>
                    </TouchableOpacity>
                    <Text className="font-bold">   |   </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="font-bold">Login</Text> 
                    </TouchableOpacity>
                </View>
            </View>

            {/* error */}
            {
                error != "" &&
                <View className="bg-red-300 py-3 px-2">
                    <Text className="text-base text-red-800">{error}</Text>
                </View>
            }

            {/* main */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 50
                }}
            >
                {/* register address */}
                <View style={{ minHeight: 480 }} className="p-3 mt-5">
                    <Text className="font-bold text-xl uppercase pb-2 text-center">Address</Text>
                    <Text className="font-bold text-base">Landmark</Text>
                    <TextInput
                        className="mb-2 p-2 rounded border font-semibold"
                        placeholder='Building name or Streent No'
                        onChangeText={(value) => setLandmark(value)}
                        multiline
                    />
                    <Text className="font-bold text-base">Locality</Text>
                    <TextInput
                        className="mb-2 p-2 rounded border font-semibold"
                        placeholder='Current Place'
                        onChangeText={(value) => setLocality(value)}
                        multiline
                    />
                    <Text className="font-bold text-base">District</Text>
                    <TextInput
                        className="mb-10 p-2 rounded border font-semibold"
                        placeholder='District'
                        onChangeText={(value) => setDistrict(value)}
                        multiline
                    />
                    <Button color="#222" title='submit' onPress={handleSubmit}/>
                </View>
                
                {/* footer */}
                <View style={{backgroundColor: "#fce486"}} className="justify-center px-4 py-6 items-center">
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
                <View style={{ backgroundColor:'rgba(255, 255, 255, 1)' }} className="flex-1 justify-center items-center bg-gray-500">
                    <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                        <Image source={require('../assets/images/logo-reload.gif')} className="h-20 w-20" />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
        :
        <Modal
            visible={reloadModalVisible}
            transparent={true}
        >
            <View style={{ backgroundColor:'rgba(255, 255, 255, 1)' }} className="flex-1 justify-center items-center bg-gray-500">
                <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                    <Image source={require('../assets/images/logo-reload.gif')} className="h-20 w-20" />
                </View>
            </View>
        </Modal>
    )
}