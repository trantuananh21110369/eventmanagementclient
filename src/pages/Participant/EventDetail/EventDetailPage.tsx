import { useGetEventDetailViewQuery } from 'Apis/searchApis';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TicketOrder from './TicketOrder';
import { Loading } from 'Components/UI';
import { SD_Privacy_Event, SD_Status_Event } from 'Utility/SD';
import ChatPopup from 'Components/Layout/ChatPopup';
import MapDisplay from 'Components/Page/Mapbox/MapDisplay';
import PrivatePage from './PrivatePage';

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
  eventDates: EventDate[];
}

export interface TicketTimeDetail {
  nameTicket: string;
  scheduledDate: string;
}

export interface EventDate {
  dateTitle: string;
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
    privacy === SD_Privacy_Event.PRIVATE ? (
      <PrivatePage />) : (
      isFetching ? (
        <Loading />
      ) : (
        <div className="px-8 md:px-40 py-10 bg-gray-100 overflow-hidden max-w-full">
          {/* Main Image Section */}
          <div className="relative flex flex-col w-full md:w-[75vw] h-[50vh] md:h-[60vh] mx-auto shadow-xl rounded-lg overflow-hidden">
            <img
              src={eventDetailView?.urlImage}
              alt="Event Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <h1 className="text-white text-4xl font-bold">{eventDetailView?.eventName}</h1>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="flex flex-row w-full md:w-[75vw] mx-auto bg-white p-8 shadow-lg rounded-lg mt-8 overflow-hidden max-w-full overflow-x-auto">
            {/* Left Column */}
            <div className="flex-col flex w-5/6 ">
              {/* Date and Title */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{eventDetailView?.eventName}</h1>
                <p
                  className={statusEvent === SD_Status_Event.SOLD_OUT
                    ? "text-red-500 font-semibold"
                    : statusEvent === SD_Status_Event.CANCELLED || statusEvent === SD_Status_Event.POSTPONED
                      ? "text-yellow-500 font-semibold"
                      : statusEvent === SD_Status_Event.ON_SALE
                        ? "text-green-500 font-semibold"
                        : "text-gray-500 font-semibold"}
                >
                  {eventDetailView?.status}
                </p>
              </div>

              {/* Organization Section */}
              <div className="flex justify-between mb-6 bg-gray-100 rounded-lg w-[50%] p-4 shadow-sm">
                <div className="flex items-center">
                  <img
                    src={eventDetailView?.urlImageOrganization}
                    alt="Organization Logo"
                    className="rounded-full w-16 h-16 object-cover"
                  />
                  <p className="text-gray-700 ml-4 font-medium">{eventDetailView?.nameOrganization}</p>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all ml-20"
                  onClick={handleOpen}
                >
                  Chat
                </button>
              </div>

              {/* Date/Time Section  of Ticket*/}
              <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-700">Ticket Summary</h2>
                {eventDetailView?.tickets?.map((item, index) => (
                  <div key={index} className="text-gray-600 mt-4">
                    <p>
                      <span className="font-bold text-blue-500">Ticket Name:</span> {item.nameTicket}
                    </p>
                    <p>
                      <span className="font-bold text-blue-500">Scheduled of Ticket:</span> {item.scheduledDate}
                    </p>
                  </div>
                ))}
              </div>

              {/* Event Description */}
              <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-700">Description</h2>
                <p className="text-gray-600 mt-2">{eventDetailView?.description}</p>
              </div>

              {/* Location Section */}
              <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-700">Location</h2>
                <p className="text-gray-600 mt-2">{eventDetailView?.location}</p>
                <MapDisplay
                  accessToken="pk.eyJ1IjoiZHVvbmdsYXRvaSIsImEiOiJjbTI3c21qemMwb2JuMmpwdm9yOHh3YjhxIn0.RP4bO-ejWjEhO2JyPTsuZw"
                  longitude={coordinates?.longitude || 106.660172}
                  latitude={coordinates?.latitude || 10.762622}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex items-start ml-auto w-1/6">
              <button
                className="ml-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                onClick={handleSelectTicketClick}
              >
                Select Ticket
              </button>
            </div>
          </div>
          {/* TicketOrder Pop-up */}
          {isTicketOrderVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[40%]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Select Ticket</h2>
                  <button
                    className="text-red-500 text-2xl hover:text-red-700 transition-all"
                    onClick={handleCloseTicketOrder}
                  >
                    ×
                  </button>
                </div>
                {statusEvent === SD_Status_Event.ON_SALE ? (
                  <TicketOrder idEvent={idEvent || ""} />
                ) : (
                  <p className="text-center text-gray-500">Sold out</p>
                )}
              </div>
            </div>
          )}

          {/* Chat Popup */}
          <ChatPopup open={isOpened} handleClose={handleClose} organizationId={eventDetailView?.organizationId} />
        </div>
      )
    )
  );


};

export default EventDetailPage;