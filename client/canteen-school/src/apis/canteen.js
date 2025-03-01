import { CanteenApi } from "../constant/constant";

////////////////////////////////////////////////////////// AUTH //////////////////////////////////////////////////////////

export const CanteenLoginApi = async (form_data) => {
    try {
        const { data } = await CanteenApi.post('/login', form_data)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CanteenAuthApi = async (token) => {
    try {
        const { data } = await CanteenApi.post('/auth', {}, { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// STUDENT //////////////////////////////////////////////////////////

export const CanteenStudentList = async (token) => {
    try {
        const { data } = await CanteenApi.get('/student/list', { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CanteenStudentPaymentDues = async (token) => {
    try {
        const { data } = await CanteenApi.get('/student/payment-dues', { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// MENU //////////////////////////////////////////////////////////

export const CanteenMenuCreate = async (token, form_data) => {
    try {
        const { data } = await CanteenApi.post('/menu/create', form_data, { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CanteenMenuList = async (token) => {
    try {
        const { data } = await CanteenApi.get('/menu/list', { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CanteenMenuUpdate = async (token, form_data) => {
    try {
        const { data } = await CanteenApi.patch('/menu/update', form_data, { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CanteenMenuStatusUpdate = async (token, form_data) => {
    try {
        const { data } = await CanteenApi.patch('/menu/update-status', form_data, { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CanteenMenuDelete = async (token, _id) => {
    try {
        const { data } = await CanteenApi.delete(`/menu/delete?_id=${_id}`, { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// ORDER //////////////////////////////////////////////////////////

export const CanteenOrderList = async (token) => {
    try {
        const { data } = await CanteenApi.get('/order/list', { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CanteenOrderStatusUpdate = async (token, form_data) => {
    try {
        const { data } = await CanteenApi.patch('/order/update-status', form_data, { headers: { "canteentoken": token } })
        return data;
    } catch (error) {
        return false
    }
}