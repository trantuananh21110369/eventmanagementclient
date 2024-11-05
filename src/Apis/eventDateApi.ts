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
        url: `EventDate/`,
        method: "get",
        params: {
          idEvent: idEvent,
        },
      }),
      providesTags: ["EventDate"],
    }),

    saveEventDates: builder.mutation({
      query: ({ data, idEvent }) => ({
        url: "EventDate/bulk/",
        method: "Post",
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
  }),
});

export const { useGetEventDatesQuery, useSaveEventDatesMutation } =
  eventDateApi;
export default eventDateApi;
