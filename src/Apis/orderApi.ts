import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderApi = createApi({
  reducerPath: "Order",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    //Lay orders cho user
    getOrdersByUserId: builder.query({
      query: ({ userId, pageSize, pageNumber, searchString }) => ({
        url: `user/${userId}/orders/`,
        method: "Get",
        params: {
          userId: userId,
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

    //Lay orders cho to chuc
    getOrdersByOrganizationId: builder.query({
      query: ({ organizationId, pageSize, pageNumber, searchString }) => ({
        url: `organization/${organizationId}/orders/`,
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

    //Tao moi order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "order/",
        method: "POST",
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
} = orderApi;
export default orderApi;
