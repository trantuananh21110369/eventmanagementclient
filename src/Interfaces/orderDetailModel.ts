import purchasedTicketModel from "./purchasedTicketModel";
import ticketModel from "./ticketModel";

export default interface orderDetailModel {
  ticket: ticketModel;
  quantity: number;
  purchasedTickets: purchasedTicketModel[];
}
