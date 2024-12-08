import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useSearchParams } from 'react-router-dom';
import { useGetAllTotalPaymentEventQuery } from 'Apis/eventApi';
import { PagingBar } from 'Components/UI';
import { inputHepler, toastNotify } from 'Helper';

interface EventPaymentSummary {
  idEvent: string;
  nameEvent: string;
  urlImage: string;
  organizationName: string;
  totalPayment: number; // Tổng số tiền
}

const filterOptions = ["All", "Active", "Inactive"];

function ReportPage() {
  // Local State
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({ searchString: "", status: "" });
  const [apiFilters, setApiFilters] = useState({ searchString: "", status: "" });
  const [eventPayments, setEventPayments] = useState<EventPaymentSummary[]>([]);

  // URL Search Params
  const [searchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);

  // API Hooks
  const { data: fetchedEventPayments, isFetching } = useGetAllTotalPaymentEventQuery({
    searchString: apiFilters.searchString,
    pageSize,
    pageNumber
  });

  // Handlers
  const handleFilter = () => {
    setApiFilters({ searchString: filters.searchString, status: filters.status });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedFilters = inputHepler(e, filters);
    setFilters(updatedFilters);
  };

  // Effects
  useEffect(() => {
    if (fetchedEventPayments) {
      setEventPayments(fetchedEventPayments?.apiResponse?.result);
      const { TotalRecords } = JSON.parse(fetchedEventPayments?.totalRecords || "{}");
      setTotalRecords(TotalRecords);
    }
  }, [fetchedEventPayments]);

  const columns: TableColumn<EventPaymentSummary>[] = [
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.urlImage || 'https://via.placeholder.com/50'}
          alt="Event"
          className="w-12 h-12 rounded-md"
          style={{ width: "50px", height: "50px", borderRadius: "6px" }}
        />
      ),
      sortable: false,
      width: "80px",
    },
    {
      name: 'Event Name',
      selector: row => row.nameEvent,
      sortable: true,
    },
    {
      name: 'Organization Name',
      selector: row => row.organizationName,
      sortable: true,
    },
    {
      name: 'Total Payment',
      selector: row => row.totalPayment,
      cell: row => (
        <span style={{ color: 'green' }}>${row.totalPayment}</span>
      ),
      sortable: true,
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "6px",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
        Event Payment Report
      </h2>

      {/* Filter Section */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.searchString}
          onChange={handleChange}
          name="searchString"
          className="w-full px-4 py-2 border rounded-md mb-2"
        />
        <select
          className="w-full px-4 py-2 border rounded-md mb-2"
          onChange={handleChange}
          name="status"
        >
          {filterOptions.map((item, index) => (
            <option key={index} value={item === "All" ? "" : item}>
              {item}
            </option>
          ))}
        </select>
        <button className="px-4 py-2 text-white bg-green-500 rounded" onClick={handleFilter}>
          Filter
        </button>
      </div>

      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <DataTable
            columns={columns}
            data={eventPayments}
            highlightOnHover
            striped
            customStyles={{
              table: {
                style: {
                  width: "100%",
                  minWidth: "700px",
                },
              },
            }}
          />
        </div>
      )}

      {/* Paging Bar */}
      <PagingBar totalRecords={totalRecords} />
    </div>
  );
}

export default ReportPage;