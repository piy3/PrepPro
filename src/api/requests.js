import api from "./interceptor";

//user apis
export const login = (data)=>{
    return  api.post(`/api/v1/user/login`, data);
}

export const authUser =async ()=>{
    return await api.post(`/api/v1/user/authuser`)
}

//quiz api's
export const getQuizzes = async(cursor,limit)=>{
    if(cursor){
        return await api.get(`/api/v1/quiz/getquiz?cursor=${cursor}&limit=${limit}`)
    }
    else{
        return await api.get(`/api/v1/quiz/getquiz?limit=${limit}`)
    }
}

export const generateQuiz = async(payload)=>{
    return await api.post(`/api/v1/quiz/generate`,payload)
}