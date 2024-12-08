import React, { useState } from "react";
import { Button } from "@headlessui/react";
import { toastNotify } from "Helper";
import { useSearchParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

interface FilterDateComponentProps {
  onFilter: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

const FilterDateComponent = ({ onFilter, onClose }: FilterDateComponentProps) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toastNotify("End date must be later than the start date!", "error");
      setLoading(false);
      return;
    }

    onFilter(startDate, endDate);
    setLoading(false);
    onClose();
  };

  return (
    <form
      className="flex flex-col gap-6 w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-bold text-gray-800">Filter by Date</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:ring focus:ring-gray-400 transition duration-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-400 transition duration-300"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Filter"}
        </Button>
      </div>
    </form>
  );
};

export default FilterDateComponent;
