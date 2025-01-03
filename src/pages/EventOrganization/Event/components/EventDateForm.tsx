import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetEventDatesQuery, useSaveEventDatesMutation } from 'Apis/eventDateApi';
import EventDateModel from 'Interfaces/eventDateModel';
import inputHelper from 'Helper/inputHelper';
import { apiResponse } from 'Interfaces';
import { toastNotify } from 'Helper';
import { Button } from '@headlessui/react';
import apiResponseTest from 'Interfaces/apiReponseTest';

function EventDateForm() {
  const { idEvent } = useParams();
  const { data, isFetching } = useGetEventDatesQuery(idEvent);
  const [saveEventDates] = useSaveEventDatesMutation();
  const [isLoading, setLoading] = useState(false);
  const [eventDateData, setEventDateData] = useState<EventDateModel[]>([]);
  const [eventDateDeleteData, setEventDateDeleteData] = useState<EventDateModel[]>([]);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  useEffect(() => {
    if (data) {
      setEventDateData(data.result);
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      setIsZoomedIn(window.innerWidth < 1024);  // Adjust threshold based on your needs
    };

    window.addEventListener('resize', handleResize);
    handleResize();  // Call on mount to set the initial zoom state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAddDate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEventDateData([...eventDateData, {
      idEventDate: '',
      dateTitle: '',
      eventId: idEvent || '',
      scheduledDate: new Date().toISOString().split('T')[0],
      startTime: "00:00:00",
      endTime: "00:00:00"
    }]);
  };

  const handleDeleteDate = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setEventDateData(eventDateData.filter((_, i) => i !== index));
    setEventDateDeleteData([...eventDateDeleteData, eventDateData[index]]);
  }

  const handleEventInput = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const updatedData = eventDateData.map((eventDate, index) =>
      index === id ? inputHelper(e, eventDate) : eventDate
    );
    setEventDateData(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response: any =
        await saveEventDates({ data: { ListEventDateDto: eventDateData, ListEventDateDelete: eventDateDeleteData }, idEvent });
      if (response.data.isSuccess) {
        toastNotify("Event Date Saved Successfully");
      } else {
        const errorMessage = response?.error?.data?.errorMessages[0] || "Unknown error";

        if (response.error?.status === 409) {
          toastNotify(errorMessage, "error");
        }
      }
    } catch (err: any) {
      console.error("Unexpected Error:", err);
    }

    setEventDateData([]);
    setEventDateDeleteData([]);
    if (data) {
      setEventDateData(data.result);
    }
    setLoading(false);
  }

  return (
    <form method="post" className='flex flex-col space-y-6' onSubmit={handleSubmit}>
      {eventDateData && eventDateData.map((eventDate, index) => {
        return (
          <div
            key={index}
            className={`mb-6 border-2 border-gray-300 p-4 rounded-md shadow-md ${isZoomedIn ? 'pr-4' : ''}`}
          >
            <div className={`flex justify-between items-center ${isZoomedIn ? 'space-x-6' : ''}`}>
              <h2 className="text-xl font-bold mb-2 whitespace-nowrap">Event Date</h2>
              <button className='bg-red-400 p-2 rounded-full' onClick={(e) => handleDeleteDate(e, index)}>Remove</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Date Title</label>
                <input
                  type="text"
                  name="dateTitle"
                  value={eventDate.dateTitle}
                  className="w-full min-w-[200px] px-4 py-2 border rounded-md mb-2"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={eventDate.scheduledDate}
                  className="w-full min-w-[200px] px-4 py-2 border rounded-md mb-2"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={eventDate.startTime}
                  className="w-full min-w-[200px] px-4 py-2 border rounded-md mb-2"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={eventDate.endTime}
                  className="w-full min-w-[200px] px-4 py-2 border rounded-md mb-2"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className={`self-end content-center space-x-6 ${isZoomedIn ? 'space-y-6' : 'space-y-4'}`}>
        <button className='p-2 px-4 bg-green-300 rounded-full' onClick={(e) => handleAddDate(e)}>Add Date</button>
        <Button type="submit" disabled={isLoading} className='bg-blue-500 text-white rounded-md px-6 py-3'>Save and Continue</Button>
      </div>

    </form>
  );
}

export default EventDateForm;
