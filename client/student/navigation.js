import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPwdScreen from './screens/ForgotPwdScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MenuScreen from './screens/MenuScreen';
import AllMenuScreen from './screens/AllMenuScreen';
import OrderScreen from './screens/OrderScreen';
import CartScreen from './screens/CartScreen';
import PreparingOrderScreen from './screens/PreparingOrderScreen';
import SuccessScreen from './screens/SuccessScreen';
import PaymentScreen from './screens/PaymentScreen';
import NotificationScreen from './screens/NotificationScreen';
const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            {/* user */}
            {/* <Stack.Screen name="MainLogo" component={MainLogoScreen} /> */}
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPwd" component={ForgotPwdScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="AllMenu" component={AllMenuScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="Order" component={OrderScreen} />
            <Stack.Screen name="Payment" options={{ presentation: 'fullScreenModal', headerShown: false }} component={PaymentScreen} />
            <Stack.Screen name="Cart" options={{ presentation: 'modal', headerShown: false }} component={CartScreen} />
            <Stack.Screen name="PreparingOrder" options={{ presentation: 'fullScreenModal', headerShown: false }} component={PreparingOrderScreen} />
            <Stack.Screen name="Success" options={{ presentation: 'fullScreenModal', headerShown: false }} component={SuccessScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}