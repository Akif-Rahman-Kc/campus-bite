import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function SuccessScreen() {

    const navigation = useNavigation();

    React.useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('Order');
        },1300);
    },[])

    return (
        <View style={{ minHeight: 900 }} className="items-center p-3 pt-52 bg-white">
            <ImageBackground className="mt-20" style={{ width:300, height:120 }} source={require('../assets/images/success-video.gif')}/>
            <Text style={{ fontSize:25 }} className="font-extrabold text-green-700">Order Successfully Placed</Text>
        </View>
    )
}