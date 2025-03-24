import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Button, Modal, Alert, Linking } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Icon from "react-native-feather";
import { LoginApi, StudentAuthApi } from '../apis/student-api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [openSecret, setOpenSecret] = useState(false);
    const [render, setRender] = useState(false);
    const [toggle, setToggle] = useState(true);
    //Modal
    const [reloadModalVisible, setReloadModalVisible] = useState(false);
    //FormData
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    //Error
    const [error, setError] = useState("");

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                setRender(false);
                let token = await SecureStore.getItemAsync('UserAccessToken');
                if (token) {
                    setReloadModalVisible(true);
                    const response = await StudentAuthApi(token);
                    setReloadModalVisible(false);
                    if (response.auth) {
                        navigation.navigate('Home');
                    } else {
                        setRender(true);
                    }
                } else {
                    setRender(true);
                }
            }
            fetchData();
        }, [])
    );

    ////////////////////////////////////////////////////// LOGIN SUMBIT //////////////////////////////////////////////////////
    const handleSubmit = async () => {
        if (studentId !== "" && password !== "") {
            setError("");
            setReloadModalVisible(true);
            const response = await LoginApi({ student_id: studentId, password });
            setTimeout(() => {
                setReloadModalVisible(false);
            }, 1000);
            console.log(response, "===response");
            
            if (response.status === "success") {
                setError("");
                SecureStore.setItemAsync('UserAccessToken', response.token);
                navigation.navigate('Home');
            } else {
                if (response.blocked) {
                    Alert.alert('Blocked!', response.message, [
                        { text: 'OK', onPress: () => console.log("ok") },
                    ]);
                } else {
                    setError(response.message);
                }
            }
        } else {
            if (studentId === "") {
                setError('Please enter student id');
            } else {
                setError('Please enter password');
            }
        }
    };

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        render ?
            <SafeAreaView style={{ backgroundColor: "#FFFFFF" }} >

                {/* navbar */}
                <View style={{ backgroundColor: "#ffc803" }} className="flex-row items-center space-x-2 px-4 py-2">
                    <TouchableOpacity onPress={() => setOpenSecret(!openSecret)}>
                        <Image source={require('../assets/images/logo.png')} className="h-14 w-28" />
                    </TouchableOpacity>
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
                    error !== "" &&
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
                    {/* login */}
                    <View style={{ minHeight: 480 }} className="p-3 mt-5">
                        <Text className="font-bold text-xl uppercase pb-4 text-center text-black">Login</Text>
                        <Text className="font-bold text-base text-gray-800">Student ID</Text>
                        <TextInput
                            className="mb-2 p-2 rounded-lg border border-zinc-600 bg-zinc-200 font-semibold text-gray-800"
                            placeholderTextColor="#A0A0A0"
                            placeholder='Enter your student id  -  eg:AKIF23484'
                            onChangeText={(value) => setStudentId(value)}
                        />
                        <Text className="font-bold text-base text-gray-800">Password</Text>
                        <View className="relative">
                            <TextInput
                                className="mb-1 p-2 rounded-lg border border-zinc-600 bg-zinc-200 font-semibold text-gray-800"
                                placeholderTextColor="#A0A0A0"
                                placeholder='Password'
                                secureTextEntry={toggle}
                                onChangeText={(value) => setPassword(value)}
                            />
                            <TouchableOpacity className="absolute inset-y-4 right-1 flex items-center pr-2" onPress={() => setToggle(!toggle)}>
                                {toggle ? <Icon.Eye height="14" width="14" stroke="black" /> : <Icon.EyeOff height="14" width="14" stroke="black" />}
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity className="ml-auto" onPress={() => navigation.navigate('ForgotPwd')}>
                            <Text className="text-blue-700">Forgot password</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ backgroundColor: "#ffc803" }} className="rounded-lg py-2.5 mt-10 mb-3" onPress={handleSubmit}>
                            <Text className="font-extrabold text-center text-base">LOGIN</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        openSecret &&
                        <View className="flex-row flex-1 py-3 px-5">
                            <TouchableOpacity onPress={() => navigation.navigate('VendorLogin')} className="flex-1 bg-gray-800 py-1 mx-2 rounded">
                                <Text className="font-bold text-center text-white">Vendor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} className="flex-1 bg-gray-800 py-1 mx-2 rounded">
                                <Text className="font-bold text-center text-white">Admin</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* footer */}
                    <View style={{ backgroundColor: "#f5d45d" }} className="justify-center px-4 py-6 items-center">
                        <Image source={require('../assets/images/ready-dish.gif')} className="w-20 h-20 rounded-full" />
                        <Text className="flex-1 pl-4 text-base text-blcak font-semibold">Open - 8:00 PM - 10:00 PM</Text>
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
            :
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
    );
}
