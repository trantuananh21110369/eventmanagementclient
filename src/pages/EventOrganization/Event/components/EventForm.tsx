import { RootState } from 'Storage/Redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SD_Type_Event, SD_Status_Event } from 'Utility/SD';
import { useCreateEventMutation, useGetEventQuery, useUpdateEventMutation } from 'Apis/eventApi';
import { inputHepler, toastNotify } from 'Helper';
import { Button } from '@headlessui/react';
import SearchBox from 'Components/Page/Mapbox/SearchMap';
import SearchMap from 'Components/Page/Mapbox/SearchMap';

const TypesEvent = [
  SD_Type_Event.SINGLE,
  SD_Type_Event.MULTIPLE,
  "None",
];

const StatusEvent = [
  SD_Status_Event.ON_SALE,
  SD_Status_Event.SOLD_OUT,
  SD_Status_Event.CANCELLED,
  SD_Status_Event.POSTPONED,
  "None",
];

const eventData = {
  nameEvent: '',
  description: '',
  status: StatusEvent[0],
  eventType: TypesEvent[0],
};

const EventForm = () => {
  const { idEvent } = useParams();
  const [updateEvent] = useUpdateEventMutation();
  const [createEvent] = useCreateEventMutation();
  const navigate = useNavigate();

  const [eventInputs, setEventInput] = useState(eventData);
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const organization = useSelector((state: RootState) => state.organizationStore);
  const { data, isFetching } = useGetEventQuery(idEvent!);

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ longitude: number; latitude: number }>();

  const handleAddressSelect = (address: string, longitude: number, latitude: number) => {
    console.log("Selected Address:", address);
    console.log("Coordinates:", longitude, latitude);
    setSelectedAddress(address);
    setCoordinates({ longitude, latitude });
  };

  useEffect(() => {
    if (data) {
      const tempData = {
        nameEvent: data.result.nameEvent || '',
        description: data.result.description || '',
        status: data.result.status || StatusEvent[StatusEvent.length - 1],
        eventType: data.result.eventType || TypesEvent[TypesEvent.length - 1],
      };
      // Tách chuỗi tọa độ từ data.result.coordinates
      if (data.result.coordinates) {
        const [longitude, latitude] = data.result.coordinates.split(" ").map(Number); // Tách và chuyển thành số
        setCoordinates({ longitude, latitude });
      }
      setSelectedAddress(data.result.location);
      setEventInput(tempData);
      setImageToDisplay(data.result.urlImage || "");
    }
  }, [data]);
  console.log(selectedAddress);

  const handleEventInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHepler(e, eventInputs);
    setEventInput(tempData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => e === imgType);

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File must be less than 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File must be in jpeg, jpg, or png format", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (eventInputs.nameEvent === '') {
      toastNotify("Please enter event title", "error");
      return;
    }

    setLoading(true);
    if (!imageToStore && !idEvent) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }

    const coordinateString = coordinates ? `${coordinates.longitude} ${coordinates.latitude}` : '';
    const formData = new FormData();
    formData.append("idEvent", idEvent!);
    formData.append("nameEvent", eventInputs.nameEvent);
    formData.append("description", eventInputs.description);
    formData.append("location", selectedAddress);
    formData.append("coordinates", coordinateString)
    formData.append("eventType", eventInputs.eventType);
    formData.append("status", eventInputs.status);

    if (imageToDisplay) formData.append("File", imageToStore);

    let response;

    if (idEvent) {
      formData.append("Id", idEvent);
      response = await updateEvent({ data: formData, idEvent: idEvent! });
      toastNotify("Event updated successfully", "success");
      if (response) {
        setLoading(false);
        navigate("../eventdate");
      }
    } else {
      formData.append("OrganizationId", organization.idOrganization);
      try {
        const response = await createEvent({
          eventData: formData,
          idOrganization: organization.idOrganization,
        }).unwrap();
        if (response.isSuccess) {
          const eventId = response.result.eventId;
          toastNotify("Event created successfully", "success");
          navigate(`../../update/${eventId}/eventdate`);
        } else {
          toastNotify("Event creation failed: " + (response?.message || "Unknown error"), "error");
        }
      } catch (err: any) {
        if (err.status === 403) {
          toastNotify("You are not authorized to perform this action", "error");
        }
      }
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg space-y-7" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Event Overview</h2>
        <input
          type="text"
          placeholder="Event title"
          name="nameEvent"
          value={eventInputs.nameEvent}
          onChange={handleEventInput}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          name="description"
          value={eventInputs.description}
          onChange={handleEventInput}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Add images and video</h2>
        <div className="flex justify-start items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="upload-button"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-button" className="bg-gray-300 px-6 py-3 rounded cursor-pointer text-gray-700 font-medium hover:bg-gray-400">
            Upload Image
          </label>
        </div>
        <div className="border-dashed border-2 border-gray-300 h-48 flex justify-center items-center rounded-md mb-4">
          {imageToDisplay ? (
            <img src={imageToDisplay} alt="Uploaded" className="w-48 h-48 object-cover" />
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
        </div>
      </div>

      {/*Search map*/}
      <div className="space-y-4 my-20">
        <h2 className="text-2xl font-semibold text-gray-700">Location</h2>
        <SearchMap
          accessToken="pk.eyJ1IjoiZHVvbmdsYXRvaSIsImEiOiJjbTI3c21qemMwb2JuMmpwdm9yOHh3YjhxIn0.RP4bO-ejWjEhO2JyPTsuZw" // Replace with your Mapbox access token
          location={selectedAddress}
          initialLongitude={coordinates?.longitude}
          initialLatitude={coordinates?.latitude}
          onAddressSelect={handleAddressSelect}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Event Type</h2>
        <select
          name="eventType"
          value={eventInputs.eventType}
          onChange={handleEventInput}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TypesEvent.map((eventType) => (
            <option key={eventType} value={eventType}>
              {eventType}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Status</h2>
        <select
          name="status"
          value={eventInputs.status}
          onChange={handleEventInput}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {StatusEvent.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md ${loading ? 'opacity-50' : 'hover:bg-blue-600'
            }`}
        >
          {loading ? "Processing..." : idEvent ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form >
  );
};

export default EventForm;
