import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useAddMemberToOrganizationMutation, useGetMembersQuery } from 'Apis/roleApi';
import MemberList from '../components/MemberList';
import { PagingBar } from 'Components/UI';
import { inputHepler, toastNotify } from 'Helper';
import { RootState } from 'Storage/Redux/store';
import { apiResponse } from 'Interfaces';
import { toast } from 'react-toastify';

// Constants
const filterOptions = ["All", "Active", "Inactive"];

function MemberPage() {
  // State from Redux
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);

  // Local State
  const [totalRecords, setTotalRecords] = useState(0);
  const [input, setInput] = useState({ email: '' });
  const [filters, setFilters] = useState({ searchString: "", status: "" });
  const [apiFilters, setApiFilters] = useState({ searchString: "", status: "" });
  const [memberData, setMemberData] = useState([]);

  // URL Search Params
  const [searchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);

  // API Hooks
  const [addMember] = useAddMemberToOrganizationMutation();
  const { data, error, isFetching } = useGetMembersQuery({
    idOrganization,
    searchString: apiFilters.searchString,
    pageSize,
    pageNumber
  });

  // Handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInput = inputHepler(e, input);
    setInput(updatedInput);
  };

  const handleFilter = () => {
    setApiFilters({ searchString: filters.searchString, status: filters.status });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedFilters = inputHepler(e, filters);
    setFilters(updatedFilters);
  };

  const handleAddMember = async () => {
    if (!input.email) {
      toastNotify("Email is required", "error");
      return;
    }

    const res: apiResponse = await addMember({ idOrganization, emailUser: input.email });
    if (res.data?.isSuccess) {
      toastNotify("Add member success", "success");
      setInput({ email: '' }); // Clear input after adding
    }
    else {
      const error = res.data?.errorMessages?.[0];
      toastNotify(error?.toString() || "Add member is fail", "error");
    }
  };

  // Effects
  useEffect(() => {
    if (data) {
      setMemberData(data?.apiResponse?.result);
      const { TotalRecords } = JSON.parse(data?.totalRecords || "{}");
      setTotalRecords(TotalRecords);
    }
    if (error) {
      if ('status' in error && error.status === 403) {
        toastNotify("You don't have permission", "error");
      }
    }

  }, [data, error]);

  // JSX
  return (
    <div className="p-3 shadow-lg">
      <h2 className="text-lg font-bold mb-3">Member List</h2>

      {/* Add Member Section */}
      <div className="flex items-center mb-4">
        <input
          type="email"
          placeholder="Enter email"
          value={input.email}
          name="email"
          onChange={handleEmailChange}
          className="w-[50%] px-4 py-2 border rounded-md mb-2"
        />
        <button className="p-2 m-2 text-white bg-blue-500 rounded" onClick={handleAddMember}>
          Add Member
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex mb-4 justify-center">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.searchString}
          onChange={handleChange}
          name="searchString"
          className="w-[100%] px-4 py-2 border rounded-md mb-2"
        />
        {/* <select
          className="w-[20%] px-4 py-2 border rounded-md mb-2"
          onChange={handleChange}
          name="status"
        >
          {filterOptions.map((item, index) => (
            <option key={index} value={item === "All" ? "" : item}>
              {item}
            </option>
          ))}
        </select> */}
        <button className="p-2 m-2 text-white bg-green-500 rounded" onClick={handleFilter}>
          Filter
        </button>
      </div>

      {/* Member List */}
      <MemberList dataMemberList={memberData} isLoading={isFetching} />

      {/* Paging Bar */}
      <PagingBar totalRecords={totalRecords} />
    </div>
  );
}

export default MemberPage;
