import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetEventDatesQuery, useSaveEventDatesMutation } from 'Apis/eventDateApi';
import { SubmitButton } from 'Components/UI';
import EventDateModel from 'Interfaces/eventDateModel';
import inputHelper from 'Helper/inputHelper';
import { apiResponse } from 'Interfaces';
import { toastNotify } from 'Helper';

function EventDateForm() {
  const { idEvent } = useParams();
  const { data, error, isFetching } = useGetEventDatesQuery(idEvent);
  const [saveEventDates] = useSaveEventDatesMutation();
  const [isLoading, setLoading] = useState(false);
  const [eventDateData, setEventDateData] = useState<EventDateModel[]>([]);
  const [eventDateDeleteData, setEventDateDeleteData] = useState<EventDateModel[]>([]);
  console.log(eventDateData);
  console.log(eventDateDeleteData)

  useEffect(() => {
    if (data) {
      setEventDateData(data.result);
    }
  }, [data]);

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
    const response: apiResponse = await saveEventDates({ data: { ListEventDateDto: eventDateData, ListEventDateDelete: eventDateDeleteData }, idEvent });

    setLoading(false);
    if (response.data?.isSuccess) {
      toastNotify("Event Date Saved Successfully");
    }
    else {
      toastNotify("Error Saving Event Date", "error");
    }
  }

  return (
    <form method="post" className='flex flex-col' onSubmit={handleSubmit}>
      {eventDateData && eventDateData.map((eventDate: any, index: number) => {
        return (
          <div key={index} className="mb-4 border-input">
            <div className='flex flex-row justify-between'>
              <h2 className="text-xl font-bold mb-2">Event Date</h2>
              <button className='bg-red-400 p-1 rounded-full' onClick={(e) => handleDeleteDate(e, index)}> Remove </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Title</label>
                <input
                  type="text"
                  name="dateTitle"
                  value={eventDate.dateTitle}
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={eventDate.scheduledDate}
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={eventDate.startTime}
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={eventDate.endTime}
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleEventInput(index, e)}
                />
              </div>
            </div>
          </div>
        )
      })}
      <div className='self-end space-x-3'>
        <button className='p-1 px-2 bg-green-300 rounded-full' onClick={(e) => handleAddDate(e)}> Add Date </button>
        <SubmitButton text="Save" />
      </div>
    </form>
  )
}

export default EventDateForm