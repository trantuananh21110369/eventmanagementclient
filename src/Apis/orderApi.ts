import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderApi = createApi({
  reducerPath: "Order",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
    prepareHeaders: (headers: Headers) => {
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
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    //Lay orders cho user
    getOrdersByUserId: builder.query({
      query: ({
        userId,
        pageSize,
        pageNumber,
        searchString,
        statusFilter,
      }) => ({
        url: `user/${userId}/orders/`,
        method: "Get",
        params: {
          userId: userId,
          pageSize: pageSize,
          pageNumber: pageNumber,
          searchString: searchString,
          statusFilter: statusFilter,
        },
      }),
      transformResponse: (apiResponse: { result: any }, meta) => {
        return {
          apiResponse: apiResponse, // Dữ liệu chính từ API
          totalRecords: meta?.response?.headers?.get("X-Pagination"), // Đọc số bản ghi từ header
        };
      },
    }),

    //Lay orders cho to chuc
    getOrdersByOrganizationId: builder.query({
      query: ({ organizationId, pageSize, pageNumber, searchString }) => ({
        url: `organization/${organizationId}/orders`,
        method: "Get",
        params: {
          pageSize: pageSize,
          pageNumber: pageNumber,
          searchString: searchString,
        },
      }),
      transformResponse: (apiResponse: { result: any }, meta) => {
        return {
          apiResponse: apiResponse, // Dữ liệu chính từ API
          totalRecords: meta?.response?.headers?.get("X-Pagination"), // Đọc số bản ghi từ header
        };
      },
    }),

    //Lay order theo id
    getOrderDetailById: builder.query({
      query: (OrderHeaderId) => ({
        url: "orderdetail/" + OrderHeaderId,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    //Lay order header theo id
    getOrderHeaderById: builder.query({
      query: (OrderHeaderId) => ({
        url: "OrderHeader/" + OrderHeaderId,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    //Lay lai thanh toán
    retrieveOrder: builder.mutation({
      query: ({ orderHeaderId }) => ({
        url: `retrieve-intent/${orderHeaderId}`,
        method: "POST",
      }),
      invalidatesTags: ["Order"],
    }),

    //Tao moi order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "order/",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    confirmOrder: builder.mutation({
      query: ({ orderHeaderId, orderData }) => ({
        url: `confirm/order/${orderHeaderId}`,
        method: "PUT",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersByUserIdQuery,
  useGetOrdersByOrganizationIdQuery,
  useGetOrderDetailByIdQuery,
  useGetOrderHeaderByIdQuery,
  useCreateOrderMutation,
  useConfirmOrderMutation,
  useRetrieveOrderMutation,
} = orderApi;
export default orderApi;
