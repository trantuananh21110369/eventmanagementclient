import { configureStore } from "@reduxjs/toolkit";
import { authApi, organizationApi } from "../../Apis";
import { userAuthReducer } from "./userAuthSlice";
import { organizationReducer } from "./organizationSlice";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    organizationStore: organizationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(organizationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
