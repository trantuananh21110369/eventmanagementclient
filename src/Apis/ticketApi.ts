import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ticketApi = createApi({
  reducerPath: "Ticket",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: (idEvent) => ({
        url: `tickets/`,
        params: {
          idEvent: idEvent,
        },
      }),
      providesTags: ["Ticket"],
    }),

    getTicket: builder.query({
      query: (idTicket: string) => ({
        url: `ticket/${idTicket}`,
        method: "GET",
      }),
    }),

    createTicket: builder.mutation({
      query: ({ticketData}) => ({
        url: "tickets/",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["Ticket"],
    }),

    updateTicket: builder.mutation({
      query: ({ data, idTicket }) => ({
        url: `tickets/${idTicket}`,
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Ticket"],
    }),

    deleteTicket: builder.mutation({
      query: (idTicket) => ({
        url: `tickets/${idTicket}`,
        method: "delete",
        headers: {
          "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["Ticket"],
    }),

    
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketApi;
export default ticketApi;
