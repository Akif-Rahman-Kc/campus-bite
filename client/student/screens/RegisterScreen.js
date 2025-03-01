import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Button, Modal, Linking, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Icon from "react-native-feather";
import { UserAuthApi, UserExistCheck } from '../apis/student-api';
import * as SecureStore from 'expo-secure-store';

// {
//     "student_id": "IRFAD_00394",
//     "name": "irfad",
//     "mobile_no": "0000000000",
//     "age": "22",
//     "year": "First",
//     "department": "Mechanical",
//     "gender": "male",
//     "status": "ACTIVE"
// },

export default function RegisterScreen() {

    const navigation = useNavigation();
    const years = ['First', 'Second', 'Third', 'Fourth'];
    const departments = ['Mechanical', 'Electronical', 'Computer', 'Civil'];

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [render, setRender] = useState(false)
    const [toggle, setToggle] = useState(true)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)
    //FormData
    const [studentId, setStudentId] = useState("")
    const [fullName, setFullName] = useState("")
    const [year, setYear] = useState("")
    const [department, setDepartment] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [password, setPassword] = useState("")
    //Dropdown
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
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

    ////////////////////////////////////////////////////// REGISTER SUMBIT //////////////////////////////////////////////////////
    const   handleSubmit = async () => {
        navigation.navigate('Home')
        // if(studentId !="" && fullName !="" && mobileNo !="" && password != "" && age !="" && year !="" && department !="" && gender != ""){
        //     let reg_name =/^[a-zA-Z ]+$/;
        //     setError("")
        //     if(reg_name.test(fullName)){
        //         setError("")
        //         if(mobileNo.length == 10){
        //             setError("")
        //             if( password.length >= 8 ){
        //                 setError("")
        //                 const response = await RegisterApi({ studentId, fullName, mobileNo, password, age, year, department, gender })
        //                 if (response.status == "success") {
        //                     setError("")
        //                     SecureStore.setItemAsync('UserAccessToken', response.token)
        //                     navigation.navigate('Home')
        //                 } else {
        //                     setError(response.message)
        //                 }
        //             }else{
        //                 setError('Minimum 8 character')
        //             }
        //         }else{  
        //             setError('Please enter valid Phone Number')
        //         }
        //     }else{
        //         setError('Please enter valid Name')
        //     }
        // }else{
        //     setError('Please enter your all details')
        // }
    }

    const toggleCurrentYearDropdown = () => {
        setIsYearDropdownOpen(!isYearDropdownOpen);
    };

    const toggleDepartmentDropdown = () => {
        setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen);
    };

    const selectYear = (year) => {
        setYear(year);
        setIsYearDropdownOpen(false); // Close dropdown after selection
    };

    const selectDepartment = (department) => {
        setDepartment(department);
        setIsDepartmentDropdownOpen(false); // Close dropdown after selection
    };

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        render ?
        <SafeAreaView style={{ backgroundColor: "#121212" }} >
            {/* <StatusBar
                barStyle="light-content"
            /> */}
        
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
                {/* register */}
                <View style={{ minHeight: 480 }} className="p-3 mt-5">
                    <Text className="font-bold text-xl uppercase pb-4 text-center text-white">Register</Text>
                    <Text className="font-bold text-base text-gray-200">Student ID</Text>
                    <TextInput
                        className="mb-2 p-2 rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200"
                        placeholderTextColor="#A0A0A0"
                        placeholder='Enter your student id  -  eg:AKIF23484'
                        onChangeText={(value) => setStudentId(value)}
                    />
                    <Text className="font-bold text-base text-gray-200">Full Name</Text>
                    <TextInput
                        className="mb-2 p-2 rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200"
                        placeholderTextColor="#A0A0A0"
                        placeholder='Enter your full name'
                        onChangeText={(value) => setFullName(value)}
                    />
                    <Text className="font-bold text-base text-gray-200">Mobile No</Text>
                    <TextInput
                        keyboardType='numeric'
                        className="mb-2 p-2 rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200"
                        placeholderTextColor="#A0A0A0"
                        maxLength={10}
                        placeholder='Enter your mobile no'
                        onChangeText={(value) => setMobileNo(value)}
                    />
                    <Text className="font-bold text-base text-gray-200">Password</Text>
                    <View className="relative">
                        <TextInput
                            className="mb-2 p-2 rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200"
                            placeholderTextColor="#A0A0A0"
                            placeholder='Enter new password'
                            secureTextEntry={toggle}
                            onChangeText={(value) => setPassword(value)}
                        />
                        <TouchableOpacity className="absolute inset-y-4 right-1 flex items-center pr-2" onPress={() => setToggle(!toggle)}>
                            {toggle ? <Icon.Eye height="14" width="14" stroke="white"/> : <Icon.EyeOff height="14" width="14" stroke="white"/>}
                        </TouchableOpacity>
                    </View>
                    <Text className="font-bold text-base text-gray-200">Age</Text>
                    <TextInput
                        keyboardType='numeric'
                        className="mb-2 p-2 rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200"
                        placeholderTextColor="#A0A0A0"
                        maxLength={2}
                        placeholder='Enter your age'
                        onChangeText={(value) => setAge(value)}
                    />
                    <Text className="font-bold text-base text-gray-200">Current Year</Text>
                    <View className="relative">
                        <TouchableOpacity
                            onPress={toggleCurrentYearDropdown}
                            className="mb-2 px-2 py-3 rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200 flex-row justify-between items-center"
                        >
                            <Text className="text-gray-200 text-sm">
                                {year || 'Select your current year'}
                            </Text>
                            <Text className="text-gray-400">{isYearDropdownOpen ? '▲' : '▼'}</Text>
                        </TouchableOpacity>

                        {/* Dropdown list */}
                        {isYearDropdownOpen && (
                            <View className="absolute rounded-lg mt-9 w-full z-10 max-h-50 overflow-y-auto">
                                <View className="absolute border border-zinc-600 bg-zinc-800 rounded-lg mt-2 w-full z-10 max-h-50">
                                    {years.map((item) => (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => selectYear(item)}
                                            className="p-4"
                                        >
                                            <Text className="text-gray-200 text-sm">{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                    <Text className="font-bold text-base text-gray-200">Department</Text>
                    <View className="relative">
                        <TouchableOpacity
                            onPress={toggleDepartmentDropdown}
                            className="mb-2 px-2 py-3 rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200 flex-row justify-between items-center"
                        >
                            <Text className="text-gray-200 text-sm">
                                {department || 'Select your department'}
                            </Text>
                            <Text className="text-gray-400">{isDepartmentDropdownOpen ? '▲' : '▼'}</Text>
                        </TouchableOpacity>

                        {/* Dropdown list */}
                        {isDepartmentDropdownOpen && (
                            <View className="absolute rounded-lg mt-9 w-full z-10 max-h-50 overflow-y-auto">
                                <View className="absolute border border-zinc-600 bg-zinc-800 rounded-lg mt-2 w-full z-10 max-h-50">
                                    {departments.map((item) => (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => selectDepartment(item)}
                                            className="p-4"
                                        >
                                            <Text className="text-gray-200 text-sm">{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                    <Text className="font-bold text-base text-gray-200">Gender</Text>
                    <View className="w-full flex-row">
                        <View style={{ width:"30%" }} className="flex-row justify-center items-center">
                            {
                                gender == "male" ?
                                <TouchableOpacity onPress={() => setGender('male')} className="flex-row rounded-lg border border-zinc-500 bg-zinc-700 font-semibold text-gray-200 h-11 w-full justify-center items-center">
                                    <Text className="text-base text-white">Male</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => setGender('male')} className="flex-row rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200 h-11 w-full justify-center items-center">
                                    <Text className="text-base text-white">Male</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ width:"30%" }} className="flex-row justify-center items-center mx-5">
                            {
                                gender == "female" ?
                                <TouchableOpacity onPress={() => setGender('female')} className="flex-row rounded-lg border border-zinc-500 bg-zinc-700 font-semibold text-gray-200 h-11 w-full justify-center items-center">
                                    <Text className="text-base text-white">Female</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => setGender('female')} className="flex-row rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200 h-11 w-full justify-center items-center">
                                    <Text className="text-base text-white">Female</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ width:"30%" }} className="flex-row justify-center items-center">
                            {
                                gender == "other" ?
                                <TouchableOpacity onPress={() => setGender('other')} className="flex-row rounded-lg border border-zinc-500 bg-zinc-700 font-semibold text-gray-200 h-11 w-full justify-center items-center">
                                    <Text className="text-base text-white">Other</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => setGender('other')} className="flex-row rounded-lg border border-zinc-600 bg-zinc-800 font-semibold text-gray-200 h-11 w-full justify-center items-center">
                                    <Text className="text-base text-white">Other</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <TouchableOpacity style={{ backgroundColor:"#ffc803" }} className="rounded-lg py-2.5 mt-10 mb-3" onPress={handleSubmit}>
                        <Text className="font-extrabold text-center text-base">REGISTER</Text>
                    </TouchableOpacity>
                </View>
                
                {/* footer */}
                <View style={{backgroundColor: "#f5d45d"}} className="justify-center px-4 py-6 items-center">
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