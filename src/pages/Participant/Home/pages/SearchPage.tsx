import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FilterDateComponent from "../components/FilterDateComponent"; // Import FilterDateComponent

// Định nghĩa kiểu dữ liệu cho sự kiện
interface Event {
  id: number;
  name: string;
  price: string;
  date: string;
  image: string;
}

// Dữ liệu giả lập cho danh sách sự kiện
const mockEvents: Event[] = [
  {
    id: 1,
    name: "Anh Trai 'Say Hi' Hà Nội - Concert 3",
    price: "500.000đ",
    date: "07 tháng 12, 2024",
    image: "/images/concert3.png",
  },
  {
    id: 2,
    name: "Anh Trai 'Say Hi' Hà Nội - Concert 4",
    price: "500.000đ",
    date: "09 tháng 12, 2024",
    image: "/images/concert4.png",
  },
  {
    id: 3,
    name: "Say Hi Tháng 7 cùng Vạn Phúc Water Show",
    price: "50.000đ",
    date: "27 tháng 07, 2024",
    image: "/images/water_show.png",
  },
  // Thêm các sự kiện khác...
];

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery: string = searchParams.get("searchQuery")?.toLowerCase() || ""; // Lấy query tìm kiếm
  const from: string = searchParams.get("from") || "";
  const to: string = searchParams.get("to") || "";
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false); // Trạng thái để điều khiển việc hiển thị FilterDateComponent
  const navigate = useNavigate();
  useEffect(() => {
    // Lọc danh sách sự kiện dựa trên query và thời gian (nếu có)
    const results = mockEvents.filter((event) => {
      const isInRange =
        (from && to)
          ? new Date(event.date) >= new Date(from) && new Date(event.date) <= new Date(to)
          : true; // Kiểm tra nếu có thời gian, thì lọc theo khoảng thời gian
      return event.name.toLowerCase().includes(searchQuery) && isInRange;
    });
    setFilteredEvents(results);
  }, [searchQuery, from, to]); // Sử dụng các tham số tìm kiếm và thời gian để lọc lại

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
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="event-card"
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <img
                src={event.image}
                alt={event.name}
                onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                style={{ width: "100%", borderRadius: "5px" }}
              />
              <h3 className="event-name">{event.name}</h3>
              <p className="event-price">
                <strong>Giá:</strong> {event.price}
              </p>
              <p className="event-date">
                <strong>Ngày:</strong> {event.date}
              </p>
            </div>
          ))
        ) : (
          <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
