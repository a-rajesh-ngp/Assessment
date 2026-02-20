import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = Cookies.get('access_token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api