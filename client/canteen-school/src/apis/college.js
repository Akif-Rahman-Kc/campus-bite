import { CollegeApi } from "../constant/constant";

////////////////////////////////////////////////////////// AUTH //////////////////////////////////////////////////////////

export const CollegeLoginApi = async (form_data) => {
    try {
        const { data } = await CollegeApi.post('/login', form_data)
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CollegeAuthApi = async (token) => {
    try {
        const { data } = await CollegeApi.post('/auth', {}, { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// STUDENT //////////////////////////////////////////////////////////

export const CollegeStudentList = async (token) => {
    try {
        const { data } = await CollegeApi.get('/student/list', { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CollegeStudentUpdate = async (token, form_data) => {
    try {
        const { data } = await CollegeApi.patch('/student/update', form_data, { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CollegeStudentStatusUpdate = async (token, form_data) => {
    try {
        const { data } = await CollegeApi.patch('/student/update-status', form_data, { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CollegeStudentDelete = async (token, _id) => {
    try {
        const { data } = await CollegeApi.delete(`/student/delete?_id=${_id}`, { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

//////////////////////////////////////////////////////////

export const CollegeStudentPaymentDues = async (token) => {
    try {
        const { data } = await CollegeApi.get('/student/payment-dues', { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// MENU //////////////////////////////////////////////////////////

export const CollegeMenuList = async (token) => {
    try {
        const { data } = await CollegeApi.get('/menu/list', { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}

////////////////////////////////////////////////////////// ORDER //////////////////////////////////////////////////////////

export const CollegeOrderList = async (token) => {
    try {
        const { data } = await CollegeApi.get('/order/list', { headers: { "collegetoken": token } })
        return data;
    } catch (error) {
        return false
    }
}