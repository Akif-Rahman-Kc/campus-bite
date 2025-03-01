import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Button, Modal, Alert, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Icon from "react-native-feather";
import { UserPwdUpdate} from '../apis/student-api';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../firebase/config';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export default function ForgotPwdScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE REFS //////////////////////////////////////////////////////
    const recaptchaVerifier = React.useRef(null)

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [otpBox, setOtpBox] = useState(false)
    const [passwordBox, setPasswordBox] = useState(false)
    const [newToggle, setNewToggle] = useState(true)
    const [confToggle, setConfToggle] = useState(true)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)
    //FormData
    const [phone_no, setPhoneNo] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confPassword, setConfPassword] = useState("")
    //Error
    const [error, setError] = useState("")
    //Otp
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpInputRefs = [];
    const [timer, setTimer] = useState(59); // Timer in seconds
    const [resendAllowed, setResendAllowed] = useState(false);
    const [timerShow, setTimerShow] = useState(false);
    const [verificationId, setVerificationId] = useState(null);

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    React.useEffect(() => {
        let intervalId;
    
        if (timer > 0) {
          intervalId = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
          }, 1000);
        } else {
          setResendAllowed(true);
          clearInterval(intervalId);
        }
    
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [timer]);

    ////////////////////////////////////////////////////// OTP ENTER //////////////////////////////////////////////////////
    const handleOtpChange = (index, value) => {
        // Update the OTP array with the new value
        const newOtp = [...otp];
        newOtp[index] = value;
    
        // Move focus to the next input or the previous if backspacing
        if (value !== '' && index < otp.length - 1) {
          otpInputRefs[index + 1].focus();
        } else if (value === '' && index > 0) {
          otpInputRefs[index - 1].focus();
        }
    
        // Set the new OTP value
        setOtp(newOtp);
    };

    ////////////////////////////////////////////////////// VERIFY PHONE NO //////////////////////////////////////////////////////
    const getOtp = async () => {
        if(phone_no !="" && phone_no.length == 10){
            setError("")
            const firebaseApp = initializeApp(firebaseConfig);
            const auth = getAuth(firebaseApp);
            const phoneProvider = new PhoneAuthProvider(auth);
            phoneProvider
                .verifyPhoneNumber("+91" + phone_no, recaptchaVerifier.current)
                .then((vid) => {
                    setError("")
                    setOtpBox(true)
                    setVerificationId(vid)
                    setTimerShow(true)
                    setResendAllowed(false)
                    setTimer(59)
                })
                .catch((error) => {
                    setResendAllowed(true)
                    if (error.code === 'auth/too-many-requests') {
                        alert("You got too many otp. Today your otp request is blocked. You can try after some time or tomorrow")
                    } else {
                        setError("Captcha verify process is failed please click resend otp")
                    }
                })
        }else{
            if (phone_no == "") {
                setError('Please enter Phone Number')
            } else {
                setError('Please enter valid Phone Number')
            }
        }
    }

    ////////////////////////////////////////////////////// VERIFY OTP //////////////////////////////////////////////////////
    const verifyOtp = async () => {
        if(phone_no != "" && otp != ""){
            setError("")
            let code = Object.values(otp);
            code = code.join();
            code = code.split(",").join("");
            const firebaseApp = initializeApp(firebaseConfig);
            const auth = getAuth(firebaseApp);
            const credential = PhoneAuthProvider.credential(
                verificationId,
                code
            )
            signInWithCredential(auth, credential)
            .then((res) => {
                setError("")
                setPasswordBox(true)
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-verification-code') {
                    setError("Otp is incorrect, Please try again")
                } else {
                    setError("Otp is Expired, Please click resend otp")
                }
            })
        }else{
            if (phone_no == "") {
                setError('Please enter phone_no')
            } else {
                setError('Please enter otp')
            }
        }
    }

    ////////////////////////////////////////////////////// PASSWORD CHANGE //////////////////////////////////////////////////////
    const passwordChange = async () => {
        if(newPassword != "" && confPassword != "" && phone_no != ""){
            if (newPassword == confPassword) {
                if( confPassword.length >= 8 ){
                    setError("")
                    setReloadModalVisible(true)
                    const response = await UserPwdUpdate({phone_no, password:confPassword, secret_code:"pwd#change$dont%try&another*way"})
                    setReloadModalVisible(false)
                    if (response.status == "success") {
                        setError("")
                        Alert.alert('Password Changed!', "Password successfully changed", [
                            {text: 'OK', onPress: () => console.log("ok")},
                        ]);
                        navigation.navigate('Login')
                    }else{
                        setError(response.message)
                    }
                } else {
                    setError('Minimum 8 character')
                }
            } else {
                setError("Password does not match")
            }
        }else{
            if (newPassword == "") {
                setError('Please enter New Password')
            } else if (confPassword == "") {
                setError('Please enter Confirm Password')
            } else {
                setError('Please enter Phone No')
            }
        }
    }

    ////////////////////////////////////////////////////// RESEND OTP //////////////////////////////////////////////////////
    const handleResendOTP = () => {
        if(phone_no !="" && phone_no.length == 10){
            setError("")
            const firebaseApp = initializeApp(firebaseConfig);
            const auth = getAuth(firebaseApp);
            const phoneProvider = new PhoneAuthProvider(auth);
            phoneProvider
                .verifyPhoneNumber("+91" + phone_no, recaptchaVerifier.current)
                .then((vid) => {
                    setError("")
                    setOtpBox(true)
                    setVerificationId(vid)
                    setTimerShow(true)
                    setResendAllowed(false)
                    setTimer(59)
                })
                .catch((error) => {
                    setResendAllowed(true)
                    if (error.code === 'auth/too-many-requests') {
                        alert("You got too many otp. Today your otp request is blocked. You can try after some time or tomorrow")
                    } else {
                        setError("Captcha verify process is failed please click resend otp")
                    }
                })
        }else{
            if (phone_no == "") {
                setError('Please enter Phone Number')
            } else {
                setError('Please enter valid Phone Number')
            }
        }
    }

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
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
                {/* verify phone no */}
                {
                    !passwordBox &&
                    <View style={{ minHeight: 480 }} className="p-3 mt-5">
                        <Text className="font-bold text-xl uppercase pb-2 text-center">Password Reset</Text>
                        <Text className="font-bold text-base">Phone No</Text>
                        <TextInput
                            keyboardType='numeric'
                            className="mb-2 p-2 rounded border font-semibold"
                            placeholder='Phone No'
                            onChangeText={(value) => {
                                setPhoneNo(value)
                                setOtpBox(false)
                            }}
                        />
                        {
                            otpBox && 
                            <>
                                <Text className="font-bold text-base text-center">Otp</Text>
                                <View className="flex-row justify-center">
                                    {otp.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            ref={(ref) => (otpInputRefs[index] = ref)}
                                            className="w-10 h-10 mr-3 rounded border text-center text-base font-bold"
                                            keyboardType="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChangeText={(value) => handleOtpChange(index, value)}
                                        />
                                    ))}
                                </View>
                            </>
                        }
                        <View className="items-center mt-5">
                            <Text>{timer > 0 && timerShow && `0:${timer}`}</Text>
                            {
                                resendAllowed &&
                                <TouchableOpacity className="py-1 px-2 bg-gray-300 rounded" onPress={handleResendOTP}>
                                    <Text className="font-bold">Resend OTP</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View className="mt-5">
                            {
                                otpBox ? <Button color="#222" title='submit otp' onPress={verifyOtp}/> : <Button color="#222" title='get otp' onPress={getOtp}/>
                            }
                        </View>
                    </View>
                }

                <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig}/>

                {/* password change */}
                {
                    passwordBox &&
                    <View style={{ minHeight: 480 }} className="p-3 mt-5">
                        <Text className="font-bold text-xl uppercase pb-2 text-center">Password Reset</Text>
                        <Text className="font-bold text-base">New Password</Text>
                        <View className="relative">
                            <TextInput
                                className="mb-1 p-2 rounded border pr-10 font-semibold"
                                placeholder='New Password'
                                secureTextEntry={newToggle}
                                onChangeText={(value) => setNewPassword(value)}
                            />
                            <TouchableOpacity className="absolute inset-y-4 right-1 flex items-center pr-2" onPress={() => setNewToggle(!newToggle)}>
                                {newToggle ? <Icon.Eye height="14" width="14" stroke="black"/> : <Icon.EyeOff height="14" width="14" stroke="black"/>}
                            </TouchableOpacity>
                        </View>
                        <Text className="font-bold text-base">Confirm Password</Text>
                        <View className="relative">
                            <TextInput
                                className="mb-1 p-2 rounded border pr-10 font-semibold"
                                placeholder='Confirm Password'
                                secureTextEntry={confToggle}
                                onChangeText={(value) => setConfPassword(value)}
                            />
                            <TouchableOpacity className="absolute inset-y-4 right-1 flex items-center pr-2" onPress={() => setConfToggle(!confToggle)}>
                                {confToggle ? <Icon.Eye height="14" width="14" stroke="black"/> : <Icon.EyeOff height="14" width="14" stroke="black"/>}
                            </TouchableOpacity>
                        </View>
                        <View className="mt-5">
                            <Button color="#222" title='submit' onPress={passwordChange}/>
                        </View>
                    </View>
                }
                
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
                <View style={{ backgroundColor:'rgba(255, 255, 255, 0.2)' }} className="flex-1 justify-center items-center bg-gray-500">
                    <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                        <Image source={require('../assets/images/logo-reload.gif')} className="h-20 w-20" />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}