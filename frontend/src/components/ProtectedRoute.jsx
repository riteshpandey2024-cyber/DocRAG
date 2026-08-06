import {Navigate} from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute=({children})=>{
    const access=useAuthStore((state)=>state.access)
    if(!access){
        return <Navigate to="/" replace/>
    }
    return children
}
export default ProtectedRoute