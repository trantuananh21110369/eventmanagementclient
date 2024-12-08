import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "Auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "Auth/register/",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userData,
      }),
    }),

    loginUser: builder.mutation({
      query: (userCredentials) => ({
        url: "Auth/login/",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userCredentials,
      }),
    }),

    forgetPassword: builder.mutation({
      query: (email) => ({
        url: "Auth/forgot-password",
        method: "get",
        params: { email: email },
      }),
    }),

    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: "Auth/resetpassword",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: resetData,
      }),
    }),

    googleLogin: builder.mutation({
      query: (token) => ({
        url: "Auth/loginWithGoogle",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: { token: token },
      }),
    }),

    settingProfile: builder.mutation({
      query: ({ profile, userId }) => ({
        url: "Auth/profile/" + userId,
        method: "PUT",
        body: profile,
      }),
    }),

    getProfile: builder.query({
      query: (userId) => ({
        url: "Auth/profile/" + userId,
        method: "GET",
      }),
    }),

    getAllUser: builder.query({
      query: () => ({
        url: "auth/users",
        method: "GET",
      }),
    }),

    blockUser: builder.mutation({
      query: ({ userId }) => ({
        url: "auth/lockout/user/" + userId,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGoogleLoginMutation,
  useResetPasswordMutation,
  useForgetPasswordMutation,
  useSettingProfileMutation,
  useGetProfileQuery,
  useGetAllUserQuery,
  useBlockUserMutation,
} = authApi;
export default authApi;
