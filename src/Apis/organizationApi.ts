import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const organizationApi = createApi({
  reducerPath: "Organization",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");

      const storedData = localStorage.getItem("organization");
      let idOrganization = null;

      if (storedData) {
        const organizationData = JSON.parse(storedData);
        idOrganization = organizationData.idOrganization;
      }

      token && headers.set("Authorization", `Bearer ` + token);
      if (idOrganization) {
        headers.set("IdOrganization", idOrganization);
      }
    },
  }),
  tagTypes: ["Organization"],
  endpoints: (builder) => ({
    getOrganization: builder.query({
      query: (id) => ({
        url: `Organization/${id}`,
      }),
      providesTags: ["Organization"],
    }),

    createOrganization: builder.mutation({
      query: (data) => ({
        url: "Organization/",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: data,
      }),
    }),

    updateOrganization: builder.mutation({
      query: ({ data, idUser }) => ({
        url: "Organization/" + idUser,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    getOrganizationByUserId: builder.query({
      query: (userId) => ({
        url: `user/Organizations/`,
        params: {
          userId: userId,
        },
      }),
      providesTags: ["Organization"],
    }),

    //Admin
    getOrganizations: builder.query({
      query: () => ({
        url: `Organizations/`,
      }),
      providesTags: ["Organization"],
    }),

    changeStatusOrganization: builder.mutation({
      query: ({ organizationId, status }) => ({
        url: `status/organization/` + organizationId, // Đường dẫn URL
        method: "PATCH", // Phương thức PATCH
        headers: {
          "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
        },
        params: {
          status: status,
        },
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useGetOrganizationByUserIdQuery,
  useGetOrganizationsQuery,
  useChangeStatusOrganizationMutation,
} = organizationApi;

export default organizationApi;
