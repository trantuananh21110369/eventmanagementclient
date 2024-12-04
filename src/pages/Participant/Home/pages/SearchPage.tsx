import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import FilterDateComponent from "../components/FilterDateComponent"; // Import FilterDateComponent
import { useGetHomeEventQuery } from "Apis/searchApis";
import { formatDate } from "Utility/formatDate";
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
  const searchQuery: string = searchParams.get("searchQuery")?.toLowerCase() || ""; // Lấy query tìm kiếm
  const from: string = searchParams.get("from") || "";
  const to: string = searchParams.get("to") || "";
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false); // Trạng thái để điều khiển việc hiển thị FilterDateComponent
  const [dataEventHome, setDataEventHome] = useState<EventHome[]>([]);
  const navigate = useNavigate();

  const { data, isFetching } = useGetHomeEventQuery({ searchString: searchQuery, fromDate: from, toDate: to });

  // Lưu trạng thái khoảng thời gian đã lọc
  const [filterText, setFilterText] = useState<string>("Lọc theo thời gian");

  useEffect(() => {
    if (data && !isFetching) {
      setDataEventHome(data.result);
    }
  }, [data]);

  // Hàm xử lý sự kiện khi bấm nút
  const handleButtonClick = () => {
    setShowFilter(true); // Khi bấm nút, hiển thị FilterDateComponent
  };

  // Hàm đóng FilterDateComponent
  const handleFilterClose = () => {
    setShowFilter(false); // Đóng FilterDateComponent khi nhấn nút "Cancel"
  };

  // Hàm xử lý khi áp dụng bộ lọc
  const handleFilterApply = (startDate: string, endDate: string) => {
    // Xử lý text hiển thị trên nút
    const startText = formatDate(startDate) || "nay";
    const endText = formatDate(endDate) || `về sau`;
    const newFilterText = `Từ ${startText} tới ${endText}`;
    setFilterText(newFilterText);

    // Cập nhật query string
    setSearchParams({
      from: startDate.toString(),
      to: endDate.toString(),
      local: "all",
      cate: "all",
      searchQuery: searchQuery.trim(),
    });

    setShowFilter(false); // Đóng FilterDateComponent sau khi áp dụng
  };

  return (
    <div className="search-page-container" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
      {/* Container cho tiêu đề và nút */}
      <div className="flex justify-between items-center mt-16 mb-6">
        <h1 className="search-page-title text-2xl font-bold">Kết quả tìm kiếm:</h1>
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

      {/* Hiển thị FilterDateComponent nếu showFilter là true */}
      {showFilter && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-10">
          <div className="flex justify-center items-center h-full">
            <FilterDateComponent
              onFilter={handleFilterApply} // Hàm áp dụng bộ lọc
              onClose={handleFilterClose} // Hàm đóng FilterDateComponent
            />
          </div>
        </div>
      )}

      {/* Danh sách sự kiện */}
      <div
  className="events-list grid gap-6"
  style={{
    paddingLeft: "80px", paddingRight: "80px",
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
      Không tìm thấy kết quả nào cho "{searchQuery}"
    </p>
  )}
</div>

    </div>

  );
};

export default SearchPage;
