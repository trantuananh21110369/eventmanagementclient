import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import FilterDateComponent from "../components/FilterDateComponent"; // Import FilterDateComponent
import { useGetHomeEventQuery } from "Apis/searchApis";
import { formatDate } from "Utility/formatDate";
let backgroundchrist = require("Assets/images/backgroundchrist.jpg");

interface EventHome {
  eventId: string;
  eventName: string;
  urlImage: string;
  location: string;
  priceLow: number;
  priceHigh: number;
  nearDate: string;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery: string = searchParams.get("searchQuery")?.toLowerCase() || ""; // Get search query
  const from: string = searchParams.get("from") || "";
  const to: string = searchParams.get("to") || "";
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false); // State to control the display of FilterDateComponent
  const [dataEventHome, setDataEventHome] = useState<EventHome[]>([]);
  const navigate = useNavigate();

  const { data, isFetching } = useGetHomeEventQuery({ searchString: searchQuery, fromDate: from, toDate: to });

  // Save the state of the filtered time range
  const [filterText, setFilterText] = useState<string>("Filter by time");

  useEffect(() => {
    if (data && !isFetching) {
      setDataEventHome(data?.apiResponse?.result);
    }
  }, [data]);

  // Handle button click event
  const handleButtonClick = () => {
    setShowFilter(true); // Show FilterDateComponent when button is clicked
  };

  // Close FilterDateComponent
  const handleFilterClose = () => {
    setShowFilter(false); // Close FilterDateComponent when "Cancel" button is clicked
  };

  // Handle filter apply
  const handleFilterApply = (startDate: string, endDate: string) => {
    // Handle text display on button
    const startText = formatDate(startDate) || "now";
    const endText = formatDate(endDate) || "later";
    const newFilterText = `From ${startText} to ${endText}`;
    setFilterText(newFilterText);

    // Update query string
    setSearchParams({
      from: startDate.toString(),
      to: endDate.toString(),
      local: "all",
      cate: "all",
      searchQuery: searchQuery.trim(),
    });

    setShowFilter(false); // Close FilterDateComponent after applying
  };

  return (
    <div className="p-6 flex flex-col items-center h-auto w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundchrist})` }}>
      {/* Container for title and button */}
      <div className="flex justify-between items-center mt-16 mb-6 w-3/4">
        <h1 className="search-page-title text-2xl font-bold">Search Results:</h1>
        <button
          onClick={handleButtonClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {filterText}
        </button>
      </div>

      {/* Display FilterDateComponent if showFilter is true */}
      {
        showFilter && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-10">
            <div className="flex justify-center items-center h-full">
              <FilterDateComponent
                onFilter={handleFilterApply} // Apply filter function
                onClose={handleFilterClose} // Close FilterDateComponent function
              />
            </div>
          </div>
        )
      }

      {/* Event list */}
      <div
        className="events-list grid gap-6 w-3/4"
        style={{
          paddingTop: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          justifyContent: "center",
        }}
      >
        {dataEventHome.length > 0 ? (
          dataEventHome.map((event, index) => (
            <Link
              to={`../e/${event.eventId}`}
              key={index}
              className="event-card flex flex-col items-center bg-[#F5F5F5] p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
              style={{
                maxWidth: "300px",
              }}
            >
              <img
                src={event.urlImage || "/images/placeholder.png"}
                alt={event.eventName || "Event image"}
                onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                className="w-full h-[200px] rounded-md object-cover mb-4"
              />
              <h3 className="event-name text-lg font-semibold mb-2 text-gray-800 text-center">
                {event.eventName}
              </h3>
              <p className="event-price text-sm text-green-600 text-center">
                <strong>{event.priceLow}$ - {event.priceHigh}$</strong>
              </p>
              <p className="event-location text-sm text-gray-600 text-left w-full">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="event-date text-sm text-gray-500 text-left w-full">
                <strong>Date near:</strong> {event.nearDate || "Updating..."}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-600">
            No results found for "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
