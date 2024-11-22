import { useAddMemberToOrganizationMutation, useGetMembersQuery, useKickMemberInOrganizationMutation } from 'Apis/roleApi';
import { inputHepler, toastNotify } from 'Helper';
import { apiResponse } from 'Interfaces';
import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { RootState } from 'Storage/Redux/store';
import UpsertRoleUserPopup from './UpsertRoleUserPopup';
import { PagingBar } from 'Components/UI';
import { useSearchParams } from 'react-router-dom';

const filterOptions = [
  "All",
  "Active",
  "Inactive"
];

function MemberList() {
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);

  // Local states
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ searchString: "", status: "" });
  const [apiFilters, setApiFilters] = useState({ searchString: "", status: "" });
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10); const [memberData, setMemberData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState({ email: '' });

  // Api call
  const { data, isFetching } = useGetMembersQuery({
    idOrganization: idOrganization,
    searchString: apiFilters.searchString,
    pageSize: pageSize,
    pageNumber: pageNumber
  });
  const [addMember] = useAddMemberToOrganizationMutation();
  const [kickMember] = useKickMemberInOrganizationMutation();

  useEffect(() => {
    if (data) {
      setMemberData(data?.apiResponse?.result);
      const { TotalRecords } = JSON.parse(data?.totalRecords || "{}");
      setTotalRecords(TotalRecords);
    }
  }, [data]);

  // Handle input change for email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updateInput = inputHepler(e, input);
    setInput(updateInput);
  };

  //Handle filter
  const handleFilter = () => {
    setApiFilters({ searchString: filters.searchString, status: filters.status });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedFilters = inputHepler(e, filters);
    setFilters(updatedFilters);
  };

  // Handle member detail and open the modal
  const handleDetail = (idUser: string) => {
    setCurrentUserId(idUser);
    toggleModal();
  };

  // Kick member from organization
  const handleKick = async (memberId: string) => {
    const res: apiResponse = await kickMember(memberId);
    if (res.data?.isSuccess) {
      toastNotify("Kick member success", "success");
    }
  };

  // Add new member
  const handleAddMember = async () => {
    if (!input.email) {
      toastNotify("Email is required", "error");
      return;
    }

    const res: apiResponse = await addMember({ idOrganization: idOrganization, emailUser: input.email });
    if (res.data?.isSuccess) {
      toastNotify("Add member success", "success");
      input.email = '';  // Clear input after adding
    }
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Data table columns
  const columns: TableColumn<any>[] = [
    {
      name: 'Full Name',
      selector: row => row.user?.fullName,
    },
    {
      name: 'Email',
      selector: row => row.user?.email,
    },
    {
      name: "Action",
      cell: row => (
        <div>
          <button
            className="px-3 py-1 text-white bg-green-500 rounded"
            onClick={() => handleDetail(row.user.id)}
          >
            Detail
          </button>
          <button
            className="px-3 py-1 text-white bg-red-500 rounded"
            onClick={() => handleKick(row.memberId)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 shadow-lg">
      <h2 className="text-lg font-bold mb-3">Member List</h2>

      {/* Add Member Section */}
      <div className="flex mb-4">
        <input
          type="email"
          placeholder="Enter email"
          value={input.email}
          name="email"
          onChange={handleEmailChange}
          className="w-full px-4 py-2 border rounded-md mb-2"
        />
        <button className="px-4 py-2 text-white bg-blue-500 rounded" onClick={handleAddMember}>
          Add Member
        </button>
      </div>

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

      <DataTable columns={columns} data={memberData} progressPending={isFetching} pagination={false} />

      {/* Paging Bar */}
      <PagingBar
        totalRecords={totalRecords}
      />

      {/* Modal component */}
      <UpsertRoleUserPopup
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        userId={currentUserId}
      />
    </div>
  );
}

export default MemberList;
