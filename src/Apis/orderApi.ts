import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderApi = createApi({
  reducerPath: "Order",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrdersByUserId: builder.query({
      query: ({ userId, pageSize, pageNumber, searchString }) => ({
        url: "orders/",
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

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "orders/",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useGetOrdersByUserIdQuery, useCreateOrderMutation } = orderApi;
export default orderApi;
