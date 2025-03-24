import axios from "axios";

export const StudentApi = axios.create({baseURL:"http://192.168.139.83:4000/"})