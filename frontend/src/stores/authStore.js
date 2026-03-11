import { defineStore } from "pinia";
import { loginApi, signupApi } from "../services/authService";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', {
    state: () =>({
        loading: false,
        error: null,
        user: null,
        isAuthenticated: false,
        token: null
    }),
    actions: {
        async signup(formData) {
            try {
                this.loading = true
                this.error = null

                const response = await signupApi(formData)

                return response.data
            } catch(err) {
                const data = err.response?.data
                if(data?.errors?.length) {
                    this.error = data.errors[0].message 
                    console.log('error: ', this.error)
                } else {
                    this.error = data?.message || 'Signup failed'
                    console.log('error: ', this.error)
                }

                throw err
            } finally {
                this.loading = false
            }
        },

        async login(credentials) {
            try {
                this.loading = true
                this.error = null

                const res = await loginApi(credentials)
                const token = res.data.token

                Cookies.set('access_token', token, {
                    expires: 1,
                    secure: true,
                    sameSite: 'strict'
                })

                const decoded = jwtDecode(token)
                this.token = token
                this.user = decoded
                console.log('user: ', this.user)

                this.isAuthenticated = true
                return res.data

            } catch(err) {
                this.error = 'Invalid email or password'
                throw err
            } finally {
                this.loading = false
            }
        },

        logout() {
            Cookies.remove('access_token')
            this.isAuthenticated = false
            this.user = null
            this.token = null
        },

        restoreSession() {
            const token = Cookies.get('access_token')
            if(token) {
                this.token = token
                this.user = jwtDecode(token)
                this.isAuthenticated = true
            }
        }
    }
})
