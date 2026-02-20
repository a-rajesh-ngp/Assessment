import api from "./http";

export const signupApi = (payload) => {
    return api.post('/signup', payload)
}

export const loginApi = (payload) => {
    return api.post('/login', payload)
}