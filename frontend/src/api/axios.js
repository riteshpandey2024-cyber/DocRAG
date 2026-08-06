import axios from "axios"
import useAuthStore from "../store/authStore";
const axiosInstance=axios.create({
    baseURL:"http://127.0.0.1:8000/api/",
    headers:{
        "Content-Type":"application/json",
    },
})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem("access")
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config
    },
    (error)=>Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest=error.config;
        if(error.response?.status===401 && !originalRequest._retry){
            originalRequest._retry=true
            try {
                const refresh=localStorage.getItem("refresh")
                const response=await axios.post("http://127.0.0.1:8000/api/refresh/",{
                    refresh
                })
                const newAccess=response.data.access;
                useAuthStore.getState().setTokens(newAccess,refresh)
                originalRequest.headers.Authorization=`Bearer ${newAccess}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href="/";
                return Promise.reject(error);

            }
        }
        return Promise.reject(error);
    }
    
)


export default axiosInstance