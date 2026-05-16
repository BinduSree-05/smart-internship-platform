import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "https://smart-internship-backend-isxp.onrender.com/login",
        {
          email,
          password
        }
      );

      alert(response.data.message);

      if(response.data.token) {

        localStorage.setItem(
          "token",
          response.data.token
        );

        navigate("/dashboard");

      }

    } catch(error) {

      alert("Server Error");

    }

  }


  const handleRegister = async () => {

    try {

      const response = await axios.post(
        "https://smart-internship-backend-isxp.onrender.com/register",
        {
          email,
          password
        }
      );

      alert(response.data.message);

    } catch(error) {

      alert("Registration Failed");

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Student Login
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border p-3 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="w-full border p-3 rounded-lg mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Login
        </button>

        <button
          onClick={handleRegister}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Register
        </button>

      </div>

    </div>
  )
}

export default Login