import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import DataTable, { TableColumn } from 'react-data-table-component';
import { RootState } from 'Storage/Redux/store';
import { useGetOrdersByOrganizationIdQuery } from 'Apis/orderApi';
import { inputHepler, toastNotify } from 'Helper';
import { PagingBar } from 'Components/UI';
import { ListOrder } from 'Components/Page/Order';
// import OrderDetailPopup from './OrderDetailPopup';

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
      console.log(data)
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
    <div className="p-3 shadow-lg">
      <h2 className="text-lg font-bold mb-3">Orders Overview</h2>

      {/* Filter Section */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by order ID"
          value={filters.searchString}
          onChange={handleChange}
          name="searchString"
          className="w-full px-4 py-2 border rounded-md mb-2"
        />
        <button className="px-4 py-2 text-white bg-green-500 rounded" onClick={handleFilter}>
          Filter
        </button>
      </div>

      {/* Order List */}
      <ListOrder dataOrder={orderData} isLoading={isFetching} />
      {/* Paging Bar */}
      <PagingBar
        totalRecords={totalRecords}
      />
    </div>
  );
}

export default OrdersOverviewPage;