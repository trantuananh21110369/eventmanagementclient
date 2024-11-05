import {
  SD_Status_Ticket,
  SD_Visibility_Ticket,
  SD_Sale_Method_Ticket,
} from "Utility/SD";
import EventDateModel from "./eventDateModel";

export default interface TicketModel {
  idTicket: string; // Primary key
  eventId: string;
  eventDateId: string;
  eventDate: EventDateModel;
  nameTicket: string;
  quantity: number;
  price: number;
  saleStartDate: Date;
  saleEndDate: Date;
  description: string;
  status: SD_Status_Ticket; // enum
  visibility: SD_Visibility_Ticket; // enum
  saleMethod: SD_Sale_Method_Ticket; // enum
}
