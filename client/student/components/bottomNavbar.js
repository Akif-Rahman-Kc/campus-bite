import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import * as Icon from "react-native-feather";

export default function BottomNavbar({ now, setActiveCategory }) {
    
    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [active, setActive] = useState(now);

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    useFocusEffect(
        React.useCallback(() => {
            setActive(now)
        }, [])
    );

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////////////
    return (
        <View style={{ backgroundColor:"#27272a" }} className="absolute bottom-0 w-full z-50">
            <View className="flex-row w-full justify-between items-center py-3">
                <TouchableOpacity
                onPress={() => {
                    setActive("home")
                    setActiveCategory(null)
                    navigation.navigate("Home")
                }}
                style={{ width:"20%" }} className="justify-between items-center">
                    <Image style={{ tintColor: active == "home" ? '#ffc803' : '#f7f7f7' }} className={ active == "home" ? "h-10 w-10" : "h-8 w-8" } source={require('../assets/images/home.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => {
                    setActive("library")
                    navigation.navigate("AllMenu")
                }}
                style={{ width:"20%" }} className="justify-between items-center">
                    <Image style={{ tintColor: active == "menu" ? '#ffc803' : '#f7f7f7' }} className={ active == "menu" ? "h-8 w-8" : "h-6 w-6" } source={require('../assets/images/menu.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => {
                    setActive("premium")
                    navigation.navigate("AllMenu")
                }}
                style={{ width:"20%" }} className="justify-between items-center">
                    <Image style={{ tintColor: active == "offer" ? '#ffc803' : '#f7f7f7' }} className={ active == "offer" ? "h-9 w-9" : "h-7 w-7" } source={require('../assets/images/offer.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => {
                    setActive("settings")
                    navigation.navigate("Settings")
                }}
                style={{ width:"20%" }} className="justify-between items-center">
                    <Image style={{ tintColor: active == "profile" ? '#ffc803' : '#f7f7f7' }} className={ active == "profile" ? "h-9 w-9" : "h-7 w-7" } source={require('../assets/images/profile.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}