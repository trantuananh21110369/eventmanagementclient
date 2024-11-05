import { RootState } from 'Storage/Redux/store';
import { SubmitButton } from 'Components/UI';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SD_Type_Event, SD_Status_Event } from 'Utility/SD';
import { useCreateEventMutation, useGetEventQuery, useUpdateEventMutation } from 'Apis/eventApi';
import { inputHepler, toastNotify } from 'Helper';

const TypesEvent = [
  SD_Type_Event.SINGLE,
  SD_Type_Event.MULTIPLE,
  "None",
]

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
  location: '',
  status: StatusEvent[0],
  eventType: TypesEvent[0],
}

const EventForm = () => {
  const { idEvent } = useParams();
  //Call Api
  const [updateEvent] = useUpdateEventMutation();
  const [createEvent] = useCreateEventMutation();
  const navigate = useNavigate();

  const [eventInputs, setEventInput] = useState(eventData);
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const organization = useSelector((state: RootState) => state.organizationStore);
  const { data, isFetching } = useGetEventQuery(idEvent!);

  useEffect(() => {
    if (data) {
      const tempData = {
        nameEvent: data.result.nameEvent || '',
        description: data.result.description || '',
        location: data.result.location || '',
        status: data.result.status || StatusEvent[StatusEvent.length - 1],
        eventType: data.result.eventType || TypesEvent[TypesEvent.length - 1],
      }
      setEventInput(tempData);
      setImageToDisplay(data.result.urlImage || "");
    }
  }, [data]);

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

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File Must be less then 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File Must be in jpeg, jpg or png", "error");
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
    setLoading(true);
    if (!imageToStore && !idEvent) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("idEvent", idEvent!);
    formData.append("nameEvent", eventInputs.nameEvent);
    formData.append("description", eventInputs.description);
    formData.append("location", eventInputs.location);
    formData.append("eventType", eventInputs.eventType);
    formData.append("status", eventInputs.status);

    if (imageToDisplay) formData.append("File", imageToStore);

    let response;

    if (idEvent) {
      //update
      formData.append("Id", idEvent);
      response = await updateEvent({ data: formData, idEvent: idEvent! });
      toastNotify("Event updated successfully", "success");
    } else {
      //create
      formData.append("OrganizationId", organization.idOrganization);
      console.log(organization.idUser);
      response = await createEvent(formData);
      toastNotify("Event created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("../event");
    }

    setLoading(false);
  };

  return (
    <form className='flex flex-col' onSubmit={handleSubmit}>
      {/*Over view*/}
      <div className="mb-4 border-input ">
        <h2 className="text-xl font-bold mb-2">Event Overview</h2>
        <input type="text" placeholder="Event title" name="nameEvent" value={eventInputs.nameEvent} onChange={handleEventInput} className="w-full px-4 py-2 border rounded-md mb-2" />
        <textarea placeholder="Description" name="description" value={eventInputs.description} onChange={handleEventInput} className="w-full px-4 py-2 border rounded-md" />
      </div>

      {/*Image event*/}
      <div className="mb-4 border-input">
        <h2 className="text-xl font-bold mb-2">Add images and video</h2>
        <div className="border-dashed border-2 border-gray-300 h-48 flex flex-col justify-center items-center rounded-md mb-4">
          {imageToDisplay ? (
            <img src={imageToDisplay} alt="Uploaded" className="w-48 h-48 object-cover" />
          ) : (
            <>
              <input type="file" accept="image/*" className="hidden" id="upload-button" onChange={handleFileChange} />
              <label htmlFor="upload-button" className="bg-gray-300 px-4 py-2 rounded cursor-pointer">
                Upload Image
              </label>
            </>
          )}
        </div>
        <input type="text" placeholder="Video URL" className="w-full px-4 py-2 border rounded-md" />
      </div>

      {/*Location event*/}
      <div className="mb-4 border-input">
        <h2 className="text-xl font-bold mb-2">Location</h2>
        <input type="text" placeholder="Location" name="location" value={eventInputs.location} onChange={handleEventInput} className="w-full px-4 py-2 border rounded-md mb-2" />
      </div>

      <div className="mb-4 border-input ">
        {/*Type event*/}
        <h2 className="text-xl font-bold mb-2">Type of Event</h2>
        <div className="grid grid-cols-3 gap-4">
          <select
            className='w-full px-4 py-2 border rounded-md mb-2'
            name="eventType"
            value={eventInputs.eventType}
            onChange={handleEventInput}>
            {TypesEvent.map((eventType) => (
              <option key={eventType} value={eventType}>{eventType}</option>
            ))}
          </select>
        </div>
        {/*Status event*/}
        <h2 className="text-xl font-bold mb-2">Type of Event</h2>
        <div className="grid grid-cols-3 gap-4">
          <select
            className='w-full px-4 py-2 border rounded-md mb-2'
            name="status"
            value={eventInputs.status}
            onChange={handleEventInput}>
            {StatusEvent.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='self-end'>
        <SubmitButton text="Save and Continue" />
      </div>
    </form>
  );
};

export default EventForm;
