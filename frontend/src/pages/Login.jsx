import { useState } from "react";
import {useNavigate} from "react-router-dom"
import axiosInstance from "../api/axios";
import useAuthStore from "../store/authStore";


const Login = () => {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")

    const setTokens=useAuthStore(
        (state)=>state.setTokens
    );

    const navigate=useNavigate();

    const handleLogin=async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            const response=await axiosInstance.post("/login/",{
                username:email,password
            })
            setTokens(response.data.access,response.data.refresh)
            navigate("/chat")
        } catch (error) {
            setError("Invalid email or password")
            console.error("Error logging in :",error)
        }finally{
            setLoading(false)
        }
    }

return (
  <div className="min-h-screen bg-linear-to-br from-[#f5eee6] to-[#e8ddd0] flex justify-center items-center px-4">

    <div className="w-full max-w-md bg-[#ede0d4] rounded-3xl shadow-2xl p-10">

      {/* Heading */}

      <div className="text-center mb-8">

        <h1 className="text-5xl font-bold text-[#7f5539]">
          DocRAG
        </h1>

        <p className="text-[#6f4518] mt-3">
          Converse with your documents
        </p>

      </div>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* Username */}

        <div>

          <label className="block mb-2 text-[#5c4033] font-medium">

            Email

          </label>

          <input

            type="text"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            placeholder="Enter Email"

            className="w-full px-4 py-3 rounded-xl
            bg-[#faf6f1]
            border border-[#d6c0b3]
            outline-none
            focus:ring-2
            focus:ring-[#9c6644]"

            required

          />

        </div>

        {/* Password */}

        <div>

          <label className="block mb-2 text-[#5c4033] font-medium">

            Password

          </label>

          <input

            type="password"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            placeholder="Enter password"

            className="w-full px-4 py-3 rounded-xl
            bg-[#faf6f1]
            border border-[#d6c0b3]
            outline-none
            focus:ring-2
            focus:ring-[#9c6644]"

            required

          />

        </div>

        {/* Error */}

        {

          error && (

            <p className="text-red-600 text-sm">

              {error}

            </p>

          )

        }

        {/* Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#7f5539] hover:bg-[#6f4518] text-white font-semibold transition duration-300 disabled:opacity-50"
        >

          {

            loading ?

            "Signing In..."

            :

            "Sign In"

          }

        </button>

      </form>


      {/* Register */}

      <p className="text-center mt-6 text-[#5c4033]">

        Don't have an account?

        <span

          className="ml-2 font-semibold text-[#9c6644] cursor-pointer hover:underline"

          onClick={()=>navigate("/register")}

        >

          Register

        </span>

      </p>


    </div>

  </div>
)
}

export default Login
