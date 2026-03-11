import api from "./http";

export const signupApi = async (payload) => {
    return await api.post('/signup', payload)
}

export const loginApi = async(payload) => {
    return await api.post('/login', payload)
}