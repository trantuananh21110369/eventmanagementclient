import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { apiResponse, userModel } from "Interfaces";
import { useLoginUserMutation } from "Apis/authApi";
import { setLoggedInUser } from "Storage/Redux/userAuthSlice";
import { inputHepler, toastNotify } from "Helper";
import jwt_decode from "jwt-decode";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginUser] = useLoginUserMutation();
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const handleInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHepler(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await loginUser({
      email: userInput.email,
      password: userInput.password,
    });

    if (response.data) {
      const { token } = response.data.result;
      const { fullName, id, email, role, urlImage }: userModel = jwt_decode(token);
      localStorage.setItem("token", token);
      dispatch(setLoggedInUser({ fullName, id, email, role, urlImage }));
      navigate("/");
      toastNotify("Login Successful");
    } else {
      setError(response.error?.data?.errorMessages?.[0]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={userInput.email}
              onChange={handleInputUser}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={userInput.password}
              onChange={handleInputUser}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-blue-500 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
