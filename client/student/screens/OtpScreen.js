import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Button, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Icon from "react-native-feather";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../firebase/config';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export default function OtpScreen() {

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE ROUTES //////////////////////////////////////////////////////
    const {params: {full_name, phone_no, password}} = useRoute();

    ////////////////////////////////////////////////////// USE REFS //////////////////////////////////////////////////////
    const recaptchaVerifier = React.useRef(null)

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpInputRefs = [];
    const [timer, setTimer] = useState(59); // Timer in seconds
    const [resendAllowed, setResendAllowed] = useState(false);
    const [timerShow, setTimerShow] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    //Error
    const [error, setError] = useState("")

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    React.useEffect(() => {
        setError("")
        const firebaseApp = initializeApp(firebaseConfig);
        const auth = getAuth(firebaseApp);
        const phoneProvider = new PhoneAuthProvider(auth);
        phoneProvider
            .verifyPhoneNumber("+91" + phone_no, recaptchaVerifier.current)
            .then((vid) => {
                setError("")
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
    }, []);

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

    ////////////////////////////////////////////////////// OTP SUBMIT //////////////////////////////////////////////////////
    const handleSubmit = async () => {
        if (full_name !="" && phone_no !="" && password != "") {
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
                const verify = true
                navigation.navigate('RegisterAddress',{
                    full_name, phone_no, password, verify
                })
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-verification-code') {
                    setError("Otp is incorrect, Please try again")
                } else {
                    setError("Otp is Expired, Please click resend otp")
                }
            })
        } else {
            navigation.navigate('Register')
        }
    }

    ////////////////////////////////////////////////////// RESEND OTP //////////////////////////////////////////////////////
    const handleResendOTP = () => {
        setError("")
        const firebaseApp = initializeApp(firebaseConfig);
        const auth = getAuth(firebaseApp);
        const phoneProvider = new PhoneAuthProvider(auth);
        phoneProvider
            .verifyPhoneNumber("+91" + phone_no, recaptchaVerifier.current)
            .then((vid) => {
                setError("")
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
    }

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        <>
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
                    {/* otp */}
                    <View style={{ minHeight: 480 }} className="p-3 mt-5">
                        <Text className="font-bold text-xl uppercase pb-2 text-center">Otp</Text>
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
                        <View className="items-center my-5">
                            <Text>{timer > 0 && timerShow && `0:${timer}`}</Text>
                            {
                                resendAllowed &&
                                <TouchableOpacity className="py-1 px-2 bg-gray-300 rounded" onPress={handleResendOTP}>
                                    <Text className="font-bold">Resend OTP</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig}/>
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
            </SafeAreaView>
        </>
    )
}