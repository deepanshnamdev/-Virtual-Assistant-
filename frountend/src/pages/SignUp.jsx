import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

const SignUP = () => {
  const navigate = useNavigate();
  const { serverUrl, userData, setUserData } = useContext(userDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const[loading, setLoading] = useState(false);

  const handelSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error.response?.data || error.message);
      setUserData(null);
      setLoading(false);
      setError(error.response?.data?.message || "An error occurred during sign up. Please try again.");
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center bg-no-repeat flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]"
        onSubmit={handelSignUp}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[20px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          className="w-[80%] h-[50px] rounded-md px-[20px] focus:outline-none"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-[80%] h-[50px] rounded-md px-[20px] focus:outline-none"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-[80%] h-[50px] rounded-md px-[20px] focus:outline-none"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error.length > 0 && (
          <p className="text-red-500 text-[14px]">{error}</p>
        )}

        <button className="w-[80%] h-[50px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default SignUP;
