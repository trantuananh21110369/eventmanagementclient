import { useGetEventDetailViewQuery } from 'Apis/searchApis';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TicketOrder from './TicketOrder';
import { Loading } from 'Components/UI';
import { SD_Privacy_Event, SD_Status_Event } from 'Utility/SD';

export interface EventDetail {
  eventId: string;
  eventName: string;
  urlImage: string;
  location: string;
  description: string;
  nameOrganization: string;
  status: string;
  tickets: TicketTimeDetail[];
}

export interface TicketTimeDetail {
  nameTicket: string;
  scheduledDate: string;
}

const EventDetailPage = () => {
  const { idEvent } = useParams();
  const { data, isFetching } = useGetEventDetailViewQuery(idEvent);
  const [eventDetailView, setEventDetailView] = useState<EventDetail>();
  const [isTicketOrderVisible, setTicketOrderVisible] = useState(false); // State to manage popup visibility
  const [privacy, setPrivacy] = useState<string>(SD_Privacy_Event.PUBLIC);
  const [statusEvent, setStatusEvent] = useState<string>("");

  useEffect(() => {
    console.log(data?.result);
    if (data?.result == SD_Privacy_Event.PRIVATE) {
      setPrivacy(SD_Privacy_Event.PRIVATE);
    }
    else {
      setEventDetailView(data?.result);
      setStatusEvent(data?.result.status);
      console.log(data?.result.status);
    }
  }, [data, privacy]);

  const handleSelectTicketClick = () => {
    setTicketOrderVisible(true);
  };

  const handleCloseTicketOrder = () => {
    setTicketOrderVisible(false);
  };

  return (
    privacy === SD_Privacy_Event.PRIVATE ? (<div className="px-8 md:px-40 py-10 bg-gray-100">Event is private</div>) : (

      isFetching ? (<Loading />) : (<div className="px-8 md:px-40 py-10 bg-gray-100">
        {/* Main Image Section */}
        <div className="flex flex-col w-full md:w-[75vw] h-[50vh] md:h-[60vh] mx-auto shadow-lg shadow-gray-500/50">
          <img
            src={eventDetailView?.urlImage}
            alt="Event Image"
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>

        {/* Event Details Section */}
        <div className="flex w-full md:w-[75vw] mx-auto bg-white p-8 shadow-lg shadow-gray-500/30 rounded-b-lg">
          {/* Left Column for Event Information */}
          <div className="flex-1 h-[1000px]">
            {/* Date and Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{eventDetailView?.eventName}</h1>
              <p
                className={
                  statusEvent === SD_Status_Event.SOLD_OUT
                    ? "text-red-500 font-semibold"
                    : statusEvent === SD_Status_Event.CANCELLED || statusEvent === SD_Status_Event.POSTPONED
                      ? "text-yellow-500 font-semibold"
                      : statusEvent === SD_Status_Event.ON_SALE
                        ? "text-green-500 font-semibold"
                        : "text-gray-500 font-semibold"
                }
              >
                {eventDetailView?.status}
              </p>
            </div>

            {/* Organization Section */}
            <div className="flex mb-6 bg-slate-200 rounded-xl w-[60%] items-center p-2">
              <img src="https://placehold.co/800x400" className="rounded-full w-16 h-16 object-cover" />
              <p className="text-gray-600 ml-4">{eventDetailView?.nameOrganization}</p>
            </div>

            {/* Date/Time Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Date & Time</h2>
              {
                eventDetailView?.tickets?.map((item, index) => (
                  <p key={index} className="text-gray-600 mt-2">{item.nameTicket} - {item.scheduledDate}</p>
                ))
              }
            </div>

            {/* Location Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Location</h2>
              <p className="text-gray-600 mt-2">{eventDetailView?.location}</p>
            </div>

            {/* Event Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Description</h2>
              <p className="text-gray-600 mt-2">
                {eventDetailView?.description}
              </p>
            </div>
          </div>

          {/* Right Column for Button */}
          <div className="flex items-start md:items-start ml-auto md:ml-6 ">
            <button className="px-6 py-3 m-10 bg-primary text-white rounded-full sticky top-10" onClick={handleSelectTicketClick}>
              Select Ticket
            </button>
          </div>
        </div>

        {/* TicketOrder pop-up */}
        {isTicketOrderVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-h-[80vh] overflow-y-auto">
              <div className='flex flex-row justify-between items-center mb-4'>
                <h2 className="text-lg font-semibold">Select Ticket</h2>
                <button className="px-4 py-2 bg-red-600 text-white rounded-full" onClick={handleCloseTicketOrder}>
                  Close
                </button>
              </div>
              <div className='overflow-y-auto'>
                {statusEvent === SD_Status_Event.ON_SALE ? (
                  <TicketOrder idEvent={idEvent || ''} />
                ) : (
                  <div>Sold out</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>))
  );
};

export default EventDetailPage;
