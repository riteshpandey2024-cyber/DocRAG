import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("")
            setSuccess("");
            await axiosInstance.post("/register/", {
                name, email, password
            })
            setSuccess("Asccout Created sucessfully")
            setTimeout(() => {
                navigate("/");
            }, 1500)
        } catch (error) {
            setError("Unable to register")
            console.error(error)
        }
        finally {
            setLoading(false);
        }
    }

    return (

        <div className="min-h-screen bg-linear-to-br from-[#f5eee6] to-[#e8ddd0] flex justify-center items-center px-4">

            <div className="w-full max-w-md bg-[#ede0d4] rounded-3xl shadow-2xl p-10">


                <div className="text-center mb-8">

                    <h1 className="text-5xl font-bold text-[#7f5539]">

                        DocRAG

                    </h1>

                    <p className="text-[#6f4518] mt-3">

                        Create your account

                    </p>

                </div>


                <form onSubmit={handleRegister} className="space-y-5">


                    <div>

                        <label className="block mb-2 text-[#5c4033]">

                            Full Name

                        </label>

                        <input

                            type="text"

                            value={name}

                            onChange={(e) => setName(e.target.value)}

                            className="w-full px-4 py-3 rounded-xl
bg-[#faf6f1]
border border-[#d6c0b3]
focus:ring-2
focus:ring-[#9c6644]
outline-none"

                            required

                        />

                    </div>



                    <div>

                        <label className="block mb-2 text-[#5c4033]">

                            Email

                        </label>

                        <input

                            type="email"

                            value={email}

                            onChange={(e) => setEmail(e.target.value)}

                            className="w-full px-4 py-3 rounded-xl
bg-[#faf6f1]
border border-[#d6c0b3]
focus:ring-2
focus:ring-[#9c6644]
outline-none"

                            required

                        />

                    </div>



                    <div>

                        <label className="block mb-2 text-[#5c4033]">

                            Password

                        </label>

                        <input

                            type="password"

                            value={password}

                            onChange={(e) => setPassword(e.target.value)}

                            className="w-full px-4 py-3 rounded-xl
bg-[#faf6f1]
border border-[#d6c0b3]
focus:ring-2
focus:ring-[#9c6644]
outline-none"

                            required

                        />

                    </div>



                    {

                        error &&

                        <p className="text-red-600 text-sm">

                            {error}

                        </p>

                    }


                    {

                        success &&

                        <p className="text-green-700 text-sm">

                            {success}

                        </p>

                    }


                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full py-3 rounded-xl
bg-[#7f5539]
hover:bg-[#6f4518]
text-white
font-semibold
transition
duration-300"

                    >

                        {

                            loading ?

                                "Creating Account..."

                                :

                                "Register"

                        }

                    </button>

                </form>



                <p className="text-center mt-6 text-[#5c4033]">

                    Already have an account?

                    <span

                        className="ml-2 text-[#9c6644]
font-semibold
cursor-pointer
hover:underline"

                        onClick={() => navigate("/")}

                    >

                        Login

                    </span>

                </p>


            </div>

        </div>

    )
}

export default Register
