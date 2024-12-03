import React, { useState } from "react";
import { Button } from "@headlessui/react";
import { formatDateTime } from "Utility/formatDate";
import { toastNotify } from "Helper";
import { useSearchParams, useNavigate } from "react-router-dom";

interface FilterDateComponentProps {
  onFilter: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

const FilterDateComponent = ({ onFilter, onClose }: FilterDateComponentProps) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();


  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Kiểm tra ngày bắt đầu và kết thúc
    if (start < now) {
      toastNotify("Start date cannot be in the past!", "error");
      setLoading(false);
      return;
    }
    if (end < start) {
      toastNotify("End date must be later than the start date!", "error");
      setLoading(false);
      return;
    }

    // Gửi kết quả lọc
    onFilter(startDate, endDate);
    setLoading(false);
    onClose();
  };

  return (
    <form className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4" onSubmit={handleSubmit}>
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Date Range</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-600">End Date</label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Filter"}
        </Button>
      </div>
    </form>
  );
};

export default FilterDateComponent;
