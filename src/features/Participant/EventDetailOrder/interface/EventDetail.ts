export interface EventDetail {
  eventId: string;
  eventName: string;
  urlImage: string;
  location: string;
  description: string;
  nameOrganization: string;
  tickets: TicketTimeDetail[];
}

export interface TicketTimeDetail {
  nameTicket: string;
  scheduledDate: string;
}
