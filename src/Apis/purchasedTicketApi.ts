import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const purchasedTicketApi = createApi({
  reducerPath: "PurchasedTicket",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["PurchasedTicket"],
  endpoints: (builder) => ({
    getPurchasedTicketsByIdOrderHeader: builder.query({
      query: (OrderHeaderId) => ({
        url: `PurchasedTicket/`,
        method: "get",
        params: {
          OrderHeaderId: OrderHeaderId,
        },
      }),
      transformResponse: (apiResponse: { result: any }, meta) => {
        return {
          apiResponse: apiResponse, // Dữ liệu chính từ API
          totalRecords: meta?.response?.headers?.get("X-Pagination"), // Đọc số bản ghi từ header
        };
      },
      providesTags: ["PurchasedTicket"],
    }),

    getPurchasedTicketById: builder.query({
      query: (PurchasedTicketId) => ({
        url: `PurchasedTicket/` + PurchasedTicketId,
        method: "get",
      }),
      providesTags: ["PurchasedTicket"],
    }),

    savePurchasedTicketById: builder.mutation({
      query: ({ idPurchasedTicket, data }) => ({
        url: "PurchasedTicket/" + idPurchasedTicket,
        method: "put",
        body: data,
      }),
      invalidatesTags: ["PurchasedTicket"],
    }),
  }),
});

export const {
  useGetPurchasedTicketsByIdOrderHeaderQuery,
  useGetPurchasedTicketByIdQuery,
  useSavePurchasedTicketByIdMutation,
} = purchasedTicketApi;
export default purchasedTicketApi;
