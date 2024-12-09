import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetOrdersByUserIdQuery, useRetrieveOrderMutation } from 'Apis/orderApi';
import { RootState } from 'Storage/Redux/store';
import DataTable, { TableColumn } from 'react-data-table-component';
import { inputHepler, toastNotify } from 'Helper';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PagingBar } from 'Components/UI';
import { SD_OrderStatus } from 'Utility/SD';
import { apiResponse } from 'Interfaces';

interface OverviewOrder {
  idOrderHeader: number;
  urlImage: string;
  nameEvent: string;
  orderDate: string;
  status: string;
  totalTicket: string;
  totalPrice: string;
}

const StatusFilterOptions = [
  { value: '', label: 'All' }, // Hiển thị tất cả
  { value: SD_OrderStatus.PENDING, label: 'Pending' },
  { value: SD_OrderStatus.SUCCESSFUL, label: 'Successful' },
  { value: SD_OrderStatus.FAIL, label: 'Fail' },
];

const ListOrder = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.userAuthStore.id);

  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ searchString: '', statusFilter: '' });
  const [apiFilters, setApiFilters] = useState({ searchString: '', statusFilter: '' });
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);
  const [dataListOverviewOrder, setDataListOverviewOrder] = useState<OverviewOrder[]>([]);
  //Lazy Retrieve Payment 
  const [retrievePayment] = useRetrieveOrderMutation();
  const [totalRecords, setTotalRecords] = useState(0);

  const { data, isFetching } = useGetOrdersByUserIdQuery({
    userId,
    pageSize: pageSize,
    pageNumber: pageNumber,
    searchString: apiFilters.searchString,
    statusFilter: apiFilters.statusFilter,
  });

  useEffect(() => {
    if (data) {
      setDataListOverviewOrder(data?.apiResponse.result);
      const { TotalRecords } = JSON.parse(data?.totalRecords || '{}');
      setTotalRecords(TotalRecords);
    }
  }, [data]);

  const handleFilter = () => {
    setApiFilters({
      searchString: filters.searchString,
      statusFilter: filters.statusFilter,
    });
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
        <div className="flex space-x-4">
          <button
            className="px-2 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
            onClick={() => handleOpenDetailOrder(row.idOrderHeader)}
          >
            Detail
          </button>
          {row.status === SD_OrderStatus.PENDING && (
            <button
              className="px-3 py-1 text-xs text-white bg-green-600 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-300"
              onClick={() => handlePaymentRedirect(row.idOrderHeader)}
            >
              Pay Now
            </button>
          )}
        </div>
      ),
    },
  ];

  const handlePaymentRedirect = async (orderId: number) => {
    // Di chuyển người dùng tới trang thanh toán
    const rs: apiResponse = await retrievePayment({ orderHeaderId: orderId });
    if (rs.data?.isSuccess) {
      navigate('/payment', { state: { apiResult: rs?.data, userInput: data } });
    }
    else {
      toastNotify(rs?.data?.errorMessages?.[0] || "An unknown error occurred", "error");
    }
  };

  const handleOpenDetailOrder = (id: number) => {
    toastNotify(`See Details for Order ID: ${id}`, 'info');
    navigate(`order-detail/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">List Ticket Order</h2>

        {/* Search Section */}
        <div className="flex items-center justify-between px-6 mb-6 gap-2">
          {/* Input Search */}
          <input
            type="text"
            placeholder="Search by Event Name"
            value={filters.searchString}
            name="searchString"
            onChange={handleChange}
            className="w-3/5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* Dropdown Status Filter */}
          <select
            name="statusFilter" // Đúng tên state
            value={filters.statusFilter}
            onChange={handleChange}
            className="w-1/5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {StatusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button
            className="px-6 py-2 w-1/6 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
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
