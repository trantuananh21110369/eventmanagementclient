import {
  SD_Type_Event,
  SD_Status_Event,
  SD_Privacy_Event,
} from "../Utility/SD";

export default interface eventModel {
  idEvent?: string;
  nameEvent?: string;
  organizationId?: string;
  description?: string;
  urlImage?: string;
  location?: string;
  status?: SD_Status_Event;
  privacy?: SD_Privacy_Event;
  eventType?: SD_Type_Event;
}
