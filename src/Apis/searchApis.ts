import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const searchApis = createApi({
  reducerPath: "Search",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["Search"],
  endpoints: (builder) => ({
    getHomeEvent: builder.query({
      query: ({ fromDate, toDate, searchString, pageSize, pageNumber }) => ({
        url: `search/`,
        params: {
          fromDate: fromDate,
          toDate: toDate,
          searchString: searchString,
          pageSize: pageSize,
          pageNumber: pageNumber,
        },
      }),
      transformResponse: (apiResponse: { result: any }, meta) => {
        return {
          apiResponse: apiResponse, // Dữ liệu chính từ API
          totalRecords: meta?.response?.headers?.get("X-Pagination"), // Đọc số bản ghi từ header
        };
      },
      providesTags: ["Search"],
    }),

    getEventDetailView: builder.query({
      query: (idEvent) => ({
        url: `search/` + idEvent,
      }),
      providesTags: ["Search"],
    }),
  }),
});

export const { useGetHomeEventQuery, useGetEventDetailViewQuery } = searchApis;
export default searchApis;
