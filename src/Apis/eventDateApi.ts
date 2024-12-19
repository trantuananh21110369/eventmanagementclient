import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import EventDateModel from "Interfaces/eventDateModel";

const eventDateApi = createApi({
  reducerPath: "EventDate",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["EventDate"],
  endpoints: (builder) => ({
    getEventDates: builder.query({
      query: (idEvent) => ({
        url: `EventDates/`,
        method: "get",
        params: {
          idEvent: idEvent,
        },
      }),
      providesTags: ["EventDate"],
    }),

    saveEventDates: builder.mutation({
      query: ({ data, idEvent }) => ({
        url: "EventDate",
        method: "Put",
        params: {
          idEvent: idEvent,
        },
        headers: {
          "Content-type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["EventDate"],
    }),

    createEventDate: builder.mutation({
      query: ({ data, idEvent }) => ({
        url: "EventDate",
        method: "Post",
        params: {
          idEvent: idEvent,
        },
        body: data,
      }),
      invalidatesTags: ["EventDate"],
    }),

    updateEventDate: builder.mutation({
      query: ({ data, eventDateId }) => ({
        url: "EventDate/" + eventDateId,
        method: "Put",
        body: data,
      }),
      invalidatesTags: ["EventDate"],
    }),
  }),
});

export const {
  useGetEventDatesQuery,
  useCreateEventDateMutation,
  useUpdateEventDateMutation,
  useSaveEventDatesMutation,
} = eventDateApi;
export default eventDateApi;
