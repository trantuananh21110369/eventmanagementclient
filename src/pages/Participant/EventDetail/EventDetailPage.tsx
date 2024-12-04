import { useGetEventDetailViewQuery } from 'Apis/searchApis';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TicketOrder from './TicketOrder';
import { Loading } from 'Components/UI';
import { SD_Privacy_Event, SD_Status_Event } from 'Utility/SD';
import ChatPopup from 'Components/Layout/ChatPopup';
import MapDisplay from 'Components/Page/Mapbox/MapDisplay';

export interface EventDetail {
  eventId: string;
  eventName: string;
  urlImage: string;
  location: string;
  coordinates: string;
  description: string;
  organizationId: string;
  nameOrganization: string;
  urlImageOrganization: string;
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
  const [coordinates, setCoordinates] = useState<{ longitude: number; latitude: number }>();

  //Popup chat create 
  const [isOpened, setIsOpened] = useState(false)
  const handleClose = () => {
    setIsOpened(false)
  }
  const handleOpen = () => {
    console.log("Lay id" + eventDetailView?.organizationId)
    setIsOpened(true)
  }

  useEffect(() => {
    console.log(data?.result);
    if (data?.result == SD_Privacy_Event.PRIVATE) {
      setPrivacy(SD_Privacy_Event.PRIVATE);
    }
    else {
      setEventDetailView(data?.result);
      if (data?.result?.coordinates) {
        const [longitude, latitude] = data.result.coordinates.split(" ").map(Number); // Tách và chuyển thành số
        setCoordinates({ longitude, latitude });
        console.log("Lay toa do" + data.result.coordinates)
      }
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
            <div className="flex justify-between mb-6 bg-slate-200 rounded-xl w-[60%] items-center p-2">
              <div className="flex items-center">
                <img
                  src={eventDetailView?.urlImageOrganization}
                  alt="Organization Logo"
                  className="rounded-full w-16 h-16 object-cover"
                />
                <p className="text-gray-600 ml-4">
                  {eventDetailView?.nameOrganization}
                </p>
              </div>
              <button className='bg-white rounded-sm p-2' onClick={handleOpen}> Chat </button>
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

            {/* Event Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Description</h2>
              <p className="text-gray-600 mt-2">
                {eventDetailView?.description}
              </p>
            </div>

            {/*Show map*/}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Location</h2>
              <p className="text-gray-600 mt-2">{eventDetailView?.location}</p>
              <MapDisplay
                accessToken='pk.eyJ1IjoiZHVvbmdsYXRvaSIsImEiOiJjbTI3c21qemMwb2JuMmpwdm9yOHh3YjhxIn0.RP4bO-ejWjEhO2JyPTsuZw'
                longitude={coordinates?.longitude || 106.660172}
                latitude={coordinates?.latitude || 10.762622}
              />
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
        <ChatPopup open={isOpened} handleClose={handleClose} organizationId={eventDetailView?.organizationId} />
      </div>))
  );
};

export default EventDetailPage;