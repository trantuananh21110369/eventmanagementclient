import { createSlice } from "@reduxjs/toolkit";
import { organizationModel } from "../../Interfaces";

export const emptyUserState: organizationModel = {
  idUser: "",
  idOrganization: "",
  nameOrganization: "",
  description: "",
  city: "",
  country: "",
  urlImage: "",
  status: "",
};

export const organizationSlice = createSlice({
  name: "Organization",
  initialState: emptyUserState,
  reducers: {
    setOrganization: (state, action) => {
      state.idOrganization = action.payload.idOrganization;
      state.idUser = action.payload.idUser;
      state.nameOrganization = action.payload.nameOrganization;
      state.description = action.payload.description;
      state.city = action.payload.city;
      state.country = action.payload.country;
      state.urlImage = action.payload.urlImage;
    },
  },
});

export const { setOrganization } = organizationSlice.actions;
export const organizationReducer = organizationSlice.reducer;
