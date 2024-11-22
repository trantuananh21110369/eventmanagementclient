import { useDeleteRoleMutation, useGetRolesByIdOrganizationQuery } from 'Apis/roleApi';
import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { RootState } from 'Storage/Redux/store';
import CreateRolePopup from './UpsertRolePopup';
import { apiResponse } from 'Interfaces';

interface ListRoleView {
  id: string;
  name: string;
}

function RoleList() {
  const idOrganization = useSelector((state: RootState) => state.organizationStore.idOrganization);
  const { data, isFetching } = useGetRolesByIdOrganizationQuery(idOrganization);
  const [deleteRole] = useDeleteRoleMutation();
  const [dataRoleList, setDataRoleList] = useState<ListRoleView[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentRoleId, setCurrentRoleId] = useState<string>('');

  useEffect(() => {
    if (data) {
      setDataRoleList(data?.result);
    }
  }, [data]);

  const columns: TableColumn<ListRoleView>[] = [
    {
      name: 'Role Name',
      selector: (row: ListRoleView) => row.name,
    },
    {
      name: 'Action',
      cell: (row: ListRoleView) => (
        <div>
          <button
            className="px-3 py-1 text-white bg-blue-500 rounded"
            onClick={() => handleDetail(row.id)}
          >
            Detail
          </button>
          <button
            className="px-3 py-1 text-white bg-red-500 rounded"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDetail = (id: string) => {
    setCurrentRoleId(id);
    toggleModal();
  };

  const handleCreatePopup = () => {
    setCurrentRoleId("");
    toggleModal();
  }

  const handleDelete = async (id: string) => {
    const apiRes: apiResponse = await deleteRole(id);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="p-3 shadow-lg">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold mb-3">List Roles</h2>
        <button
          className="px-3 py-1 text-white bg-green-500 rounded items-end"
          onClick={handleCreatePopup}
        >
          Create Role
        </button>
      </div>
      <DataTable columns={columns} data={dataRoleList} />

      {/* Modal component */}
      <CreateRolePopup
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        roleId={currentRoleId}
      />
    </div>
  );
}

export default RoleList;
