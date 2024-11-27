import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from 'Apis/authApi';
import { apiResponse } from 'Interfaces';
import { inputHepler, toastNotify } from "Helper";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerUser] = useRegisterUserMutation();

  const [userInput, setUserInput] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Add form submission logic here

    const response: apiResponse = await registerUser({
      email: userInput.email,
      fullname: userInput.fullName,
      password: userInput.password
    });

    console.log(response);

    setLoading(false);

    if (response.data && response.data?.isSuccess) {
      toastNotify("Register Successful");
      navigate("/login");
    } else {
      setError(response.error?.data?.errorMessages?.[0]);
    }
  };

  const handleInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form method="post" onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full px-2">
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              value={userInput.email}
              onChange={handleInputUser}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter Full Name"
              name="fullName"
              value={userInput.fullName}
              onChange={handleInputUser}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={userInput.password}
              onChange={handleInputUser}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-6 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={userInput.confirmPassword}
              onChange={handleInputUser}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;