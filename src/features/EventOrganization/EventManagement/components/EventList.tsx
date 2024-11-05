import React from 'react'
import eventListProps from '../interface/eventListType'
import EventModel from '../../../../Interfaces/eventModel';
import getStatusColor from '../../../../Helper/getStatusColor';
import { Link, useNavigate } from 'react-router-dom';

function EventList({ isFetching, eventData }: eventListProps) {
  const navigate = useNavigate();

  const handleSelectChange = (event: any, eventId: string) => {
    const selectedValue = event.target.value;
    if (selectedValue === "update") {
      navigate(`../update/${eventId}/edit`);
    }
  };

  return (
    <div>
      {
        !isFetching ? (
          eventData.map((event: EventModel) => {
            const badgeColor = getStatusColor(event.status!);
            return (
              <div key={event.idEvent} className="border-t border-gray-200">
                <div className="flex items-center py-4">
                  <div className="w-3/12 flex items-center">
                    <img src={event.urlImage} alt="Event" className="w-12 h-12 mr-4 rounded-xl" />
                    <div>
                      <p className="font-semibold">{event.nameEvent}</p>
                      <p className="text-sm text-gray-600">Online event</p>
                      <p className="text-sm text-gray-600">Saturday, November 23, 2024 at 10:00 AM PST</p>
                    </div>
                  </div>
                  <div className="w-2/12 text-center">{event.location}</div>
                  <div className="w-2/12 text-center">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-${badgeColor}-400 ring-2 ring-${badgeColor}-500`}>{event.status}</span>
                  </div>
                  <select
                    id="handle"
                    className="border border-gray-300 rounded-md p-2"
                    onChange={(e) => handleSelectChange(e, event.idEvent!)}
                    defaultValue="none"
                  >
                    <option value="none">
                      ...
                    </option>
                    <option value="update">Update</option>
                    <option value="view">View</option>
                  </select>
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )
      }
    </div>
  )
}

export default EventList
