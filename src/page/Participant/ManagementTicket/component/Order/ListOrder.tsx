import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetOrdersByUserIdQuery } from 'Apis/orderApi';
import { RootState } from 'Storage/Redux/store';
import DataTable, { TableColumn } from 'react-data-table-component';
import { inputHepler, toastNotify } from 'Helper';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PagingBar } from 'Components/UI';

interface OverviewOrder {
  idOrderHeader: number;
  urlImage: string;
  nameEvent: string;
  orderDate: string;
  status: string;
  totalTicket: string;
  totalPrice: string;
}

const ListOrder = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.userAuthStore.id);

  // Local states
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ searchString: "" });
  const [apiFilters, setApiFilters] = useState({ searchString: '' });
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);
  const [dataListOverviewOrder, setDataListOverviewOrder] = useState<OverviewOrder[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const { data, isFetching } = useGetOrdersByUserIdQuery({
    userId,
    pageSize: pageSize,
    pageNumber: pageNumber,
    searchString: apiFilters.searchString,
  });

  useEffect(() => {
    if (data) {
      setDataListOverviewOrder(data?.apiResponse.result);
      const { TotalRecords } = JSON.parse(data?.totalRecords || '{}');
      setTotalRecords(TotalRecords);
    }
  }, [data]);

  // Apply filters
  const handleFilter = () => {
    setApiFilters({ searchString: filters.searchString });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedFilters = inputHepler(e, filters);
    setFilters(updatedFilters);
  };

  // Columns for Data Table
  const columns: TableColumn<OverviewOrder>[] = [
    {
      name: '',
      cell: (row) => (
        <div className="w-20 h-10 overflow-hidden rounded-sm">
          <img src={row.urlImage} alt="Event" className="object-cover object-center w-full h-full" />
        </div>
      ),
    },
    {
      name: 'Event',
      selector: (row) => row.nameEvent,
    },
    {
      name: 'Order Date',
      selector: (row) => row.orderDate,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
    },
    {
      name: 'Total Ticket',
      selector: (row) => row.totalTicket,
    },
    {
      name: 'Total Price',
      selector: (row) => row.totalPrice,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          className="px-3 py-1 text-white bg-blue-500 rounded"
          onClick={() => handleOpenDetailOrder(row.idOrderHeader)}
        >
          Detail
        </button>
      ),
    },
  ];

  const handleOpenDetailOrder = (id: number) => {
    toastNotify(`See Details for Order ID: ${id}`, 'info');
    navigate(`/detail-order/${id}`);
  };

  return (
    <div className="p-3 shadow-lg">
      <h2 className="text-lg font-bold mb-3">List Ticket Order</h2>

      {/* Search Section */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by Event Name"
          value={filters.searchString}
          name="searchString"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-2"
        />
        <button
          className="px-4 py-2 text-white bg-green-500 rounded"
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={dataListOverviewOrder} progressPending={isFetching} pagination={false} />

      {/* Paging Bar */}
      <PagingBar
        totalRecords={totalRecords}
      />
    </div>
  );
}

export default ListOrder;
