import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { apiResponse } from 'Interfaces';
import { inputHepler, toastNotify } from "Helper";
import { useForgetPasswordMutation } from 'Apis/authApi';

function ForgetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [forgetPassword] = useForgetPasswordMutation();
  const [error, setError] = useState("");

  const [userInput, setUserInput] = useState({
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response: apiResponse = await forgetPassword(userInput.email);
    setLoading(false);

    if (response.data && response.data?.isSuccess) {
      toastNotify("Password Reset Email Sent");
      navigate("/login");
    } else {
      setError(response.error?.data?.errorMessages?.[0]);
    }
  };

  const handleInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHepler(e, userInput);
    setUserInput(tempData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-orange-600">Forget Password</h2>
        <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={userInput.email}
              onChange={handleInputUser}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
              required
            />
          </div>
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
