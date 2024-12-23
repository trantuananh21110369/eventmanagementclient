import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { apiResponse } from 'Interfaces';
import { inputHepler, toastNotify } from "Helper";
import { useResetPasswordMutation } from 'Apis/authApi';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || '';
  const token = queryParams.get('token') || '';

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

    if (userInput.newPassword !== userInput.confirmNewPassword) {
      setLoading(false);
      toastNotify("Passwords do not match", "error");
      return;
    }

    const response: apiResponse = await resetPassword({ NewPassword: userInput.newPassword, token: token, email: email });
    setLoading(false);

    if (response.data && response.data?.isSuccess) {
      toastNotify("Password Reset Successful");
      navigate("/login");
    } else {
      setError(response?.error?.data?.errorMessages?.[0]);
      toastNotify("Password Reset Fail", "error");
    }
  };

  const handleInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHepler(e, userInput);
    setUserInput(tempData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="newPassword" className="sr-only">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                value={userInput.newPassword}
                onChange={handleInputUser}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="sr-only">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Confirm New Password"
                value={userInput.confirmNewPassword}
                onChange={handleInputUser}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
