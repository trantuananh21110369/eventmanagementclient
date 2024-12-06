import { configureStore } from "@reduxjs/toolkit";
import {
  authApi,
  organizationApi,
  eventApi,
  eventDateApi,
  ticketApi,
  searchApis,
  orderApi,
  roleApi,
  purchasedTicketApi,
  supportChatApi,
  paymentApi,
} from "../../Apis";
import { userAuthReducer } from "./userAuthSlice";
import { organizationReducer } from "./organizationSlice";
import { eventReducer } from "./eventSlice";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    organizationStore: organizationReducer,
    eventStore: eventReducer,
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [eventDateApi.reducerPath]: eventDateApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [searchApis.reducerPath]: searchApis.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [purchasedTicketApi.reducerPath]: purchasedTicketApi.reducer,
    [supportChatApi.reducerPath]: supportChatApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(organizationApi.middleware)
      .concat(eventApi.middleware)
      .concat(eventDateApi.middleware)
      .concat(ticketApi.middleware)
      .concat(searchApis.middleware)
      .concat(orderApi.middleware)
      .concat(roleApi.middleware)
      .concat(purchasedTicketApi.middleware)
      .concat(supportChatApi.middleware)
      .concat(paymentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
