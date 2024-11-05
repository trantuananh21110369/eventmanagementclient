import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const eventApi = createApi({
  reducerPath: "Event",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (idOrganization) => ({
        url: `event/organization/${idOrganization}`,
      }),
      providesTags: ["Event"],
    }),

    getEvent: builder.query({
      query: (id: string) => ({
        url: `Event/${id}`,
        method: "GET",
      }),
    }),

    createEvent: builder.mutation({
      query: (eventData) => ({
        url: "event/",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["Event"],
    }),

    updateEvent: builder.mutation({
      query: ({ data, idEvent }) => ({
        url: `event/${idEvent}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = eventApi;
export default eventApi;
