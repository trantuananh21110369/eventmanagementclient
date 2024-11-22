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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forget Password</h2>
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
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;