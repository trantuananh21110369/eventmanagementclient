import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../Apis/authApi";
import { apiResponse, userModel } from "../Interfaces";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { inputHepler, toastNotify } from "../Helper";
import jwt_decode from "jwt-decode";

//Check login file again
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

    console.log(response);

    if (response.data) {
      const { token } = response.data.result;
      const { fullName, id, email, role }: userModel = jwt_decode(token);
      localStorage.setItem("token", token);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
      navigate("/");
      toastNotify("Login Successful");
    } else {
      setError(response.error?.data?.errorMessages?.[0]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form method="post" onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full px-2">
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter Your Email"
              name="email"
              value={userInput.email}
              onChange={handleInputUser}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-2 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              id="password"
              name="password"
              value={userInput.password}
              onChange={handleInputUser}
              minLength={3}
              maxLength={18}
              className="shadow appearance-none border rounded py-2 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;