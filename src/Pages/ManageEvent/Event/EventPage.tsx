import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { EventList } from '../../../Components/Pages/Event';
import { useGetEventsQuery } from '../../../Apis/eventApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Storage/Redux/store';

function EventPage() {
  const [selectedFilter, setSelectedFilter] = useState('Upcoming Events');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const filters = ['Upcoming Events', 'Draft', 'Past Events', 'All Events'];

  const idOrganization = useSelector((state: RootState) => state?.organizationStore?.idOrganization);
  const [eventData, setEventData] = useState([]);
  const { data, isFetching } = useGetEventsQuery(idOrganization);
  console.log(data);
  useEffect(() => {
    if (data) {
      setEventData(data?.result);
    }
  }, [data]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <input type="text" placeholder="Search events" className="border p-2 rounded mr-4" />
        <button onClick={() => setView('list')} className={`px-4 py-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'border'}`}>List View</button>
        <button onClick={() => setView('calendar')} className={`ml-2 px-4 py-2 ${view === 'calendar' ? 'bg-blue-600 text-white' : 'border'}`}>Calendar View</button>
        <div className="relative">
          <button className="ml-2 px-4 py-2 border rounded" onClick={() => setShowFilters(!showFilters)}>
            {selectedFilter}
          </button>
          {showFilters && (
            <ul className="absolute left-0 mt-2 w-full bg-white border rounded shadow-lg z-20">
              {filters.map((filter) => (
                <li
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setShowFilters(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {filter}
                </li>
              ))}
            </ul>
          )}
        </div>
        <NavLink to="../create-event" className="px-4 py-2 border">Create Event</NavLink>
      </div>
      <EventList isFetching={isFetching} eventData={eventData} />
    </div>
  );
}

export default EventPage;
