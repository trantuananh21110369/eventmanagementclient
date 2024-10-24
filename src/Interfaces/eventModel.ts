import { SD_Status_Event } from "../Utility/SD";

export default interface EventModel {
  orderId?: string;
  idEvent?: string;
  nameEvent?: string;
  organizationId?: string;
  organization?: {
    // Define the Organization interface or type here
  };
  description?: string;
  urlImage?: string;
  location?: string;
  status?: SD_Status_Event;
  eventType?: string;
}
