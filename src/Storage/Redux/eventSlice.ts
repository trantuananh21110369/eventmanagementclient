import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { eventModel } from "../../Interfaces";
import { organizationApi } from "../../Apis";

export const emptyEventState: eventModel = {
  idEvent: "",
  nameEvent: "",
  organizationId: "",
  description: "",
  urlImage: "",
  location: "",
  status: undefined,
  privacy: undefined,
  eventType: undefined,
};

export const eventSlice = createSlice({
  name: "Event",
  initialState: emptyEventState,
  reducers: {
    setEvent: (state, action: PayloadAction<eventModel>) => {
      state.idEvent = action.payload.idEvent;
      state.nameEvent = action.payload.nameEvent;
      state.organizationId = action.payload.organizationId;
      state.description = action.payload.description;
      state.urlImage = action.payload.urlImage;
      state.location = action.payload.location;
      state.status = action.payload.status;
      state.privacy = action.payload.privacy;
      state.eventType = action.payload.eventType;
    },
    clearEvent: (state) => {
      state = emptyEventState;
    },
  },
});

export const { setEvent, clearEvent } = eventSlice.actions;
export const eventReducer = eventSlice.reducer;
