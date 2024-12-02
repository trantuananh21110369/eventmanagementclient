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

  const handleFilter = () => {
    setApiFilters({ searchString: filters.searchString });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedFilters = inputHepler(e, filters);
    setFilters(updatedFilters);
  };

  const columns: TableColumn<OverviewOrder>[] = [
    {
      name: '',
      cell: (row) => (
        <div className="w-20 h-20 overflow-hidden rounded-md shadow-md">
          <img src={row.urlImage} alt="Event" className="object-cover w-full h-full" />
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
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
          onClick={() => handleOpenDetailOrder(row.idOrderHeader)}
        >
          Detail
        </button>
      ),
    },
  ];

  const handleOpenDetailOrder = (id: number) => {
    toastNotify(`See Details for Order ID: ${id}`, 'info');
    navigate(`../order-detail/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">List Ticket Order</h2>

        {/* Search Section */}
        <div className="flex items-center justify-between px-6 mb-6 gap-2">
          <input
            type="text"
            placeholder="Search by Event Name"
            value={filters.searchString}
            name="searchString"
            onChange={handleChange}
            className="w-4/5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            className="px-6 py-2  w-1/6 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={handleFilter}
          >
            Search
          </button>
        </div>


        {/* Data Table */}
        <div className="px-6">
          <DataTable
            columns={columns}
            data={dataListOverviewOrder}
            progressPending={isFetching}
            pagination={false}
            customStyles={{
              rows: {
                style: {
                  minHeight: '72px',
                },
              },
              headCells: {
                style: {
                  fontWeight: 'bold',
                  fontSize: '16px',
                  backgroundColor: '#f9fafb',
                },
              },
              cells: {
                style: {
                  padding: '10px',
                },
              },
            }}
          />
        </div>

        {/* Paging Bar */}
        <div className="px-6 mt-4">
          <PagingBar totalRecords={totalRecords} />
        </div>
      </div>
    </div>
  );
};

export default ListOrder;
