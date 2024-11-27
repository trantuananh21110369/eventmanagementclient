import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { apiResponse } from 'Interfaces';
import { inputHepler, toastNotify } from "Helper";
import { useLocation } from "react-router-dom";
import { useResetPasswordMutation } from 'Apis/authApi';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || '';
  const token = queryParams.get('token') || '';
  console.log(token)

  const [loading, setLoading] = useState(false);
  const [resetPassword] = useResetPasswordMutation();
  const [error, setError] = useState("");

  const [userInput, setUserInput] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response: apiResponse = await resetPassword({ NewPassword: userInput.newPassword, token: token, email: email });
    console.log(response);
    setLoading(false);

    if (response.data && response.data?.isSuccess) {
      toastNotify("Password Reset Successful");
      navigate("/login");
    } else {
      toastNotify("Password Reset Fail", "error");
    }
  };

  const handleInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHepler(e, userInput);
    setUserInput(tempData);
    console.log(userInput.newPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form method="post" onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full px-2">
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              name="newPassword"
              value={userInput.newPassword}
              onChange={handleInputUser}
              className="shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full px-2"
              required
            />
          </div>
          <div className="mb-6 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2 w-full px-2" htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm New Password"
              name="confirmNewPassword"
              value={userInput.confirmNewPassword}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
