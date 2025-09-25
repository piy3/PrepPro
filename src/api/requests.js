import api from "./interceptor";

export const login = (data)=>{
    return  api.post(`/api/v1/user/login`, data);
}

export const authUser =async ()=>{
    return await api.post(`/api/v1/user/authuser`)
}