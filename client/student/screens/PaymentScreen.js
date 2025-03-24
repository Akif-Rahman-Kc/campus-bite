import { View, Image, TextInput, TouchableOpacity, Text, Modal, Alert } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { OrderCreate, OrderPayment } from '../apis/student-api';
import { useState } from 'react';

export default function PaymentScreen() {
  
    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE ROUTES //////////////////////////////////////////////////////
    const {params:{ order_id }} = useRoute();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [utr, setUtr] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [successModal, setSuccessModal] = useState(false)
    const [failedModal, setFailedModal] = useState(false)

    ////////////////////////////////////////////////////// SUBMIT UTR //////////////////////////////////////////////////////
    const submitUTR = () => {
        if (!utr) {
            Alert.alert("Error", "Please enter a UTR.");
            return;
        }
        setModalVisible(true);
    };

    // Handle Success/Failure
    const handlePaymentStatus = async (status) => {
        if (status === "Success") {
            let token = await SecureStore.getItemAsync('UserAccessToken')
            const response = await OrderPayment({_id: order_id}, token)
            if (response.status == "success") {
                setModalVisible(false);
                setSuccessModal(true)
            } else{
                setModalVisible(false);
                setFailedModal(true)
            }
        } else {
            setModalVisible(false);
            setFailedModal(true)
        }
        setTimeout(() => {
            navigation.navigate("Order");
        }, 3000);
    };

    return (
        <View className="flex-1 bg-gray-100 items-center p-4">
            
            {/* Dummy QR Scanner Image */}
            <Image source={require('../assets/images/qr.jpg')} className="h-60 w-60 mt-20"/>

            {/* UTR Input Field */}
            <TextInput 
                className="border border-gray-300 px-4 py-2 rounded-lg w-full mb-4 bg-white mt-8"
                placeholder="Enter UTR Number"
                value={utr}
                onChangeText={setUtr}
            />

            {/* Submit UTR Button */}
            <TouchableOpacity 
                onPress={submitUTR} 
                className="bg-blue-600 px-6 py-3 rounded-lg w-full items-center"
            >
                <Text className="text-white text-lg font-bold">Submit UTR</Text>
            </TouchableOpacity>

            <Image source={require('../assets/images/upi.jpg')} className="h-28 rounded-lg w-40 mt-10"/>

            {/* Custom Payment Status Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-80 p-6 rounded-lg items-center">
                        <Text className="text-xl font-bold mb-4">Confirm Payment</Text>

                        <TouchableOpacity 
                            onPress={() => handlePaymentStatus("Success")} 
                            className="bg-green-500 px-6 py-3 rounded-lg w-full mb-3 items-center"
                        >
                            <Text className="text-white text-lg font-bold">Success</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => handlePaymentStatus("Failed")} 
                            className="bg-red-500 px-6 py-3 rounded-lg w-full items-center"
                        >
                            <Text className="text-white text-lg font-bold">Failed</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={successModal}
                onRequestClose={() => setSuccessModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-80 p-6 rounded-lg items-center">
                        <Image source={require('../assets/images/track-completed.png')} className="h-16 w-16"/>
                        <Text className="text-green-700 text-lg font-bold mt-3">Success</Text>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={failedModal}
                onRequestClose={() => setFailedModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-80 p-6 rounded-lg items-center">
                        <Image source={require('../assets/images/failed.png')} className="h-16 w-16"/>
                        <Text className="text-red-700 text-lg font-bold mt-3">Failed</Text>
                    </View>
                </View>
            </Modal>
        </View>
    )
}