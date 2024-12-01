import { SD_Status_Event } from "../Utility/SD";

const getStatusColor = (status: SD_Status_Event) => {
  return status === SD_Status_Event.ON_SALE
    ? "green"
    : status === SD_Status_Event.SOLD_OUT
    ? "red"
    : status === SD_Status_Event.CANCELLED
    ? "blue"
    : status === SD_Status_Event.POSTPONED && "blue";
};

export default getStatusColor;
