import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useAuthStore } from "../stores/authStore.js"

export function authGaurd(to) {
    if(!to.meta.requiresAuth) {
        return true
    }
    
    const token = Cookies.get('access_token')
    if(!token) {
        return '/login'
    }

    try {
        const decoded = jwtDecode(token)
        const now = Date.now() / 1000
        if(decoded.exp < now) {
            Cookies.remove('access_token')
            return '/login'
        }
        
        const authStore = useAuthStore()
        if(!authStore.user) {
            authStore.user = decoded
            authStore.token = token
        }
        return true
    } catch(err) {
        Cookies.remove('access_token')
        return '/login'
    }
}