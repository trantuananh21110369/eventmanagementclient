import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import DataTable, { TableColumn } from 'react-data-table-component';
import { RootState } from 'Storage/Redux/store';
import { useGetOrdersByOrganizationIdQuery } from 'Apis/orderApi';
import { inputHepler, toastNotify } from 'Helper';
import { PagingBar } from 'Components/UI';
import { ListOrder } from 'Components/Page/Order';

const OrdersOverviewPage = () => {
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);

  // Local states
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ searchString: "" });
  const [apiFilters, setApiFilters] = useState({ searchString: "" });
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);
  const [orderData, setOrderData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Api call
  const { data, isFetching } = useGetOrdersByOrganizationIdQuery({
    organizationId: idOrganization,
    searchString: apiFilters.searchString,
    pageSize: pageSize,
    pageNumber: pageNumber
  });

  useEffect(() => {
    if (data) {
      setOrderData(data?.apiResponse?.result);
      const { TotalRecords } = JSON.parse(data?.totalRecords || "{}");
      setTotalRecords(TotalRecords);
    }
  }, [data]);

  // Handle filter
  const handleFilter = () => {
    setApiFilters({ searchString: filters.searchString });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = inputHepler(e, filters);
    setFilters(updatedFilters);
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-5 text-gray-700">Orders Overview</h2>

      {/* Filter Section */}
      <div className="flex mb-6 items-center">
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <input
            type="text"
            placeholder="Search by Key word"
            value={filters.searchString}
            onChange={handleChange}
            name="searchString"
            className="w-full sm:w-80 px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="ml-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          onClick={handleFilter}
        >
          Search
        </button>
      </div>

      {/* Order List */}
      <div className="mb-6">
        <ListOrder dataOrder={orderData} isLoading={isFetching} />
      </div>

      {/* Paging Bar */}
      <div className="flex justify-end">
        <PagingBar totalRecords={totalRecords} />
      </div>
    </div>
  );
}

export default OrdersOverviewPage;
