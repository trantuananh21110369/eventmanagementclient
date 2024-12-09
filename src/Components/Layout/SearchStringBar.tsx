import React, { useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa'; // Import search icon
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SearchStringBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search query
  const [pendingSearch, setPendingSearch] = useState<string | null>(null); // Temporarily store searchQuery to sync
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation and update searchParams in useEffect
  useEffect(() => {
    if (location.pathname === "/searchpage" && pendingSearch) {
      setSearchParams({ searchQuery: pendingSearch }); // Update searchParams after navigation
      setPendingSearch(null); // Reset pending state
    }
  }, [location.pathname, pendingSearch, setSearchParams]);

  // Search handler function
  const handleSearch = (): void => {
    if (searchQuery.trim()) {
      if (location.pathname !== "/searchpage") {
        console.log("Navigating to /searchpage");
        setPendingSearch(searchQuery.trim()); // Temporarily store state
        navigate(`/searchpage`); // Navigate to search page
      } else {
        setSearchParams({ searchQuery: searchQuery.trim() }); // If already on the correct page, just update searchParams
      }
    }
  };
  return (
    <div className="flex items-center space-x-2">
      {/* Search input field */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update state on input
        placeholder="Enter search keywords"
        className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-secondaryColor w-64"
      />

      {/* Search button */}
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
