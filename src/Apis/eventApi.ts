import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const eventApi = createApi({
  reducerPath: "Event",
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
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: ({
        idOrganization,
        searchString,
        statusEvent,
        pageSize,
        pageNumber,
      }) => ({
        url: `events`,
        params: {
          idOrganization,
          searchString,
          statusEvent,
          pageSize,
          pageNumber,
        },
      }),
      transformResponse: (apiResponse: { result: any }, meta) => {
        return {
          apiResponse: apiResponse, // Dữ liệu chính từ API
          totalRecords: meta?.response?.headers?.get("X-Pagination"), // Đọc số bản ghi từ header
        };
      },
      providesTags: ["Event"],
    }),

    getEvent: builder.query({
      query: (id: string) => ({
        url: `Event/${id}`,
        method: "GET",
      }),
    }),

    createEvent: builder.mutation({
      query: ({ eventData, idOrganization }) => ({
        url: "event/",
        method: "POST",
        body: eventData,
        headers: {
          IdOrganization: idOrganization,
        },
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

    updatePrivacyEvent: builder.mutation({
      query: ({ idEvent, privacy }) => ({
        url: `event/${idEvent}/privacy`,
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(privacy),
      }),
      invalidatesTags: ["Event"],
    }),

    getReportEvent: builder.query({
      query: ({ idEvent }) => ({
        url: `ReportEvent/GetTicketStatics`,
        method: "GET",
        params: {
          eventId: idEvent,
        },
      }),
      providesTags: ["Event"],
    }),

    getAllTotalPaymentEvent: builder.query({
      query: ({ searchString, pageSize, pageNumber }) => ({
        url: `ReportEvent/TotalPaymentEvents`,
        params: {
          searchString,
          pageSize,
          pageNumber,
        },
      }),
      transformResponse: (apiResponse: { result: any }, meta) => {
        return {
          apiResponse: apiResponse, // Dữ liệu chính từ API
          totalRecords: meta?.response?.headers?.get("X-Pagination"), // Đọc số bản ghi từ header
        };
      },
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useUpdatePrivacyEventMutation,
  useGetReportEventQuery,
  useGetAllTotalPaymentEventQuery,
} = eventApi;
export default eventApi;
