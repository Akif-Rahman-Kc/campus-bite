import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert, Modal, Animated, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from "react-native-feather";
import { StatusBar } from 'expo-status-bar';
import Categories from '../components/categories';
import FeatureRow from '../components/featuredRow';
import { useState } from 'react';
import DishRow from '../components/dishRow';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CartIcon from '../components/cartIcon';
import * as SecureStore from 'expo-secure-store';
import { ComboList, MenuList, MenuSearch, UserAuthApi, UserDetails } from '../apis/student-api';
import BottomNavbar from '../components/bottomNavbar';

const static_user = {
    "_id": {
      "$oid": "65564713f2327a5d0b39c887"
    },
    "full_name": "Akif Rahman",
    "phone_no": "1234567890",
    "password": "$2b$10$RaMAzp3BjjuAHWIvBl7qFex2ymOw0LDZA21fSlQXf2M52FwwmkFdO",
    "status": true,
    "created_at": {
      "$numberLong": "1700153107082"
    },
    "address": [
      {
        "landmark": "Jumath Palli",
        "locality": "Madakkara",
        "district": "Kannur",
        "selected": true,
        "_id": {
          "$oid": "65564713f2327a5d0b39c888"
        }
      },
      {
        "landmark": "Othayarkkam",
        "locality": "Mattool",
        "district": "Kannur",
        "selected": false,
        "_id": {
          "$oid": "6564dfc71a1cf793b3f1d8f1"
        }
      }
    ],
    "cart": [
      {
        "item_id": "6557b4593f446d7459c4bc34",
        "item_name": "Non-Veg Salad",
        "item_image": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700246620/wngvkkgauurnu4vpqpgv.jpg",
        "quantity": 1,
        "item_total_price": 100,
        "_id": {
          "$oid": "6613b2e216b64488c405391b"
        }
      }
    ],
    "__v": 0
}

const static_menus = [{
    "_id": {
      "$oid": "6557948eff8442dfccde970e"
    },
    "name": "Salad",
    "image": {
      "public_id": "ikn16spjjqrn9nuxzdsb",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700238480/ikn16spjjqrn9nuxzdsb.jpg"
    },
    "created_at": {
      "$numberLong": "1700238478371"
    },
    "rating": 4.2,
    "rating_count": 4,
    "items": [
      {
        "name": "Non-Veg Salad",
        "price": 100,
        "description": "Its Spicy",
        "image": {
          "public_id": "wngvkkgauurnu4vpqpgv",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700246620/wngvkkgauurnu4vpqpgv.jpg"
        },
        "stock": true,
        "_id": {
          "$oid": "6557b4593f446d7459c4bc34"
        },
        "rating": 4.3,
        "rating_count": 3
      },
      {
        "name": "Veg-Salad",
        "price": 80,
        "description": "Its Sweety",
        "image": {
          "public_id": "lv5yrh659scppzxsjltv",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700246811/lv5yrh659scppzxsjltv.jpg"
        },
        "stock": true,
        "_id": {
          "$oid": "6557b5193f446d7459c4bc3c"
        },
        "rating": 4.5,
        "rating_count": 2
      }
    ],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "656315dfc4d13b8ca02e8147"
    },
    "name": "Burger",
    "image": {
      "public_id": "uooq66yp6krd8z6idsm2",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700992479/uooq66yp6krd8z6idsm2.jpg"
    },
    "created_at": {
      "$numberLong": "1700992479773"
    },
    "rating": 5,
    "rating_count": 1,
    "items": [],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "65631633c4d13b8ca02e814c"
    },
    "name": "Kabab",
    "image": {
      "public_id": "e3iiglvxsvquq8yhxu27",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700992562/e3iiglvxsvquq8yhxu27.jpg"
    },
    "created_at": {
      "$numberLong": "1700992563495"
    },
    "rating": 5,
    "rating_count": 1,
    "items": [],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "65631758c4d13b8ca02e8151"
    },
    "name": "Soup",
    "image": {
      "public_id": "zggtbbwck7xb7zwttgry",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700992856/zggtbbwck7xb7zwttgry.jpg"
    },
    "created_at": {
      "$numberLong": "1700992856740"
    },
    "rating": 5,
    "rating_count": 1,
    "items": [],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6563177fc4d13b8ca02e8156"
    },
    "name": "Sandwich",
    "image": {
      "public_id": "tts7lsrv3tmuqxwr1r8f",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700992895/tts7lsrv3tmuqxwr1r8f.jpg"
    },
    "created_at": {
      "$numberLong": "1700992895906"
    },
    "rating": 5,
    "rating_count": 1,
    "items": [],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6563179ac4d13b8ca02e815b"
    },
    "name": "Shake",
    "image": {
      "public_id": "glfjtwbzn76kks0elros",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700992921/glfjtwbzn76kks0elros.jpg"
    },
    "created_at": {
      "$numberLong": "1700992922461"
    },
    "rating": 5,
    "rating_count": 1,
    "items": [],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "656317bec4d13b8ca02e8160"
    },
    "name": "Mojito",
    "image": {
      "public_id": "vo94ofdrraqiqdxbcwht",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700992957/vo94ofdrraqiqdxbcwht.jpg"
    },
    "created_at": {
      "$numberLong": "1700992958591"
    },
    "rating": 5,
    "rating_count": 1,
    "items": [],
    "__v": 0
  }
]

const static_combos = [{
    "_id": {
      "$oid": "655a36eb40a544df465774c1"
    },
    "name": "Combo - 399",
    "image": {
      "public_id": "gtite1qmjzfjhcmbcdy2",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411119/gtite1qmjzfjhcmbcdy2.jpg"
    },
    "old_price": 470,
    "offer_price": 399,
    "created_at": {
      "$numberLong": "1700411115357"
    },
    "rating": 4.5,
    "rating_count": 2,
    "items": [
      {
        "name": "Fried Chicken",
        "quantity": "10 Pcs",
        "image": {
          "public_id": "rszpfu4q0ugrhgvuje8u",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700413181/rszpfu4q0ugrhgvuje8u.png"
        },
        "_id": {
          "$oid": "655a3efd40a544df46577805"
        }
      },
      {
        "name": "Mayonnaise",
        "quantity": "1",
        "image": {
          "public_id": "whbmhnbidbrshwsg1iq5",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700414881/whbmhnbidbrshwsg1iq5.jpg"
        },
        "_id": {
          "$oid": "655a45a19d7fa51509adc42d"
        }
      }
    ],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "655a37ce40a544df465774de"
    },
    "name": "Combo - 540",
    "image": {
      "public_id": "okwu7uoojzb2fqs4vycu",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411346/okwu7uoojzb2fqs4vycu.jpg"
    },
    "old_price": 620,
    "offer_price": 540,
    "created_at": {
      "$numberLong": "1700411342246"
    },
    "rating": 5,
    "rating_count": 1,
    "items": [
      {
        "name": "Al-Fahm",
        "quantity": "Full",
        "image": {
          "public_id": "a13ufrrw9mqhjpqp6cq8",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700412411/a13ufrrw9mqhjpqp6cq8.png"
        },
        "_id": {
          "$oid": "655a3bf740a544df46577538"
        }
      },
      {
        "name": "Fried Chicken",
        "quantity": "2 Pcs",
        "image": {
          "public_id": "mnh6goz76prlx92apisa",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700412520/mnh6goz76prlx92apisa.png"
        },
        "_id": {
          "$oid": "655a3c6540a544df46577562"
        }
      },
      {
        "name": "Crispy Roll",
        "quantity": "1",
        "image": {
          "public_id": "lj5znwh70f6e2yrkmc0e",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700412704/lj5znwh70f6e2yrkmc0e.jpg"
        },
        "_id": {
          "$oid": "655a3d2040a544df4657756f"
        }
      },
      {
        "name": "Chicken Fried Rice",
        "quantity": "1",
        "image": {
          "public_id": "bbprukaa9ez4wngno9r1",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700413592/bbprukaa9ez4wngno9r1.jpg"
        },
        "_id": {
          "$oid": "655a409940a544df4657783b"
        }
      },
      {
        "name": "Kubbus",
        "quantity": "5",
        "image": {
          "public_id": "zyeu3x54dnzu7bpktxjm",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700414687/zyeu3x54dnzu7bpktxjm.jpg"
        },
        "_id": {
          "$oid": "655a44df9d7fa51509adc3f7"
        }
      },
      {
        "name": "Mayonnaise",
        "quantity": "1",
        "image": {
          "public_id": "gtvv7pr4suzlmyy1ifax",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700414758/gtvv7pr4suzlmyy1ifax.jpg"
        },
        "_id": {
          "$oid": "655a45269d7fa51509adc408"
        }
      },
      {
        "name": "Salad",
        "quantity": "1",
        "image": {
          "public_id": "nlcpdml0ptamkqjntk2k",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700414786/nlcpdml0ptamkqjntk2k.jpg"
        },
        "_id": {
          "$oid": "655a45429d7fa51509adc41a"
        }
      }
    ],
    "__v": 0
  },
  {
    "_id": {
      "$oid": "655a382a40a544df465774e1"
    },
    "name": "Combo - 999",
    "image": {
      "public_id": "xykfdisf6gsvanrsy32x",
      "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411438/xykfdisf6gsvanrsy32x.jpg"
    },
    "old_price": 1200,
    "offer_price": 999,
    "created_at": {
      "$numberLong": "1700411434029"
    },
    "rating": 4.5,
    "rating_count": 2,
    "items": [
      {
        "name": "Al-Fahm",
        "quantity": "Full",
        "image": {
          "public_id": "xy65ybyalqydstr1t10g",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411492/xy65ybyalqydstr1t10g.png"
        },
        "_id": {
          "$oid": "655a386040a544df465774e4"
        }
      },
      {
        "name": "Fried Cicken",
        "quantity": "10 Pcs",
        "image": {
          "public_id": "bqlmr6dpdcfxguewgfsi",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411593/bqlmr6dpdcfxguewgfsi.png"
        },
        "_id": {
          "$oid": "655a38c540a544df465774e8"
        }
      },
      {
        "name": "Chickpop",
        "quantity": "1",
        "image": {
          "public_id": "zpm8oufgzplolsc8torw",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411705/zpm8oufgzplolsc8torw.jpg"
        },
        "_id": {
          "$oid": "655a393640a544df465774ed"
        }
      },
      {
        "name": "Porotta",
        "quantity": "7",
        "image": {
          "public_id": "g27ymi3ayhag0em3t1jb",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411779/g27ymi3ayhag0em3t1jb.jpg"
        },
        "_id": {
          "$oid": "655a397f40a544df465774f3"
        }
      },
      {
        "name": "Chicken Manchurian",
        "quantity": "Half",
        "image": {
          "public_id": "ro8nua4pjt3wbrzski4n",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411941/ro8nua4pjt3wbrzski4n.jpg"
        },
        "_id": {
          "$oid": "655a3a2140a544df465774fa"
        }
      },
      {
        "name": "Kubbus",
        "quantity": "10",
        "image": {
          "public_id": "na0ahnyzimhotvevqodi",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700411994/na0ahnyzimhotvevqodi.jpg"
        },
        "_id": {
          "$oid": "655a3a5640a544df46577502"
        }
      },
      {
        "name": "Mayonnaise",
        "quantity": "1",
        "image": {
          "public_id": "vyliiu03efmdbeiawmv6",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700412106/vyliiu03efmdbeiawmv6.jpg"
        },
        "_id": {
          "$oid": "655a3ac640a544df4657750b"
        }
      },
      {
        "name": "Salad",
        "quantity": "1",
        "image": {
          "public_id": "ias5ouabmbtbljaqgpvy",
          "path": "https://res.cloudinary.com/dzmdx3qel/image/upload/v1700412146/ias5ouabmbtbljaqgpvy.jpg"
        },
        "_id": {
          "$oid": "655a3aee40a544df46577515"
        }
      }
    ],
    "__v": 0
  }
]

export default function HomeScreen() {

    const static_cart_total = static_user.cart.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.item_total_price;
    }, 0);

    const navigation = useNavigation();

    ////////////////////////////////////////////////////// USE REFS //////////////////////////////////////////////////////
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    ////////////////////////////////////////////////////// USE STATES //////////////////////////////////////////////////////
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchbox, setSearchBox] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [searchMenus, setSearchMenus] = useState([])
    const [menus, setMenus] = useState(static_menus)
    const [combos, setCombos] = useState(static_combos)
    //UserDetails
    const [user, setUser] = useState(static_user)
    const [cart, setCart] = useState(static_user.cart)
    const [cartTotal, setCartTotal] = useState(static_cart_total ? static_cart_total : null)
    //Modal
    const [ reloadModalVisible, setReloadModalVisible ] = useState(false)

    ////////////////////////////////////////////////////// USE FOCUS EFFECTS //////////////////////////////////////////////////////
    // useFocusEffect(
    //     React.useCallback(() => {
    //         async function fetchData(){
    //             let token = await SecureStore.getItemAsync('UserAccessToken')
    //             if (token) {
    //                 const response = await UserAuthApi(token)
    //                 if (!response.auth) {
    //                     if (response.message) {
    //                         Alert.alert('Blocked!', response.message, [
    //                             {text: 'OK', onPress: () => navigation.navigate('Login')},
    //                         ]);
    //                     } else {
    //                         navigation.navigate('Login')
    //                     }
    //                 } else {
    //                     setUser(response.user_details)
    //                 }
    //             } else {
    //                 navigation.navigate('Login')
    //             }
    //         }
    //         fetchData()
    //     }, [])
    // );

    // useFocusEffect(
    //     React.useCallback(() => {
    //         async function fetchData(){
    //             let token = await SecureStore.getItemAsync('UserAccessToken')
    //             const response = await MenuList(token)
    //             if (response.status == "success" ) {
    //                 setMenus(response.menus)
    //             }else{
    //                 alert(response.message ? response.message : "Please go to the back and try agian")
    //             }
    //         }
    //         fetchData()
    //     },[])
    // );

    // useFocusEffect(
    //     React.useCallback(() => {
    //         async function fetchData(){
    //             let token = await SecureStore.getItemAsync('UserAccessToken')
    //             // setReloadModalVisible(true)
    //             const response = await ComboList(token)
    //             // setReloadModalVisible(false)
    //             if (response.status == "success" ) {
    //                 setCombos(response.combos)
    //             }else{
    //                 alert(response.message ? response.message : "Please go to the back and try agian")
    //             }
    //         }
    //         fetchData()
    //     },[])
    // );

    ////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
    // React.useEffect(() => {
    //     async function fetchData(){
    //         let token = await SecureStore.getItemAsync('UserAccessToken')
    //         if (user?.id) {
    //             const response = await UserDetails(user.id, token)
    //             if (response.status == "success" ) {
    //                 setCart(response.user.cart)
    //                 const total = response.user.cart.reduce((accumulator, currentValue) => {
    //                     return accumulator + currentValue.item_total_price;
    //                 }, 0);
    //                 setCartTotal(total)
    //             }else{
    //                 alert(response.message ? response.message : "Please go to the back and try agian")
    //             }
    //         }
    //     }
    //     fetchData()
    // },[user, refresh])

    // React.useEffect(() => {
    //     const startAnimation = () => {
    //     Animated.loop(
    //         Animated.timing(animatedValue, {
    //         toValue: 1,
    //         duration: 30000, // Adjust duration as needed
    //         useNativeDriver: true,
    //         })
    //     ).start();
    //     };
    
    //     startAnimation();
    // }, [animatedValue]);

    ////////////////////////////////////////////////////// SEARCH //////////////////////////////////////////////////////
    const search = async (text) => {
        let token = await SecureStore.getItemAsync('UserAccessToken')
        const response = await MenuSearch(text, token)
        if (response.status == "success" ) {
            setSearchMenus(response.menus)
        }
    }

    ////////////////////////////////////////////////////// MAIN RETURN //////////////////////////////////////////////
    return (
        <>
            <BottomNavbar now={"home"} setActiveCategory={setActiveCategory} />
            {activeCategory != null && <CartIcon cart={cart} cart_total={cartTotal}/>}
            <SafeAreaView style={{ backgroundColor: "#121212" }} >
                <StatusBar
                    barStyle="dark-content" 
                />
                {/* <View className="justify-center items-center p-1">
                    <Text className="text-lg font-bold">CAFE ARRIVAL</Text>
                </View> */}
            
                {/* navbar */}
                <View style={{ backgroundColor:"#ffc803" }} className="flex-row items-center space-x-2 px-4 py-2">
                    <Image source={require('../assets/images/logo.png')} className="h-14 w-28"/>
                    <View style={{ width: "68%", borderRadius: 50 }} className="flex-row space-x-2 items-center p-3 border border-gray-800">
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

                {/* main */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 50
                    }}
                >
                
                    {/* categories */}
                    <Categories menus={menus} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

                    {
                        activeCategory == null ?
                            <View style={{ minHeight:430 }} className="mt-5">
                                {combos.length > 0 &&
                                    <FeatureRow menus={combos} combo={true}/>
                                }
                                {menus.length > 0 &&
                                    <FeatureRow menus={menus} combo={false}/>
                                }
                            </View>
                        :
                            <View style={{ minHeight:400 }} className="mt-5">
                                {
                                    menus[activeCategory].items.length > 0 ?
                                    menus[activeCategory].items.map(item=>{
                                        return (
                                            <DishRow
                                                key={item._id}
                                                id={item._id}
                                                name={item.name}
                                                description={item.description}
                                                price={item.price}
                                                image={item.image}
                                                rating={item.rating}
                                                rating_count={item.rating_count}
                                                stock={item.stock}
                                                cart={cart}
                                                user_id={user?.id}
                                                refresh={refresh}
                                                setRefresh={setRefresh}
                                            />
                                        )
                                    })
                                    :
                                    <View className="items-center bg-white py-28">
                                        <Icon.XCircle height="100" width="100" strokeWidth={2} stroke="#b0aeae"/>
                                        <Text style={{ fontWeight: '900', color:'#b0aeae' }} className="text-xl">No Items</Text>
                                    </View>
                                }
                            </View>
                    }
                    

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
                    <View style={{ backgroundColor:'rgba(255, 255, 255, 1)', top:72 }} className="flex-1 justify-center items-center bg-gray-500">
                        <View style={{ width: 1000, height:1000, backgroundColor:'rgba(255, 255, 255, 0.1)'}} className="py-5 px-3 rounded justify-center items-center">
                            <Image source={require('../assets/images/logo-reload.gif')} className="h-20 w-20" />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    )
}