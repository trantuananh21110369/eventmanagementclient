import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import FilterDateComponent from "../components/FilterDateComponent"; // Import FilterDateComponent
import { useGetHomeEventQuery } from "Apis/searchApis";

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
    <div className="search-page-container" style={{ padding: "20px" }}>
      {/* Nút ở góc phải trên cùng */}
      <button
        onClick={handleButtonClick}
        style={{
          position: "absolute",
          top: "100px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Nút góc phải
      </button>

      {/* Hiển thị FilterDateComponent nếu showFilter là true */}
      {showFilter && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50">
          <div className="flex justify-center items-center h-full">
            <FilterDateComponent
              onFilter={handleFilterApply} // Hàm áp dụng bộ lọc
              onClose={handleFilterClose} // Hàm đóng FilterDateComponent
            />
          </div>
        </div>
      )}

      <h1 className="search-page-title">Kết quả tìm kiếm:</h1>
      <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {dataEventHome.length > 0 ? (
          dataEventHome.map((event, index) => (
            <Link to={`../e/${event.eventId}`} key={index}  >
              <div
                key={index}
                className="event-card"
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <img
                  src={event.urlImage}
                  alt="/images/concert3.png"
                  onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
                <h3 className="event-name">{event.eventName}</h3>
                <p className="event-price">
                  <strong>Giá:</strong>  {event.priceLow} - {event.priceHigh} $
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="event-date">
                  <strong>Date near:</strong> {event.nearDate}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
