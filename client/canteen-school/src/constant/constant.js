import axios from "axios";

export const CanteenApi = axios.create({baseURL:"http://127.0.0.1:4000/canteen/"})
export const CollegeApi = axios.create({baseURL:"http://127.0.0.1:4000/college/"})