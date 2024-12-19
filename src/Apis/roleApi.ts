import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get } from "http";
import { useSelector } from "react-redux";

const roleApi = createApi({
  reducerPath: "Role",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
    prepareHeaders: (headers: Headers, api) => {
      // Lấy idOrganization từ localStorage
      const token = localStorage.getItem("token");

      const storedData = localStorage.getItem("organization");
      let idOrganization = null;

      if (storedData) {
        const organizationData = JSON.parse(storedData);
        idOrganization = organizationData.idOrganization;
      }

      //Gán lại vào header
      token && headers.set("Authorization", `Bearer ` + token);
      if (idOrganization) {
        headers.set("IdOrganization", idOrganization);
      }
    },
  }),
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    //User Organization
    getMembers: builder.query({
      query: ({ idOrganization, searchString, pageSize, pageNumber }) => ({
        url: `members`,
        params: { idOrganization, searchString, pageSize, pageNumber },
      }),
      transformResponse: (apiResponse: { result: any }, meta) => {
        return {
          apiResponse: apiResponse, // Dữ liệu chính từ API
          totalRecords: meta?.response?.headers?.get("X-Pagination"), // Đọc số bản ghi từ header
        };
      },
      providesTags: ["Role"],
    }),

    addMemberToOrganization: builder.mutation({
      query: (data) => ({
        url: "member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    kickMemberInOrganization: builder.mutation({
      query: (memberId) => ({
        url: "member",
        method: "DELETE",
        params: { memberId },
      }),
      invalidatesTags: ["Role"],
    }),

    getUserRoleDetail: builder.query({
      query: ({ userId, organizationId }) => ({
        url: `user-roles`,
        method: "GET",
        params: {
          userId: userId,
          organizationId: organizationId,
        },
      }),

      providesTags: ["Role"],
    }),

    addUserRoles: builder.mutation({
      query: (data) => ({
        url: "user-roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    //Role Organization
    getRolesByIdOrganization: builder.query({
      query: (idOrganization) => ({
        url: `roles/`,
        params: { organizationId: idOrganization },
      }),
      providesTags: ["Role"],
    }),

    getPermissions: builder.query({
      query: () => ({
        url: "o-permissions",
      }),
      providesTags: ["Role"],
    }),

    getRoleDetail: builder.query({
      query: (roleId) => ({
        url: `role/${roleId}`,
      }),
      providesTags: ["Role"],
    }),

    addRole: builder.mutation({
      query: (data) => ({
        url: "role",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    updateRole: builder.mutation({
      query: ({ roleId, data }) => ({
        url: `role/${roleId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    deleteRole: builder.mutation({
      query: (roleId) => ({
        url: `role/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  //User
  useGetMembersQuery,
  useAddMemberToOrganizationMutation,
  useKickMemberInOrganizationMutation,
  useGetUserRoleDetailQuery,
  useAddUserRolesMutation,
  //Role
  useGetRolesByIdOrganizationQuery,
  useGetRoleDetailQuery,
  useGetPermissionsQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
export default roleApi;
