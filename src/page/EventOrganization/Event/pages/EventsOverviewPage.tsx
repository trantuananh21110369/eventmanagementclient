import React, { useEffect, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import EventList from '../components/EventList';
import { useGetEventsQuery } from '../../../../Apis/eventApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../Storage/Redux/store';
import { inputHepler } from 'Helper';
import { SD_Status_Event } from 'Utility/SD';
import { PagingBar } from 'Components/UI';

const filterOptions = [
  "All",
  SD_Status_Event.ON_SALE,
  SD_Status_Event.SOLD_OUT,
  SD_Status_Event.CANCELLED,
  SD_Status_Event.POSTPONED,
];

function EventsOverviewPage() {
  // Local state for filters, pagination, and event data
  const [filters, setFilters] = useState({ searchString: "", statusEvent: "" });
  const [apiFilters, setApiFilters] = useState({ searchString: "", statusEvent: "" });
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);
  const [eventData, setEventData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // Get organization ID from the Redux store
  const idOrganization = useSelector((state: RootState) => state?.organizationStore?.idOrganization);

  // Fetch event data from the API
  const { data, isFetching } = useGetEventsQuery({
    idOrganization,
    searchString: apiFilters.searchString,
    statusEvent: apiFilters.statusEvent,
    pageSize: pageSize,
    pageNumber: pageNumber,
  });

  // Handle input changes for search and status filters
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedFilters = inputHepler(e, filters);
    setFilters(updatedFilters);
  };

  // Apply filters to the API query
  const handleFilter = () => {
    setApiFilters({ searchString: filters.searchString, statusEvent: filters.statusEvent });
  };

  // Update event data and total records when data changes
  useEffect(() => {
    if (data) {
      setEventData(data?.apiResponse?.result);
      const { TotalRecords } = JSON.parse(data?.totalRecords || "{}");
      setTotalRecords(TotalRecords);
    }
  }, [data]);

  return (
    <div>
      {/* Header Section: Create Event & Filters */}
      <div className="flex justify-between items-center mb-6">
        <NavLink to="../create" className="px-4 py-2 border">Create Event</NavLink>
        <div>
          <input
            type="text"
            placeholder="Search events"
            className="border p-2 rounded mr-4"
            onChange={handleChange}
            name="searchString"
          />
          <select
            className="border p-2 rounded mr-4"
            onChange={handleChange}
            name="statusEvent"
          >
            {filterOptions.map((item, index) => (
              <option key={index} value={item === "All" ? "" : item}>
                {item}
              </option>
            ))}
          </select>
          <button className="p-2 rounded-xl bg-green-200" onClick={handleFilter}>Filter</button>
        </div>
      </div>

      {/* Event List */}
      <EventList isFetching={isFetching} eventData={eventData} />

      {/* Paging Bar */}
      <PagingBar
        totalRecords={totalRecords}
      />
    </div>
  );
}

export default EventsOverviewPage;
