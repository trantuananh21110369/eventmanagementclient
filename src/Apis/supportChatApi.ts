import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const supportChatApi = createApi({
  reducerPath: "SupportChat",
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
  tagTypes: ["SupportChat"],
  endpoints: (builder) => ({
    getAllChatRoomByUserId: builder.query({
      query: (userId: string) => ({
        url: `user/${userId}/SupportChatRooms`,
        method: "GET",
      }),
      providesTags: ["SupportChat"],
    }),

    getAllChatRoomByOrganizationId: builder.query({
      query: (organizationId: string) => ({
        url: `organization/${organizationId}/SupportChatRooms`,
        method: "GET",
      }),
      providesTags: ["SupportChat"],
    }),

    getChatRoomByOrganizationId: builder.query({
      query: ({ organizationId, senderId }) => ({
        url: `SupportChatRoom/`,
        method: "GET",
        params: {
          organizationId: organizationId,
          senderId: senderId,
        },
      }),
      providesTags: ["SupportChat"],
    }),

    getMessageByIdRoom: builder.query({
      query: (chatRoomId) => ({
        url: `messages`,
        method: "GET",
        params: {
          chatRoomId: chatRoomId,
        },
      }),
      providesTags: ["SupportChat"],
    }),

    sendMessage: builder.mutation({
      query: ({ sendMessage }) => ({
        url: "message",
        method: "POST",
        body: sendMessage,
      }),
    }),

    createChatRoom: builder.mutation({
      query: ({ sendCreateChatRoom }) => ({
        url: "SupportChatRoom",
        method: "POST",
        body: sendCreateChatRoom,
      }),
    }),
  }),
});

export const {
  useLazyGetAllChatRoomByOrganizationIdQuery,
  useLazyGetAllChatRoomByUserIdQuery,
  useLazyGetChatRoomByOrganizationIdQuery,
  useLazyGetMessageByIdRoomQuery,
  useGetChatRoomByOrganizationIdQuery,
  useGetMessageByIdRoomQuery,
  useSendMessageMutation,
  useCreateChatRoomMutation,
} = supportChatApi;
export default supportChatApi;
