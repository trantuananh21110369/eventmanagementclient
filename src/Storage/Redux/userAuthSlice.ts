import { createSlice } from "@reduxjs/toolkit";
import { userModel } from "../../Interfaces";

export const emptyUserState: userModel = {
  fullName: "",
  id: "",
  email: "",
  role: "",
  urlImage: "",
};

export const userAuthSlice = createSlice({
  name: "UserAuth",
  initialState: emptyUserState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.fullName = action.payload.fullName;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.urlImage = action.payload.urlImage;
    },
  },
});

export const { setLoggedInUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
