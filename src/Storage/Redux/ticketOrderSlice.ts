import { createSlice } from "@reduxjs/toolkit";
export interface ticketOrderModel {
  idTicketOrder: string;
  idOrganization: string;
  eventName: string;
  ticketQuantity: number;
  orderDate: string;
}

export const emptyTicketOrderState: ticketOrderModel = {
  idTicketOrder: "",
  idOrganization: "",
  eventName: "",
  ticketQuantity: 0,
  orderDate: "",
};

export const ticketOrderSlice = createSlice({
  name: "TicketOrder",
  initialState: emptyTicketOrderState,
  reducers: {
    setTicketOrder: (state, action) => {
      state.idTicketOrder = action.payload.idTicketOrder;
      state.idOrganization = action.payload.idOrganization;
      state.eventName = action.payload.eventName;
      state.ticketQuantity = action.payload.ticketQuantity;
      state.orderDate = action.payload.orderDate;
    },
  },
});

export const { setTicketOrder } = ticketOrderSlice.actions;
export const ticketOrderReducer = ticketOrderSlice.reducer;
