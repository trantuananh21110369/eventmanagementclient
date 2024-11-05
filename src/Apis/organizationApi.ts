import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const organizationApi = createApi({
  reducerPath: "Organization",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
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
        headers: {
          "Content-type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
} = organizationApi;

export default organizationApi;
