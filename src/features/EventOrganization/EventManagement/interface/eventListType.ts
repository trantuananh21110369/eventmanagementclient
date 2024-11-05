import EventModel from "../../../../Interfaces/eventModel";

export default interface eventListProps {
  isFetching: boolean;
  eventData: EventModel[];
}
