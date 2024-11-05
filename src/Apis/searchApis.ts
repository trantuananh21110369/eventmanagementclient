import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const searchApis = createApi({
  reducerPath: "Search",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7056/api",
  }),
  tagTypes: ["Search"],
  endpoints: (builder) => ({
    getHomeEvent: builder.query({
      query: () => ({
        url: `search/`,
      }),
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
