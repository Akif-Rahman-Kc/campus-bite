import { StudentApi } from "../constants/constant";

////////////////////////////////////////////////////////// S AUTH //////////////////////////////////////////////////////////

export const RegisterApi = async (formData) => {
    try {
        const {data} = await StudentApi.post('/register', formData)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentExistCheck = async (formData) => {
    try {
        const {data} = await StudentApi.post('/exist', formData)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const LoginApi = async (formData) => {
    try {
        const {data} = await StudentApi.post('/login', formData)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentAuthApi = async (token) => {
    try {
        const {data} = await StudentApi.post('/auth', {}, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// USER //////////////////////////////////////////////////////////

export const StudentDetails = async (_id, token) => {
    try {
        const {data} = await StudentApi.get(`/student/details?_id=${_id}`, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentPwdUpdate = async (formData) => {
    try {
        const {data} = await StudentApi.patch('/student/update-pwd', formData)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentCartCreate = async (formData, token) => {
    try {
        const {data} = await StudentApi.post('/student/cart/create', formData, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const StudentCartDelete = async (_id, cart_id, token) => {
    try {
        const {data} = await StudentApi.delete(`/student/cart/delete?_id=${_id}&&cart_id=${cart_id}`, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CartStockCheck = async (_id, token) => {
    try {
        const {data} = await StudentApi.get(`/student/cart/stock-check?_id=${_id}`, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// MENU //////////////////////////////////////////////////////////

export const MenuList = async (token) => {
    try {
        const {data} = await StudentApi.get('/menu/list', {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const MenuSearch = async (value, token) => {
    try {
        const {data} = await StudentApi.get(`/menu/search?value=${value}`, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// ORDER //////////////////////////////////////////////////////////

export const OrderCreate = async (formData, token) => {
    try {
        const {data} = await StudentApi.post('/order/create', formData, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const OrderList = async (student_id, token) => {
    try {
        const {data} = await StudentApi.get(`/order/list?student_id=${student_id}`, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const OrderDelete = async (id, token) => {
    try {
        const {data} = await StudentApi.delete(`/order/delete?id=${id}`, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const OrderPayment = async (formData, token) => {
    try {
        const {data} = await StudentApi.post('/order/payment', formData, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// NOTIFICATION //////////////////////////////////////////////////////////

export const NotificationList = async (student_id, token) => {
    try {
        const {data} = await StudentApi.get(`/notification/list?student_id=${student_id}`, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const NotificationStatusUpdate = async (formData, token) => {
    try {
        const {data} = await StudentApi.patch('/notification/status-update', formData, {headers:{"studenttoken":token}})
        return data;
    } catch (error) {
        return false
    }
}