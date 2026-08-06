import {create} from "zustand";
const useAuthStore=create((set)=>({
    access:localStorage.getItem("access"),
    refresh:localStorage.getItem("refresh"),
    setTokens:(access,refresh)=>{
        localStorage.setItem("access",access)
        localStorage.setItem("refresh",refresh)
        set({
            access:access,
            refresh:refresh
        });
    },
    logout:()=>{
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        set({
            access:null,
            refresh:null
        })
    }
}));
export default useAuthStore;