import React, { useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa'; // Import biểu tượng tìm kiếm
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SearchStringBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // State để lưu nội dung tìm kiếm
  const [pendingSearch, setPendingSearch] = useState<string | null>(null); // Tạm lưu searchQuery để đồng bộ
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
   // Xử lý điều hướng và cập nhật searchParams trong useEffect
   useEffect(() => {
    if (location.pathname === "/searchpage" && pendingSearch) {
      setSearchParams({ searchQuery: pendingSearch }); // Cập nhật searchParams khi đã điều hướng
      setPendingSearch(null); // Reset lại trạng thái pending
    }
  }, [location.pathname, pendingSearch, setSearchParams]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (): void => {
    if (searchQuery.trim()) {
      if (location.pathname !== "/searchpage") {
        console.log("Navigating to /searchpage");
        setPendingSearch(searchQuery.trim()); // Lưu lại trạng thái tạm
        navigate(`/searchpage`); // Điều hướng tới trang tìm kiếm
      } else {
        setSearchParams({ searchQuery: searchQuery.trim() }); // Nếu đã ở đúng trang, chỉ cập nhật searchParams
      }
    }
  };
  return (
    <div className="flex items-center space-x-2">
      {/* Thanh nhập từ khóa tìm kiếm */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật state khi nhập
        placeholder="Nhập từ khóa tìm kiếm"
        className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-secondaryColor w-64"
      />

      {/* Nút tìm kiếm */}
      <button
        onClick={handleSearch}
        className="px-3 py-2 bg-secondaryColor text-white rounded-md focus:outline-none"
      >
        <FaSearch className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchStringBar;
