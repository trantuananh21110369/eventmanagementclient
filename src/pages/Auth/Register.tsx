import { useRegisterUserMutation } from "Apis/authApi";
import { toastNotify } from "Helper";
import { apiResponse } from "Interfaces";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [userInput, setUserInput] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [register] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.password !== userInput.confirmPassword) {
      toastNotify("Passwords do not match!", "error");
      return;
    }
    const rs: apiResponse = await register(userInput);

    if (rs?.data) {
      toastNotify("Register success !", "success");
      navigate("/login");
    } else {
      toastNotify(rs?.error?.data?.errorMessages?.[0], "error");
    }
  }

  const handleInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter your full name"
              value={userInput.fullName}
              onChange={handleInputUser}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
              required
            />
          </div>
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
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
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
              placeholder="Create a password"
              value={userInput.password}
              onChange={handleInputUser}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={userInput.confirmPassword}
              onChange={handleInputUser}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
