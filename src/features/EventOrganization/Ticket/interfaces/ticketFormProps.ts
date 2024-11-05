import TicketModel from "Interfaces/ticketModel";

export default interface ticketFormProps {
  listEventDates: { dateTitle: string; eventDateId: string }[];

  ticket: TicketModel | null;

  onClose: () => void;
}
