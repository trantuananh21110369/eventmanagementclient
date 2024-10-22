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
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGoogleLoginMutation,
} = authApi;
export default authApi;
